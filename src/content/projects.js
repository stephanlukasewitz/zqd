import { projects as raw } from "./projects.generated";

export const projects = raw;

export function getProject(slug) {
  return projects.find((p) => p.slug === slug);
}

export function placeOf(p) {
  return [p.city, p.country].filter(Boolean).join(", ");
}

// Filterwerte nur anbieten, wenn es dafür wirklich Referenzen gibt (P02).
const TYPE_ORDER = ["Masterplanung", "Tieranlage", "Aquarium", "Gebäude"];
const SERVICE_ORDER = [
  "Beratung",
  "Konzept",
  "Architektur",
  "Generalplanung",
  "Wettbewerb",
  "Pro Bono",
];

export function filterOptions(list = projects) {
  const types = TYPE_ORDER.filter((t) => list.some((p) => p.type === t));
  const services = SERVICE_ORDER.filter((s) =>
    list.some((p) => p.services.includes(s)),
  );
  const countries = [...new Set(list.map((p) => p.country).filter(Boolean))].sort(
    (a, b) => (a === "Deutschland" ? -1 : b === "Deutschland" ? 1 : a.localeCompare(b, "de")),
  );
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
    type: p.type,
    services: p.services,
    cover: p.cover,
  };
}
