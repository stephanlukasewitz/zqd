import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import Hero from "@/components/home/Hero";
import Phases from "@/components/home/Phases";
import Disciplines from "@/components/home/Disciplines";
import { homeMedia } from "@/content/media";
import styles from "./page.module.css";

const principles = ["Klarheit", "Verantwortung", "Weitblick"];

export default function HomePage() {
  return (
    <PageTransition>
      <Hero slides={homeMedia.hero} />

      {/* H02 Planungsphilosophie */}
      <section className={`${styles.philosophy} wrap`} aria-labelledby="philosophie">
        <div className="grid">
          <h2 id="philosophie" className={`${styles.h2} reveal`}>
            Was unsere Planung prägt.
          </h2>
          <p className={`${styles.lead} reveal`}>
            Gute Planung beginnt mit dem genauen Verständnis der Aufgabe, ihrer
            Anforderungen und ihres Umfelds. Wir verbinden Funktion und
            Gestaltung zu schlüssigen Lösungen, die im Alltag überzeugen und
            langfristig Bestand haben. Dabei hinterfragen wir Gewohntes, denken
            vorausschauend und lassen Raum für neue Entwicklungen.
          </p>
        </div>
        <ol className={styles.principles}>
          {principles.map((p, i) => (
            <li key={p} className="reveal">
              <span className={styles.pIndex}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.pWord}>{p}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* H03 Eine Kernkompetenz */}
      <section id="kompetenz" className={`${styles.competence} wrap`} aria-labelledby="kompetenz-titel">
        <Link
          href="/projekte"
          className={styles.compTile}
          transitionTypes={["page"]}
        >
          <div className={styles.compMedia}>
            <Image
              src={homeMedia.competence.image}
              alt={homeMedia.competence.alt}
              fill
              sizes="(max-width: 760px) 100vw, 94vw"
              className={styles.compImg}
            />
          </div>
          <div className={styles.compText}>
            <h2 id="kompetenz-titel" className={styles.h2}>
              Zoologische Lebensräume ganzheitlich planen.
            </h2>
            <div className={styles.compBody}>
              <p>
                Von der Entwicklung eines gesamten Zoos und seiner Masterplanung
                bis zur Planung einzelner Tieranlagen, Gebäude und Aquarien: ZQD
                verbindet unterschiedliche Maßstäbe innerhalb einer umfassenden
                planerischen Kompetenz.
              </p>
              <ScaleBar />
              <span className={styles.compLink}>
                Zu den Projekten <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* H04 Von der Idee bis zur Realisierung */}
      <section className={`${styles.phases} wrap`} aria-labelledby="planungsweg">
        <div className="grid">
          <h2 id="planungsweg" className={`${styles.h2} ${styles.phasesTitle} reveal`}>
            Von der Idee bis zur Realisierung.
          </h2>
        </div>
        <Phases />
      </section>

      {/* H05 Generalplanung */}
      <section className={`${styles.general} wrap`} aria-labelledby="generalplanung">
        <div className="grid">
          <h2 id="generalplanung" className={`${styles.h2} ${styles.generalTitle} reveal`}>
            Ein Projekt. Viele Disziplinen. Ein abgestimmtes Ganzes.
          </h2>
          <div className={`${styles.generalText} reveal`}>
            <p>
              Als Generalplaner übernehmen wir die Verantwortung für das
              gesamte Planungsteam. Wir führen Zoologie, Architektur und
              Fachplanungen zusammen, steuern die Schnittstellen und sind für
              unsere Auftraggeber der eine Ansprechpartner – mit klaren
              Zuständigkeiten von der ersten Idee bis zur Übergabe.
            </p>
            <Link href="/team" className="tlink" transitionTypes={["page"]}>
              Das Team hinter unserer Planung kennenlernen{" "}
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
          <Disciplines className={styles.schema} />
        </div>
      </section>
    </PageTransition>
  );
}

// Maßstabsleiste: vom Masterplan bis zum Detail – die Bandbreite der Maßstäbe.
function ScaleBar() {
  const marks = ["1:5000", "1:1000", "1:200", "1:50", "1:20"];
  return (
    <div className={styles.scale} aria-hidden="true">
      <div className={styles.scaleLine}>
        {marks.map((m) => (
          <span key={m} />
        ))}
      </div>
      <div className={styles.scaleLabels}>
        {marks.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}
