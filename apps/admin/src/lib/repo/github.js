import "server-only";

// Inhalte über die GitHub-API lesen und schreiben.
// Änderungen landen als Commits auf dem Entwurfs-Branch; Vercel baut daraus eine Vorschau.
// Veröffentlichen = Entwurf in main übernehmen, danach wird der Entwurfs-Branch gelöscht.

const API = process.env.GITHUB_API_URL || "https://api.github.com";

function cfg() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) throw new Error("GITHUB_TOKEN oder GITHUB_REPO fehlt.");
  return { token, repo, base: process.env.GITHUB_BASE || "main", draft: process.env.GITHUB_DRAFT || "entwurf" };
}

class GitHubError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function gh(path, { method = "GET", body, raw = false, cache = "no-store" } = {}) {
  const { token, repo } = cfg();
  const res = await fetch(`${API}/repos/${repo}${path}`, {
    method,
    cache,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: raw ? "application/vnd.github.raw" : "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  if (!res.ok) {
    let msg = res.statusText;
    try {
      msg = (await res.json()).message || msg;
    } catch {}
    throw new GitHubError(res.status, `GitHub ${res.status}: ${msg}`);
  }
  return raw ? Buffer.from(await res.arrayBuffer()) : res.json();
}

async function refSha(branch) {
  try {
    const r = await gh(`/git/ref/heads/${encodeURIComponent(branch)}`);
    return r.object.sha;
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
}

// Dateibaum eines Commits (unveränderlich → zwischenspeicherbar)
const treeCache = new Map();
async function treeOf(commitSha) {
  if (treeCache.has(commitSha)) return treeCache.get(commitSha);
  const c = await gh(`/git/commits/${commitSha}`, { cache: "force-cache" });
  const t = await gh(`/git/trees/${c.tree.sha}?recursive=1`, { cache: "force-cache" });
  if (t.truncated) throw new Error("Dateibaum zu groß für die GitHub-API.");
  const map = new Map(t.tree.filter((x) => x.type === "blob").map((x) => [x.path, x.sha]));
  const out = { treeSha: c.tree.sha, files: map };
  if (treeCache.size > 50) treeCache.clear();
  treeCache.set(commitSha, out);
  return out;
}

async function blob(sha) {
  return gh(`/git/blobs/${sha}`, { raw: true, cache: sha ? "force-cache" : "no-store" });
}

export function createGitHubRepo() {
  const { base, draft } = cfg();
  let headPromise = null;

  // Stand, aus dem gelesen wird: Entwurf, sonst main. Einmal je Anfrage ermittelt.
  function head() {
    headPromise ??= (async () => {
      const d = await refSha(draft);
      return d ? { sha: d, branch: draft } : { sha: await refSha(base), branch: base };
    })();
    return headPromise;
  }

  return {
    mode: "github",

    async read(path) {
      const { sha } = await head();
      const { files } = await treeOf(sha);
      const b = files.get(path);
      return b ? { data: await blob(b), version: b } : null;
    },

    async list(dir) {
      const { sha } = await head();
      const { files } = await treeOf(sha);
      const prefix = dir.replace(/\/?$/, "/");
      return [...files.keys()].filter((p) => p.startsWith(prefix));
    },

    async createBlob(buffer) {
      const r = await gh(`/git/blobs`, { method: "POST", body: { content: buffer.toString("base64"), encoding: "base64" } });
      return r.sha;
    },

    // changes: [{ path, content: string|Buffer } | { path, blob: sha } | { path, delete: true }]
    async commit(changes, message) {
      if (!changes.length) return null;
      const baseSha = await refSha(base);
      let draftSha = await refSha(draft);
      if (!draftSha) {
        await gh(`/git/refs`, { method: "POST", body: { ref: `refs/heads/${draft}`, sha: baseSha } });
        draftSha = baseSha;
      } else {
        // Neuere Stände von main (z. B. Code-Änderungen) in den Entwurf übernehmen
        const cmp = await gh(`/compare/${encodeURIComponent(draft)}...${encodeURIComponent(base)}`);
        if (cmp.ahead_by > 0) {
          try {
            const m = await gh(`/merges`, {
              method: "POST",
              body: { base: draft, head: base, commit_message: `Aktuellen Stand von ${base} übernommen` },
            });
            if (m) draftSha = m.sha;
          } catch (e) {
            if (e.status === 409) throw new Error("Der Entwurf lässt sich nicht automatisch mit dem aktuellen Stand zusammenführen.");
            throw e;
          }
        }
      }
      const { treeSha, files } = await treeOf(draftSha);
      const tree = [];
      for (const ch of changes) {
        if (ch.delete) {
          if (files.has(ch.path)) tree.push({ path: ch.path, mode: "100644", type: "blob", sha: null });
          continue;
        }
        let sha = ch.blob;
        if (!sha) {
          const buf = Buffer.isBuffer(ch.content) ? ch.content : Buffer.from(ch.content, "utf8");
          sha = await this.createBlob(buf);
        }
        if (files.get(ch.path) !== sha) tree.push({ path: ch.path, mode: "100644", type: "blob", sha });
      }
      if (!tree.length) return null;
      const newTree = await gh(`/git/trees`, { method: "POST", body: { base_tree: treeSha, tree } });
      const commit = await gh(`/git/commits`, {
        method: "POST",
        body: { message, tree: newTree.sha, parents: [draftSha] },
      });
      await gh(`/git/refs/heads/${encodeURIComponent(draft)}`, { method: "PATCH", body: { sha: commit.sha } });
      headPromise = null;
      return commit.sha;
    },

    async status(site) {
      const d = await refSha(draft);
      if (!d) return { mode: "github", draft: false, files: [] };
      const cmp = await gh(`/compare/${encodeURIComponent(base)}...${encodeURIComponent(draft)}`);
      const files = (cmp.files || []).map((f) => f.filename);
      let preview = null;
      if (site?.vercelProject) {
        const deps = await gh(`/deployments?sha=${d}&per_page=20`);
        const dep = deps.find((x) => String(x.environment).endsWith(`– ${site.vercelProject}`)) || null;
        if (dep) {
          const st = await gh(`/deployments/${dep.id}/statuses?per_page=1`);
          const s = st[0];
          preview = { state: s?.state || "pending", url: s?.environment_url || s?.target_url || null };
        } else preview = { state: "queued", url: null };
      }
      return { mode: "github", draft: true, sha: d, ahead: cmp.ahead_by, files, preview };
    },

    async publish(message) {
      const d = await refSha(draft);
      if (!d) return false;
      try {
        await gh(`/merges`, { method: "POST", body: { base, head: draft, commit_message: message } });
      } catch (e) {
        if (e.status === 409) throw new Error("Konflikt beim Veröffentlichen – bitte melden.");
        throw e;
      }
      await gh(`/git/refs/heads/${encodeURIComponent(draft)}`, { method: "DELETE" });
      headPromise = null;
      return true;
    },

    async discard() {
      const d = await refSha(draft);
      if (d) await gh(`/git/refs/heads/${encodeURIComponent(draft)}`, { method: "DELETE" });
      headPromise = null;
      return true;
    },
  };
}
