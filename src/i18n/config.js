// Sprachen und Adressen. Deutsch ist Standard und hat kein Präfix (/projekte),
// Englisch und Türkisch haben eins und eigene Pfadnamen (/en/projects, /tr/projeler).
// Intern liegen alle Seiten unter app/[lang]/ mit den deutschen Ordnernamen;
// next.config.mjs ordnet die öffentlichen Adressen per Rewrite zu.

export const locales = ["de", "en", "tr"];
export const defaultLocale = "de";

export const langNames = { de: "Deutsch", en: "English", tr: "Türkçe" };
export const ogLocales = { de: "de_DE", en: "en_GB", tr: "tr_TR" };

// Erster Pfadabschnitt: intern (deutsch) → öffentlich je Sprache
export const SEGMENTS = {
  en: { projekte: "projects", team: "team", kontakt: "contact", impressum: "imprint", datenschutz: "privacy" },
  tr: { projekte: "projeler", team: "ekip", kontakt: "iletisim", impressum: "kunye", datenschutz: "gizlilik" },
};

const prefixed = locales.filter((l) => l !== defaultLocale);

export function isLocale(v) {
  return locales.includes(v);
}

function split(href) {
  const m = String(href).match(/^([^?#]*)(.*)$/);
  return [m[1] || "/", m[2] || ""];
}

// Interne Adresse (deutsch, z. B. "/projekte/eismeer?art=Aquarium") → öffentliche Adresse der Sprache.
// Bereits lokalisierte Adressen bleiben unverändert.
export function localize(href, lang = defaultLocale) {
  if (typeof href !== "string" || !href.startsWith("/") || href.startsWith("//")) return href;
  const [path, rest] = split(href);
  const parts = path.split("/").filter(Boolean);
  if (prefixed.includes(parts[0])) return href;
  if (lang === defaultLocale || !SEGMENTS[lang]) return href;
  if (parts[0]) parts[0] = SEGMENTS[lang][parts[0]] ?? parts[0];
  return `/${[lang, ...parts].join("/")}${rest}`;
}

// Öffentliche Adresse → { lang, path } mit internem (deutschem) Pfad.
export function parsePath(pathname = "/") {
  const parts = String(pathname).split("/").filter(Boolean);
  if (prefixed.includes(parts[0])) {
    const lang = parts.shift();
    if (parts[0]) {
      const back = Object.entries(SEGMENTS[lang]).find(([, pub]) => pub === parts[0]);
      if (back) parts[0] = back[0];
    }
    return { lang, path: `/${parts.join("/")}` };
  }
  return { lang: defaultLocale, path: `/${parts.join("/")}` };
}

// Dieselbe Seite in einer anderen Sprache.
export function switchLocale(pathname, search, to) {
  const { path } = parsePath(pathname);
  return localize(path + (search || ""), to);
}

// Platzhalter in Texten ersetzen: fmt("{n} Projekte", { n: 3 })
export function fmt(str, vars = {}) {
  return String(str).replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
}
