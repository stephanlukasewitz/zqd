import { notFound } from "next/navigation";
import { getSite } from "@/lib/sites";
import { readJSON, getTexts, TYPES, SERVICES, getProjects } from "@/lib/content";
import ProjectForm from "./ProjectForm";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: slug === "neu" ? "Neues Projekt" : "Projekt bearbeiten" };
}

export default async function ProjectPage({ params }) {
  const { site: id, slug } = await params;
  const site = getSite(id);
  const isNew = slug === "neu";
  const [project, texts, all] = await Promise.all([
    isNew ? null : readJSON(site, `projects/${slug}.json`),
    getTexts(site),
    getProjects(site),
  ]);
  if (!isNew && !project) notFound();
  // Länder: vorhandene Werte + Übersetzungen
  const countries = [...new Set(all.map((p) => p.country).filter(Boolean))].sort((a, b) => a.localeCompare(b, "de"));
  const countryLabels = Object.fromEntries(
    ["en", "tr"].map((l) => [l, texts[l]?.values?.countries || {}]),
  );
  const empty = { title: "", zoo: "", city: "", facts: [], text: [], scope: null };
  const initial = project || {
    slug: "",
    type: "Tieranlage",
    services: [],
    country: "Deutschland",
    year: null,
    de: empty,
    en: empty,
    tr: empty,
    images: [],
  };
  return (
    <ProjectForm
      site={site.id}
      isNew={isNew}
      initial={initial}
      types={TYPES}
      services={SERVICES}
      countries={countries}
      countryLabels={countryLabels}
      liveUrl={site.liveUrl}
      slugs={all.map((p) => p.slug)}
    />
  );
}
