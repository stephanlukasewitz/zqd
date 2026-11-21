import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

// Nur für die Entwicklung: liest und schreibt direkt im lokalen Repository.
// Entwurf = ungespeicherte Änderungen im Arbeitsverzeichnis; „Veröffentlichen“ macht nichts.
const run = promisify(execFile);
const BLOBS = path.join(os.tmpdir(), "zqd-admin-blobs");

export function createLocalRepo() {
  const root = path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.LOCAL_REPO || "../..");
  const abs = (p) => {
    const a = path.resolve(/*turbopackIgnore: true*/ root, p);
    if (!a.startsWith(root + path.sep)) throw new Error("Ungültiger Pfad");
    return a;
  };
  const git = (args) => run("git", args, { cwd: root }).then((r) => r.stdout);

  return {
    mode: "local",
    async read(p) {
      try {
        const data = await fs.readFile(/*turbopackIgnore: true*/ abs(p));
        const st = await fs.stat(/*turbopackIgnore: true*/ abs(p));
        return { data, version: String(st.mtimeMs) };
      } catch {
        return null;
      }
    },
    async list(dir) {
      const out = [];
      async function walk(d) {
        let entries = [];
        try {
          entries = await fs.readdir(/*turbopackIgnore: true*/ abs(d), { withFileTypes: true });
        } catch {
          return;
        }
        for (const e of entries) {
          const rel = `${d}/${e.name}`;
          if (e.isDirectory()) await walk(rel);
          else out.push(rel);
        }
      }
      await walk(dir.replace(/\/$/, ""));
      return out;
    },
    async createBlob(buffer) {
      await fs.mkdir(/*turbopackIgnore: true*/ BLOBS, { recursive: true });
      const id = crypto.createHash("sha1").update(buffer).digest("hex");
      await fs.writeFile(/*turbopackIgnore: true*/ path.join(BLOBS, id), buffer);
      return id;
    },
    async commit(changes) {
      for (const ch of changes) {
        const a = abs(ch.path);
        if (ch.delete) {
          await fs.rm(/*turbopackIgnore: true*/ a, { force: true });
          continue;
        }
        await fs.mkdir(/*turbopackIgnore: true*/ path.dirname(a), { recursive: true });
        const data = ch.blob ? await fs.readFile(/*turbopackIgnore: true*/ path.join(BLOBS, ch.blob)) : ch.content;
        await fs.writeFile(/*turbopackIgnore: true*/ a, data);
      }
      return "local";
    },
    async status(site) {
      const dirs = site ? [`${site.dir}/content`, `${site.dir}/public/media`] : ["."];
      const out = await git(["status", "--porcelain", "--untracked-files=all", "--", ...dirs]);
      const files = out.split("\n").filter(Boolean).map((l) => l.slice(3));
      return { mode: "local", draft: files.length > 0, files, preview: { state: "success", url: "http://localhost:3000" } };
    },
    async publish() {
      return true;
    },
    async discard(site) {
      const dirs = [`${site.dir}/content`, `${site.dir}/public/media`];
      await git(["checkout", "--", ...dirs]);
      await git(["clean", "-fdq", "--", ...dirs]);
      return true;
    },
  };
}
