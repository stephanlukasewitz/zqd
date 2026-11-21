import { readContent } from "./load";
import { getProject } from "./projects";

// Bildauswahl der Startseite – content/home.json (Texte stehen in content/texts).
export const home = readContent("home.json");

// Bild eines Projekts (0 = Titelbild, n = n-tes Galeriebild) samt Bildunterschrift in der Sprache.
export function pic(slug, i = 0, lang = "de") {
  const p = getProject(slug, lang);
  const g = i === 0 ? p.cover : p.gallery[i - 1] || p.cover;
  return { slug, image: g.image, alt: g.alt, title: p.title, zoo: p.zoo, city: p.city, type: p.type };
}

// Bilder zu den drei Planungsphasen
export function phaseImages(lang = "de") {
  return home.phases.map((x) => pic(x.project, x.image, lang));
}

// Hero: Bild aus home.json, Bezeichnung aus dem verknüpften Projekt
export function heroImage(lang = "de") {
  const p = getProject(home.hero.project, lang);
  return { image: home.hero.image, slug: home.hero.project, alt: p.cover.alt, title: [p.title, p.zoo].filter(Boolean).join(", ") };
}
