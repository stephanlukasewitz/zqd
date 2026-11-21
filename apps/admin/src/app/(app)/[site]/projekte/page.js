import { getSite } from "@/lib/sites";
import { getProjects, readJSON, homeUsage } from "@/lib/content";
import ProjectList from "./ProjectList";

export const metadata = { title: "Projekte" };

export default async function Projects({ params }) {
  const site = getSite((await params).site);
  const [projects, home] = await Promise.all([getProjects(site), readJSON(site, "home.json", {})]);
  const rows = projects.map((p) => ({
    slug: p.slug,
    title: p.de.title,
    sub: [p.de.zoo, p.de.city, p.country].filter(Boolean).join(", "),
    type: p.type,
    cover: p.images?.[0] || null,
    count: p.images?.length || 0,
    missing: ["en", "tr"].filter((l) => !p[l]?.title || !p[l]?.text?.length),
    home: homeUsage(home, p.slug),
  }));
  return <ProjectList site={site.id} initial={rows} />;
}
