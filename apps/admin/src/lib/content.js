import "server-only";
import { getRepo } from "./repo";

// Lesen/Schreiben der Inhaltsdateien einer Website (content/*.json, public/media/*)
export const LANGS = ["de", "en", "tr"];
export const LANG_NAMES = { de: "Deutsch", en: "Englisch", tr: "Türkisch" };
export const TYPES = ["Masterplanung", "Tieranlage", "Aquarium", "Gebäude"];
export const SERVICES = ["Beratung", "Konzept", "Architektur", "Generalplanung", "Wettbewerb", "Pro Bono"];

export const contentPath = (site, rel) => `${site.dir}/content/${rel}`;
// "/media/projects/x/01.jpg" → "apps/…/public/media/projects/x/01.jpg"
export const mediaPath = (site, src) => `${site.dir}/public${src}`;

export async function readJSON(site, rel, fallback = null) {
  const f = await getRepo().read(contentPath(site, rel));
  if (!f) return fallback;
  return JSON.parse(f.data.toString("utf8"));
}

export const json = (data) => JSON.stringify(data, null, 2) + "\n";
export const write = (site, rel, data) => ({ path: contentPath(site, rel), content: json(data) });

export async function getProjects(site) {
  const index = await readJSON(site, "projects/index.json", []);
  const list = await Promise.all(index.map((slug) => readJSON(site, `projects/${slug}.json`)));
  return list.filter(Boolean);
}

export async function getTexts(site) {
  const out = {};
  for (const l of LANGS) out[l] = await readJSON(site, `texts/${l}.json`, {});
  return out;
}

// Wo auf der Startseite ein Projekt verwendet wird
export function homeUsage(home, slug) {
  const where = [];
  if (home.hero?.project === slug) where.push("Startbild");
  if (home.pair?.some((x) => x.project === slug)) where.push("Bildpaar");
  if (home.fields?.some((x) => x.project === slug)) where.push("Arbeitsfelder");
  if (home.phases?.some((x) => x.project === slug)) where.push("Planungsphasen");
  if (home.band?.project === slug) where.push("Bildband");
  if (home.cloud?.includes(slug)) where.push("Projektwolke");
  if (home.selected?.includes(slug)) where.push("Ausgewählte Projekte");
  return where;
}

export function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
