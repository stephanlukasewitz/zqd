import { localize } from "@/i18n/config";
import { dictFor } from "@/i18n/dict";
import { getProjects, placeOf } from "@/content/projects";
import { site } from "@/content/site";

// /llms.txt – kompakte Übersicht für Sprachmodelle und KI-Assistenten (Vorschlag von llmstxt.org).
// Englisch als gemeinsame Sprache, mit Links auf alle drei Sprachfassungen.

const abs = (path) => new URL(path, site.url).toString();
const first = (text = "") => (text.match(/^.*?[.!?](\s|$)/)?.[0] || text).trim();

export function GET() {
  const en = dictFor("en");
  const projects = getProjects("en");
  const h = en.home;

  const lines = [
    `# ZQD GmbH – Zooquariumdesign`,
    "",
    `> ${en.meta.description} Based in Hamburg, Germany. Working internationally for zoos, animal parks and aquariums.`,
    "",
    `ZQD (Zooquariumdesign · Architekturgarage) is an architecture and general planning practice specialised in zoological institutions: masterplans for entire zoos, animal enclosures and houses, and aquariums. As general planners, ZQD coordinates zoology, architecture and specialist engineering across all HOAI work stages (1–9).`,
    "",
    `- Claim: "${h.claim.join(" ")}" (German: "Erfahrung als Fundament. Entwicklung als Anspruch.")`,
    `- Principles: ${h.principles.items.map(([a]) => a.replace(/\.$/, "")).join("; ")}.`,
    `- Languages: German (default, ${abs("/")}), English (${abs("/en")}), Turkish (${abs("/tr")})`,
    "",
    "## Contact",
    "",
    `- Company: ${site.legalName}`,
    `- Address: ${site.street}, ${site.zip} ${site.city}, Germany`,
    `- Email: ${site.email}`,
    `- Phone: ${site.phone}`,
    `- Contact page: ${abs(localize("/kontakt", "en"))}`,
    "",
    "## Pages",
    "",
    `- [Home](${abs("/en")}): positioning, planning principles, fields of work, planning stages, general planning`,
    `- [Projects](${abs(localize("/projekte", "en"))}): all ${projects.length} reference projects, filterable by type, service and country`,
    `- [Team](${abs(localize("/team", "en"))}): people and partner network`,
    `- [Contact](${abs(localize("/kontakt", "en"))}): enquiry form, address and directions`,
    `- [Imprint](${abs("/impressum")}) and [privacy policy](${abs("/datenschutz")}) (German only)`,
    "",
    "## Projects",
    "",
    ...projects.map((p) => {
      const meta = [p.zoo, placeOf(p), p.typeLabel].filter(Boolean).join(", ");
      const summary = first(p.text?.[0]);
      return `- [${p.title}](${abs(localize(`/projekte/${p.slug}`, "en"))}): ${meta}.${summary ? ` ${summary}` : ""}`;
    }),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
