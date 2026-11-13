import Journey from "@/components/home/Journey";
import { getProject } from "@/content/projects";
import Phases from "@/components/home/Phases";
import Section from "@/components/home/Section";
import Selected from "@/components/home/Selected";
import TLink from "@/components/transition/TLink";
import { homeMedia } from "@/content/media";
import Reveal from "@/components/fx/Reveal";
import styles from "./page.module.css";

// Vier Maßstäbe – vom ganzen Zoo bis ins Becken (H03 als Erzählung).
function steps() {
  const pick = (slug, extra) => {
    const p = getProject(slug);
    return { slug, image: p.cover.image, alt: p.cover.alt, ...extra };
  };
  const deep = homeMedia.hero[1];
  return [
    pick("inselzoo-altenburg", {
      scale: "M 1:5000",
      word: "Masterplanung",
      line: "",
      project: "",
    }),
    pick("orang-utan-dome-hagenbeck", {
      scale: "M 1:500",
      word: "Tieranlagen",
      line: "Häuser und Gehege, die Tieren Raum geben und Besuchern Nähe.",
      project: "Orang-Utan-Dome, Tierpark Hagenbeck",
    }),
    pick("eismeer-hagenbeck", {
      scale: "M 1:50",
      word: "Einblicke",
      line: "Wo Mensch und Tier sich begegnen – geplant bis zur Scheibe.",
      project: "Eismeer, Tierpark Hagenbeck",
    }),
    {
      slug: deep.slug,
      image: deep.image,
      alt: deep.alt,
      scale: "M 1:1",
      word: "Lebensraum",
      line: "Und mittendrin: Wasser, Licht und Leben.",
      project: "Tropen-Aquarium, Tierpark Hagenbeck",
    },
  ];
}

export default function HomePage() {
  return (
    <>
      <Journey steps={steps()} />

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
