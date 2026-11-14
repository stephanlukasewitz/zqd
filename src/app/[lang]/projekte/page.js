import PageTransition from "@/components/PageTransition";
import { Suspense } from "react";
import Gallery from "@/components/projects/Gallery";
import GalleryFromUrl from "@/components/projects/GalleryFromUrl";
import { filterOptions, getProjects, toCard } from "@/content/projects";
import Reveal from "@/components/fx/Reveal";
import { getDict, getLang } from "@/i18n/server";
import styles from "./page.module.css";

export async function generateMetadata() {
  const d = await getDict();
  return { title: d.meta.projects.title, description: d.meta.projects.description };
}

export default async function ProjektePage() {
  const lang = await getLang();
  const d = await getDict();
  const projects = getProjects(lang);
  const items = projects.map(toCard);
  const options = filterOptions(lang);
  return (
    <PageTransition>
      <section className={`${styles.intro} wrap`}>
        <div className="grid">
          <h1 className={styles.title}>
            <Reveal>{d.projects.title}</Reveal>
            {/* <sup className={styles.count}>({projects.length})</sup> */}
          </h1>
          <p className={styles.sub}>{d.projects.sub}</p>
        </div>
      </section>
      <Suspense fallback={<Gallery items={items} options={options} />}>
        <GalleryFromUrl items={items} options={options} />
      </Suspense>
    </PageTransition>
  );
}
