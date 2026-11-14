import { projects as raw } from "./projects.generated";
import en from "./i18n/projects.en.json";
import tr from "./i18n/projects.tr.json";
import { dicts } from "@/i18n/dict";

// Projektdaten liegen deutsch vor; Übersetzungen kommen aus i18n/projects.<lang>.json.
// Werte wie type, services und country bleiben intern deutsch (Filter, Adressen),
// für die Anzeige gibt es typeLabel und countryLabel.
const translations = { en, tr };
const cache = {};

function localizeProject(p, lang) {
  const d = dicts[lang] || dicts.de;
  const t = translations[lang]?.[p.slug];
  const title = t?.title || p.title;
  const zoo = t?.zoo ?? p.zoo;
  const city = t?.city ?? p.city;
  const country = d.values.countries[p.country] || p.country;
  const name = [title, zoo, city].filter(Boolean).join(", ");
  return {
    ...p,
    title,
    zoo,
    city,
    countryLabel: country,
    typeLabel: d.values.types[p.type] || p.type,
    facts: t?.facts || p.facts,
    text: t?.text || p.text,
    scope: t?.scope ?? p.scope,
    cover: { ...p.cover, alt: lang === "de" ? p.cover.alt : t?.alt || name },
    gallery: (p.gallery || []).map((g, i) => ({
      ...g,
      alt: lang === "de" ? g.alt : `${t?.alt || name} – ${d.ui.image} ${i + 2}`,
    })),
  };
}

export function getProjects(lang = "de") {
  if (!cache[lang]) cache[lang] = raw.map((p) => localizeProject(p, lang));
  return cache[lang];
}

// Deutsch als Standard für bestehende Aufrufe
export const projects = getProjects("de");

export function getProject(slug, lang = "de") {
  return getProjects(lang).find((p) => p.slug === slug);
}

export function placeOf(p) {
  return [p.city, p.countryLabel || p.country].filter(Boolean).join(", ");
}

// Filterwerte nur anbieten, wenn es dafür wirklich Referenzen gibt (P02).
const TYPE_ORDER = ["Masterplanung", "Tieranlage", "Aquarium", "Gebäude"];
const SERVICE_ORDER = ["Beratung", "Konzept", "Architektur", "Generalplanung", "Wettbewerb", "Pro Bono"];

// Optionen als [Wert, Anzeige]
export function filterOptions(lang = "de", list = getProjects(lang)) {
  const d = dicts[lang] || dicts.de;
  const types = TYPE_ORDER.filter((t) => list.some((p) => p.type === t)).map((t) => [t, d.values.types[t] || t]);
  const services = SERVICE_ORDER.filter((s) => list.some((p) => p.services.includes(s))).map((s) => [
    s,
    d.values.services[s] || s,
  ]);
  const countries = [...new Set(list.map((p) => p.country).filter(Boolean))]
    .map((c) => [c, d.values.countries[c] || c])
    .sort((a, b) => (a[0] === "Deutschland" ? -1 : b[0] === "Deutschland" ? 1 : a[1].localeCompare(b[1], lang)));
  return { types, services, countries };
}

// Für Client-Komponenten: nur die Daten, die die Galerie braucht.
export function toCard(p) {
  return {
    slug: p.slug,
    title: p.title,
    zoo: p.zoo,
    city: p.city,
    country: p.country,
    countryLabel: p.countryLabel,
    type: p.type,
    typeLabel: p.typeLabel,
    services: p.services,
    cover: p.cover,
  };
}
