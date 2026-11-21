import { defaultLocale, localize, locales, ogLocales } from "./config";
import { dictFor } from "./dict";

// Metadaten einer Seite: Canonical, Sprachverweise (hreflang) und Open Graph.
// path ist der interne (deutsche) Pfad, z. B. "/projekte/eismeer-hagenbeck".
export function pageMeta(lang, path, { title, description, type = "website" } = {}) {
  const d = dictFor(lang);
  const languages = Object.fromEntries(locales.map((l) => [l, localize(path, l)]));
  languages["x-default"] = localize(path, defaultLocale);
  return {
    ...(title ? { title } : {}),
    description: description || d.meta.description,
    alternates: { canonical: localize(path, lang), languages },
    openGraph: {
      type,
      url: localize(path, lang),
      title: title ? `${title} – ZQD` : d.meta.title,
      description: description || d.meta.description,
      siteName: "ZQD Zooquariumdesign",
      locale: ogLocales[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocales[l]),
    },
    twitter: { card: "summary_large_image" },
  };
}
