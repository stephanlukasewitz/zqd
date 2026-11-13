import Image from "next/image";
import Hero from "@/components/home/Hero";
import Phases from "@/components/home/Phases";
import Section from "@/components/home/Section";
import Selected from "@/components/home/Selected";
import TLink from "@/components/transition/TLink";
import { homeMedia } from "@/content/media";
import Reveal from "@/components/fx/Reveal";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <Hero slides={homeMedia.hero} />

      <Selected />

      {/* H02 Planungsphilosophie */}
      <section className={`${styles.section} ${styles.philosophy}`} aria-labelledby="philosophie">
        <h2 id="philosophie" className={styles.key}>
          Was unsere Planung prägt.
        </h2>
        <p className={`${styles.statement} reveal`}>
          Gute Planung beginnt mit dem genauen Verständnis der Aufgabe, ihrer
          Anforderungen und ihres Umfelds. Wir verbinden Funktion und Gestaltung
          zu schlüssigen Lösungen, die im Alltag überzeugen und langfristig
          Bestand haben.{" "}
          <span>
            Dabei hinterfragen wir Gewohntes, denken vorausschauend und lassen
            Raum für neue Entwicklungen.
          </span>
        </p>
        <ul className={styles.words}>
          {["Klarheit", "Verantwortung", "Weitblick"].map((w) => (
            <li key={w} className="reveal">
              {w}
            </li>
          ))}
        </ul>
      </section>

      {/* H03 Eine Kernkompetenz */}
      <section
        id="kompetenz"
        className={`${styles.section} ${styles.competence}`}
        aria-labelledby="kompetenz-titel"
      >
        <TLink href="/projekte" className={styles.compTile}>
          <div className={`${styles.compMedia} img-reveal`}>
            <Image
              src={homeMedia.competence.image}
              alt={homeMedia.competence.alt}
              fill
              sizes="(max-width: 900px) 100vw, 66vw"
              className={styles.compImg}
            />
          </div>
          <div className={styles.compText}>
            <h2 id="kompetenz-titel" className={styles.h2}>
              <Reveal>Zoologische Lebensräume ganzheitlich planen.</Reveal>
            </h2>
            <p>
              Von der Entwicklung eines gesamten Zoos und seiner Masterplanung
              bis zur Planung einzelner Tieranlagen, Gebäude und Aquarien: ZQD
              verbindet unterschiedliche Maßstäbe innerhalb einer umfassenden
              planerischen Kompetenz.
            </p>
            <span className="tlink">
              Zu den Projekten <span className="arrow" aria-hidden="true">→</span>
            </span>
          </div>
        </TLink>
      </section>

      {/* H04 Von der Idee bis zur Realisierung */}
      <section className={`${styles.section} ${styles.phases}`} aria-labelledby="planungsweg">
        <h2 id="planungsweg" className={`${styles.h2} ${styles.phasesTitle}`}>
          <Reveal>Von der Idee bis zur Realisierung.</Reveal>
        </h2>
        <Phases />
      </section>

      {/* H05 Generalplanung */}
      <section className={`${styles.section} ${styles.general}`} aria-labelledby="generalplanung">
        <h2 id="generalplanung" className={styles.statementLarge}>
          <Reveal>
            Ein Projekt. <span className={styles.soft}>Viele Disziplinen.</span> Ein abgestimmtes Ganzes.
          </Reveal>
        </h2>
        <Section>
          <p>
            Als Generalplaner übernehmen wir die Verantwortung für das gesamte
            Planungsteam. Wir führen Zoologie, Architektur und Fachplanungen
            zusammen, steuern die Schnittstellen und sind für unsere Auftraggeber
            der eine Ansprechpartner – mit klaren Zuständigkeiten von der ersten
            Idee bis zur Übergabe.
          </p>
          <TLink href="/team" className="tlink">
            Das Team hinter unserer Planung kennenlernen{" "}
            <span className="arrow" aria-hidden="true">→</span>
          </TLink>
        </Section>
      </section>
    </>
  );
}
