import { lang as rootLang } from "next/root-params";
import { defaultLocale, isLocale } from "./config";
import { dictFor } from "./dict";

// Aktuelle Sprache in Server-Komponenten (aus dem Wurzel-Segment app/[lang]).
export async function getLang() {
  const l = await rootLang();
  return isLocale(l) ? l : defaultLocale;
}

export async function getDict() {
  return dictFor(await getLang());
}
