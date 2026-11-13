import PageTransition from "@/components/PageTransition";
import Gallery from "@/components/projects/Gallery";
import { filterOptions, projects, toCard } from "@/content/projects";
import Reveal from "@/components/fx/Reveal";
import styles from "./page.module.css";

export const metadata = {
  title: "Projekte",
  description:
    "Ausgewählte Projekte von ZQD: Masterplanungen, Tieranlagen, Aquarien und Gebäude für zoologische Einrichtungen.",
};

export default function ProjektePage() {
  return (
    <PageTransition>
      <section className={`${styles.intro} wrap`}>
        <div className="grid">
          <h1 className={styles.title}>
            <Reveal>Unsere Projekte</Reveal>
            <sup className={styles.count}>({projects.length})</sup>
          </h1>
          <p className={styles.sub}>Ausgewählte Aufgaben, Ansätze und Ergebnisse.</p>
        </div>
      </section>
      <Gallery items={projects.map(toCard)} options={filterOptions()} />
    </PageTransition>
  );
}
