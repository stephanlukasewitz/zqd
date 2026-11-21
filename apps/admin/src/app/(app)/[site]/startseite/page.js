import { getSite } from "@/lib/sites";
import { getProjects, readJSON } from "@/lib/content";
import HomeForm from "./HomeForm";

export const metadata = { title: "Startseite" };

export default async function HomePage({ params }) {
  const site = getSite((await params).site);
  const [projects, home, de] = await Promise.all([getProjects(site), readJSON(site, "home.json"), readJSON(site, "texts/de.json", {})]);
  const phaseLabels = (de.home?.phases || []).map((x) => x.label).filter(Boolean);
  const list = projects.map((p) => ({ slug: p.slug, title: p.de.title, zoo: p.de.zoo, type: p.type, images: p.images || [] }));
  return <HomeForm site={site.id} initial={home} projects={list} phaseLabels={phaseLabels} />;
}
