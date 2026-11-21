import { getSite } from "@/lib/sites";
import { getTexts } from "@/lib/content";
import TextsForm from "./TextsForm";

export const metadata = { title: "Texte" };

export default async function TextsPage({ params }) {
  const site = getSite((await params).site);
  return <TextsForm site={site.id} initial={await getTexts(site)} />;
}
