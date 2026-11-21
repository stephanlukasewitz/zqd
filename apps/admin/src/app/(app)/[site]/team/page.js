import { getSite } from "@/lib/sites";
import { readJSON } from "@/lib/content";
import TeamForm from "./TeamForm";

export const metadata = { title: "Team & Partner" };

export default async function TeamPage({ params }) {
  const site = getSite((await params).site);
  const team = await readJSON(site, "team.json", { people: [], partners: [] });
  return <TeamForm site={site.id} initial={team} />;
}
