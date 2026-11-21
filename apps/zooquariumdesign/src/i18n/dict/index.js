import { readContent } from "@/content/load";

// Alle Texte der Oberfläche – content/texts/<sprache>.json
export const dicts = {
  de: readContent("texts/de.json"),
  en: readContent("texts/en.json"),
  tr: readContent("texts/tr.json"),
};

export function dictFor(lang) {
  return dicts[lang] || dicts.de;
}
