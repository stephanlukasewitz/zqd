import { Suspense } from "react";
import { notFound } from "next/navigation";
import BackLink from "@/components/projects/BackLink";
import PageTransition from "@/components/PageTransition";
import ProjectDetail from "@/components/projects/ProjectDetail";
import { getProject, getProjects, placeOf, projects } from "@/content/projects";
import { pageMeta } from "@/i18n/meta";
import { getDict, getLang } from "@/i18n/server";
import styles from "./page.module.css";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// Beschreibung: erster Absatz, an einer Wortgrenze auf ~155 Zeichen gekürzt
function summary(text = "", max = 155) {
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(" ", max)).replace(/[,;:–-]$/, "") + " …";
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const lang = await getLang();
  const p = getProject(slug, lang);
  if (!p) return {};
  return pageMeta(lang, `/projekte/${slug}`, {
    title: p.title,
    description: summary(p.text?.[0]) || `${p.title} – ${placeOf(p)}`,
    type: "article",
  });
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
