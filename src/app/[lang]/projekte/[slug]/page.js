import { Suspense } from "react";
import { notFound } from "next/navigation";
import BackLink from "@/components/projects/BackLink";
import PageTransition from "@/components/PageTransition";
import ProjectDetail from "@/components/projects/ProjectDetail";
import { getProject, getProjects, placeOf, projects } from "@/content/projects";
import { getDict, getLang } from "@/i18n/server";
import styles from "./page.module.css";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProject(slug, await getLang());
  if (!p) return {};
  return {
    title: p.title,
    description: p.text?.[0]?.slice(0, 160) || `${p.title} – ${placeOf(p)}`,
    openGraph: { images: [{ url: p.cover.image.src }] },
  };
}

// Projektseite – eigene URL, erreichbar aus Galerie, Index und Startseite.
export default function ProjectPage({ params }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }) {
  const { slug } = await params;
  const lang = await getLang();
  const d = await getDict();
  const p = getProject(slug, lang);
  if (!p) notFound();
  return (
    <PageTransition>
      <div className={styles.page}>
        <nav className={`${styles.back} wrap`} aria-label={d.ui.backLabel}>
          <BackLink className="tlink">
            <span className="arrow" aria-hidden="true">←</span> {d.ui.back}
          </BackLink>
        </nav>
        <ProjectDetail project={p} projects={getProjects(lang)} t={d.projects} />
      </div>
    </PageTransition>
  );
}
