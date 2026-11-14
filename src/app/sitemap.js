import { localize, locales } from "@/i18n/config";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

// Alle Seiten in allen Sprachen, jeweils mit Verweis auf die anderen Sprachfassungen.
const PAGES = [
  { path: "/", priority: 1 },
  { path: "/projekte", priority: 0.9 },
  { path: "/team", priority: 0.6 },
  { path: "/kontakt", priority: 0.7 },
  { path: "/impressum", priority: 0.2 },
  ...projects.map((p) => ({ path: `/projekte/${p.slug}`, priority: 0.8 })),
];

const abs = (path) => new URL(path, site.url).toString();

export default function sitemap() {
  return PAGES.flatMap(({ path, priority }) => {
    const languages = Object.fromEntries(locales.map((l) => [l, abs(localize(path, l))]));
    return locales.map((lang) => ({
      url: abs(localize(path, lang)),
      changeFrequency: path.startsWith("/projekte/") ? "yearly" : "monthly",
      priority,
      alternates: { languages },
    }));
  });
}
