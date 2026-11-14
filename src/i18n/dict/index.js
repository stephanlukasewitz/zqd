import de from "./de";
import en from "./en";
import tr from "./tr";

export const dicts = { de, en, tr };

export function dictFor(lang) {
  return dicts[lang] || de;
}
