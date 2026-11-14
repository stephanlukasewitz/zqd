import { locales } from "@/i18n/config";
import { getProject, placeOf, projects } from "@/content/projects";
import { renderOg, size, contentType } from "@/server/og";

// Vorschaubild je Projekt und Sprache: Titelbild, Projektname, Ort.
export { size, contentType };
export const alt = "ZQD Zooquariumdesign";

export function generateStaticParams() {
  return locales.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));
}

export default async function Image({ params }) {
  const { lang, slug } = await params;
  const p = getProject(slug, lang) || getProject(slug);
  return renderOg({
    photo: `${p.slug}.jpg`,
    kicker: [p.zoo, placeOf(p)].filter(Boolean).join(" · "),
    lines: [p.title],
  });
}
