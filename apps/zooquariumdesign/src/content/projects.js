import { readContent } from "./load";
import { dicts } from "@/i18n/dict";

// Projekte – content/projects/<slug>.json, Reihenfolge in content/projects/index.json.
// Je Sprache ein Block (de/en/tr) mit Titel, Zoo, Ort, Kennzahlen, Text und Leistungen;
// images[0] ist das Titelbild. type, services und country bleiben intern deutsch
// (Filter, Adressen), für die Anzeige gibt es typeLabel und countryLabel.
const raw = readContent("projects/index.json").map((slug) => readContent(`projects/${slug}.json`));
const cache = {};

function localizeProject(p, lang) {
  const d = dicts[lang] || dicts.de;
  const t = { ...p.de, ...Object.fromEntries(Object.entries(p[lang] || {}).filter(([, v]) => v != null && v !== "")) };
  const name = [t.title, t.zoo, t.city].filter(Boolean).join(", ");
  const [cover, ...gallery] = p.images || [];
  return {
    slug: p.slug,
    type: p.type,
    services: p.services || [],
    country: p.country,
    year: p.year,
    title: t.title,
    zoo: t.zoo,
    city: t.city,
    facts: t.facts?.length ? t.facts : p.de.facts || [],
    text: t.text?.length ? t.text : p.de.text || [],
    scope: t.scope,
    countryLabel: d.values.countries[p.country] || p.country,
    typeLabel: d.values.types[p.type] || p.type,
    cover: { image: cover, alt: name },
    gallery: gallery.map((image, i) => ({ image, alt: `${name} – ${d.ui.image} ${i + 2}` })),
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
