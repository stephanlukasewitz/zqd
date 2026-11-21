"use server";
import { getSite } from "@/lib/sites";
import { getRepo } from "@/lib/repo";
import { assertSession } from "@/lib/session";
import { LANGS, TYPES, SERVICES, contentPath, getProjects, homeUsage, json, mediaPath, readJSON, write } from "@/lib/content";

// Alle Aktionen: angemeldet sein, Website prüfen, Fehler als Text zurückgeben
function action(fn) {
  return async (siteId, ...args) => {
    try {
      await assertSession();
      const site = getSite(siteId);
      if (!site) throw new Error("Unbekannte Website.");
      return (await fn(site, ...args)) || { ok: true };
    } catch (e) {
      console.error(e);
      return { error: e.message || "Unbekannter Fehler." };
    }
  };
}

const str = (v, max = 5000) => String(v ?? "").trim().slice(0, max);
const strList = (v) => (Array.isArray(v) ? v.map((x) => str(x)).filter(Boolean) : []);
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Neues Bild ({ blob, width, height }) an einen Pfad legen; vorhandenes Bild unverändert übernehmen
function placeImage(img, makeSrc, changes) {
  if (!img) return null;
  if (img.blob) {
    const src = makeSrc();
    changes.push({ path: `__media__${src}`, blob: img.blob });
    return { src, width: Math.round(img.width), height: Math.round(img.height) };
  }
  if (typeof img.src === "string" && img.src.startsWith("/media/")) return { src: img.src, width: img.width, height: img.height };
  return null;
}
const resolveMedia = (site, changes) =>
  changes.map((c) => (c.path.startsWith("__media__") ? { ...c, path: mediaPath(site, c.path.slice(9)) } : c));

const pad = (n) => String(n).padStart(2, "0");

export const publishDraft = action(async (site) => {
  await getRepo().publish(`Inhalte veröffentlicht (${site.name})`);
});

export const discardDraft = action(async (site) => {
  await getRepo().discard(site);
});

// ---------- Projekte
export const saveProject = action(async (site, input) => {
  const repo = getRepo();
  const isNew = !!input.isNew;
  const slug = str(input.slug, 80);
  if (!SLUG.test(slug)) throw new Error("Die Adresse darf nur Kleinbuchstaben, Ziffern und Bindestriche enthalten.");
  const index = await readJSON(site, "projects/index.json", []);
  const old = isNew ? null : await readJSON(site, `projects/${slug}.json`);
  if (isNew && index.includes(slug)) throw new Error("Es gibt bereits ein Projekt mit dieser Adresse.");
  if (!isNew && !old) throw new Error("Projekt nicht gefunden.");

  const d = input.data || {};
  const type = TYPES.includes(d.type) ? d.type : TYPES[1];
  const services = SERVICES.filter((s) => (d.services || []).includes(s));
  const country = str(d.country, 80) || null;
  const year = d.year === "" || d.year == null ? null : Number.isFinite(+d.year) ? Math.round(+d.year) : str(d.year, 20);
  const lang = (l) => {
    const x = d[l] || {};
    return {
      title: str(x.title, 200),
      zoo: str(x.zoo, 200),
      city: str(x.city, 120),
      facts: strList(x.facts),
      text: strList(x.text),
      scope: str(x.scope, 500) || null,
    };
  };
  const de = lang("de");
  if (!de.title) throw new Error("Gib bitte einen deutschen Titel an.");

  // Bilder: vorhandene behalten, neue nummerieren, entfernte löschen
  const dir = `/media/projects/${slug}`;
  const existing = await repo.list(mediaPath(site, dir));
  let next = Math.max(0, ...existing.map((p) => parseInt(p.split("/").pop(), 10) || 0)) + 1;
  const changes = [];
  const images = (input.images || []).map((img) => placeImage(img, () => `${dir}/${pad(next++)}.jpg`, changes)).filter(Boolean);
  if (!images.length) throw new Error("Füge bitte mindestens ein Bild hinzu.");
  const keep = new Set(images.map((i) => i.src));
  for (const img of old?.images || []) if (!keep.has(img.src)) changes.push({ path: mediaPath(site, img.src), delete: true });

  const project = { slug, type, services, country, year, de, en: lang("en"), tr: lang("tr"), images };
  changes.push(write(site, `projects/${slug}.json`, project));
  if (isNew) changes.push(write(site, "projects/index.json", [slug, ...index]));

  // Startseite: Bildnummern nachziehen, wenn Bilder umsortiert oder gelöscht wurden
  if (old) {
    const home = await readJSON(site, "home.json");
    const remap = (ref) => {
      if (!ref || ref.project !== slug || typeof ref.image !== "number") return false;
      const src = old.images[ref.image]?.src;
      const ni = Math.max(0, images.findIndex((i) => i.src === src));
      if (ni === ref.image) return false;
      ref.image = ni;
      return true;
    };
    let changed = false;
    for (const ref of [...(home.pair || []), ...(home.fields || []), ...(home.phases || []), home.band]) changed = remap(ref) || changed;
    if (changed) changes.push(write(site, "home.json", home));
  }

  // Neues Land: Übersetzungen in die Texte eintragen
  if (country) {
    const labels = input.countryLabels || {};
    for (const l of LANGS) {
      const t = await readJSON(site, `texts/${l}.json`, {});
      t.values ??= {};
      t.values.countries ??= {};
      const want = l === "de" ? null : str(labels[l], 80);
      if (want && t.values.countries[country] !== want) {
        t.values.countries[country] = want;
        changes.push(write(site, `texts/${l}.json`, t));
      }
    }
  }

  await repo.commit(resolveMedia(site, changes), `${isNew ? "Projekt angelegt" : "Projekt bearbeitet"}: ${de.title}`);
  return { ok: true, slug };
});

