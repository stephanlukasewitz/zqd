import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/projects/ProjectDetail";
import ProjectModal from "@/components/projects/ProjectModal";
import { getProject, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

async function Content({ params }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  return (
    <ProjectModal slug={slug}>
      <ProjectDetail project={p} headingLevel={2} />
    </ProjectModal>
  );
}

export default function ProjectOverlay({ params }) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}
