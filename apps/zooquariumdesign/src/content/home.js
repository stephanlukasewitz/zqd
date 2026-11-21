// Bilder und Projektbezüge der Startseite. Die Texte stehen in den Wörterbüchern (src/i18n/dict).
import { getProject } from "./projects";
import { homeMedia } from "./media";

// Bild eines Projekts (0 = Titelbild, n = n-tes Galeriebild) samt Bildunterschrift in der Sprache.
export function pic(slug, i = 0, lang = "de") {
  const p = getProject(slug, lang);
  const g = i === 0 ? p.cover : p.gallery[i - 1];
  return { slug, image: g.image, alt: g.alt, title: p.title, zoo: p.zoo, city: p.city, type: p.type };
}

// Bilder zu den drei Planungsphasen
export function phaseImages(lang = "de") {
  return [pic("eisbaergehege-schoenbrunn", 0, lang), pic("haus-der-giganten-verona", 1, lang), pic("biodome-budapest", 0, lang)];
}

// Hero: Tiefseebecken im Tropen-Aquarium
export function heroImage(lang = "de") {
  const h = homeMedia.hero[1];
  const p = getProject(h.slug, lang);
  return { ...h, alt: p.cover.alt, title: [p.title, p.zoo].filter(Boolean).join(", ") };
}