export const deleteProject = action(async (site, slug) => {
  const home = await readJSON(site, "home.json");
  const used = homeUsage(home, slug);
  if (used.length) throw new Error(`Das Projekt wird auf der Startseite verwendet (${used.join(", ")}). Ersetze es dort bitte zuerst.`);
  const p = await readJSON(site, `projects/${slug}.json`);
  if (!p) throw new Error("Projekt nicht gefunden.");
  const index = await readJSON(site, "projects/index.json", []);
  const changes = [
    write(site, "projects/index.json", index.filter((s) => s !== slug)),
    { path: contentPath(site, `projects/${slug}.json`), delete: true },
    ...(p.images || []).map((i) => ({ path: mediaPath(site, i.src), delete: true })),
  ];
  await getRepo().commit(changes, `Projekt gelöscht: ${p.de?.title || slug}`);
});

export const reorderProjects = action(async (site, order) => {
  const index = await readJSON(site, "projects/index.json", []);
  const clean = order.filter((s) => index.includes(s));
  if (clean.length !== index.length || new Set(clean).size !== clean.length) throw new Error("Reihenfolge unvollständig.");
  await getRepo().commit([write(site, "projects/index.json", clean)], "Reihenfolge der Projekte geändert");
});

// ---------- Startseite
export const saveHome = action(async (site, input) => {
  const repo = getRepo();
  const old = await readJSON(site, "home.json");
  const slugs = new Set((await getProjects(site)).map((p) => p.slug));
  const ref = (r) => {
    if (!r || !slugs.has(r.project)) throw new Error("Wähle bitte für jede Position ein Projekt.");
    return { project: r.project, image: Math.max(0, Math.round(+r.image || 0)) };
  };
  const changes = [];
  const heroFiles = await repo.list(mediaPath(site, "/media/home"));
  let n = Math.max(0, ...heroFiles.map((p) => parseInt(p.match(/hero-(\d+)/)?.[1], 10) || 0)) + 1;
  const heroImage = placeImage(input.hero?.image, () => `/media/home/hero-${n++}.jpg`, changes) || old.hero.image;
  if (!slugs.has(input.hero?.project)) throw new Error("Wähle bitte ein Projekt zum Startbild.");
  const home = {
    ...old,
    hero: { project: input.hero.project, image: heroImage },
    pair: (input.pair || []).slice(0, 2).map(ref),
    fields: (input.fields || []).slice(0, 3).map((f, i) => ({ type: old.fields[i]?.type || f.type, ...ref(f) })),
    phases: (input.phases || []).slice(0, 3).map(ref),
    band: ref(input.band),
    cloud: (input.cloud || []).filter((s) => slugs.has(s)),
  };
  if (home.pair.length !== 2 || home.phases.length !== 3 || home.fields.length !== 3) throw new Error("Auswahl unvollständig.");
  if (home.cloud.length < 6) throw new Error("Die Projektwolke braucht mindestens 6 Projekte.");
  changes.push(write(site, "home.json", home));
  await repo.commit(resolveMedia(site, changes), "Startseite bearbeitet");
});

