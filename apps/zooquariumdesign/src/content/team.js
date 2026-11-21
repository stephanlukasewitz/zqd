import { readContent } from "./load";

// Team und Partner – content/team.json. Texte je Sprache (de/en/tr);
// Angaben in eckigen Klammern sind Platzhalter.
const pick = (v, lang) => (v && typeof v === "object" ? v[lang] || v.de : v) || "";

export function getTeam(lang = "de") {
  const { people, partners } = readContent("team.json");
  return {
    team: people.map((p) => ({
      id: p.id,
      name: p.name,
      role: pick(p.role, lang),
      degree: pick(p.degree, lang),
      focus: pick(p.focus, lang),
      experience: pick(p.experience, lang),
      email: p.email || "",
      image: p.image,
    })),
    partners: partners.map((p) => ({
      id: p.id,
      name: p.name,
      field: pick(p.field, lang),
      url: p.url || "",
      image: p.logo,
    })),
  };
}
