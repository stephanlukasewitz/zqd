import { getSite } from "@/lib/sites";
import { readJSON } from "@/lib/content";
import SiteForm from "./SiteForm";

export const metadata = { title: "Kontaktdaten" };

export default async function ContactPage({ params }) {
  const site = getSite((await params).site);
  return <SiteForm site={site.id} initial={await readJSON(site, "site.json", {})} />;
}