// ---------- Team & Partner
export const saveTeam = action(async (site, input) => {
  const repo = getRepo();
  const old = await readJSON(site, "team.json", { people: [], partners: [] });
  const changes = [];
  const tri = (v) => Object.fromEntries(LANGS.map((l) => [l, str(v?.[l], 300)]));
  const uid = () => Math.random().toString(36).slice(2, 8);
  const people = (input.people || []).map((p) => {
    const id = SLUG.test(p.id || "") ? p.id : `person-${uid()}`;
    const image = placeImage(p.image, () => `/media/team/${id}-${uid()}.jpg`, changes);
    if (!str(p.name)) throw new Error("Jede Person braucht einen Namen.");
    if (!image) throw new Error(`Füge bitte ein Foto für ${p.name} hinzu.`);
    return { id, name: str(p.name, 120), role: tri(p.role), degree: tri(p.degree), focus: tri(p.focus), experience: tri(p.experience), email: str(p.email, 120), image };
  });
  const partners = (input.partners || []).map((p) => {
    const id = SLUG.test(p.id || "") ? p.id : `partner-${uid()}`;
    const logo = placeImage(p.logo, () => `/media/partners/${id}-${uid()}.png`, changes);
    if (!str(p.name)) throw new Error("Jeder Partner braucht einen Namen.");
    if (!logo) throw new Error(`Füge bitte ein Logo für ${p.name} hinzu.`);
    const field = tri(p.field);
    return { id, name: str(p.name, 120), field: field.de ? field : null, url: str(p.url, 300), logo };
  });
  const keep = new Set([...people.map((p) => p.image.src), ...partners.map((p) => p.logo.src)]);
  for (const src of [...old.people.map((p) => p.image?.src), ...old.partners.map((p) => p.logo?.src)])
    if (src && !keep.has(src)) changes.push({ path: mediaPath(site, src), delete: true });
  changes.push(write(site, "team.json", { ...old, people, partners }));
  await repo.commit(resolveMedia(site, changes), "Team & Partner bearbeitet");
});

// ---------- Texte
export const saveTexts = action(async (site, texts) => {
  const changes = [];
  for (const l of LANGS) {
    if (!texts?.[l] || typeof texts[l] !== "object") continue;
    const cur = await readJSON(site, `texts/${l}.json`, {});
    if (json(cur) !== json(texts[l])) changes.push(write(site, `texts/${l}.json`, texts[l]));
  }
  if (!changes.length) return { ok: true, unchanged: true };
  await getRepo().commit(changes, "Texte bearbeitet");
});

// ---------- Kontaktdaten
export const saveSiteInfo = action(async (site, input) => {
  const old = await readJSON(site, "site.json", {});
  const keys = ["legalName", "description", "email", "phone", "street", "zip", "city", "country", "mapsQuery"];
  const next = { ...old };
  for (const k of keys) if (k in input) next[k] = str(input[k], 500);
  const lat = parseFloat(input.lat), lng = parseFloat(input.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) next.geo = { lat, lng };
  await getRepo().commit([write(site, "site.json", next)], "Kontaktdaten bearbeitet");
});
