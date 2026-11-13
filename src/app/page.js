import Hero from "@/components/home/Hero";
import Journey from "@/components/home/Journey";
import Rows from "@/components/home/Rows";
import Selected from "@/components/home/Selected";
import TLink from "@/components/transition/TLink";
import Reveal from "@/components/fx/Reveal";
import { getProject } from "@/content/projects";
import { homeMedia } from "@/content/media";
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
      line: "Ganze Zoos weiterentwickeln – Schritt für Schritt und im laufenden Betrieb.",
      project: "Masterplan Inselzoo Altenburg",
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

const phases = [
  {
    label: "Beratung & Konzeption",
    note: "Projektziele, Machbarkeit, Bedarf und erste Konzeptansätze.",
    details: [
      "Bedarfs- und Bestandsanalyse",
      "Machbarkeitsstudien",
      "Masterplanung",
      "Konzept- und Wettbewerbsentwürfe",
    ],
  },
  {
    label: "Entwurf & Planung",
    note: "HOAI LPH 1–5 von den Grundlagen bis zur Ausführungsplanung.",
    details: [
      "LPH 1 Grundlagenermittlung",
      "LPH 2 Vorplanung",
      "LPH 3 Entwurfsplanung",
      "LPH 4 Genehmigungsplanung",
      "LPH 5 Ausführungsplanung",
    ],
  },
  {
    label: "Umsetzung & Betreuung",
    note: "HOAI LPH 6–9 von Ausschreibung und Vergabe bis zur Objektbetreuung.",
    details: [
      "LPH 6 Vorbereitung der Vergabe",
      "LPH 7 Mitwirkung bei der Vergabe",
      "LPH 8 Objektüberwachung",
      "LPH 9 Objektbetreuung",
    ],
  },
];

const disciplines = [
  {
    label: "Zoologie",
    note: "Tierbedürfnisse, Haltungsrichtlinien, Vergesellschaftung und die Abläufe hinter den Kulissen.",
  },
  {
    label: "Architektur",
    note: "Gebäude, Gehege, Besucherwege und Einblicke – vom Masterplan bis zum Detail.",
  },
  {
    label: "Fachplanung",
    note: "Tragwerk, Gebäudetechnik und Wassertechnik – abgestimmt in einem Planungsteam.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero slide={homeMedia.hero[0]} />

      {/* H02 Haltung */}
      <section className={styles.block} aria-labelledby="haltung">
        <div className={styles.head}>
          <h2 id="haltung" className={styles.key}>
            Was unsere Planung prägt
          </h2>
          <p className={`${styles.statement} reveal`}>
            Gute Planung beginnt mit dem genauen Verständnis der Aufgabe, ihrer
            Anforderungen und ihres Umfelds. Wir verbinden Funktion und Gestaltung
            zu schlüssigen Lösungen, die im Alltag überzeugen und langfristig
            Bestand haben. Dabei hinterfragen wir Gewohntes, denken vorausschauend
            und lassen Raum für neue Entwicklungen.
          </p>
        </div>
        <Rows items={[{ label: "Klarheit" }, { label: "Verantwortung" }, { label: "Weitblick" }]} />
      </section>

      <Selected />

      {/* H03 Maßstäbe */}
      <Journey steps={steps()} title="Vom Masterplan bis in den Lebensraum" />

      {/* H04 Planungsweg */}
      <section className={styles.block} aria-labelledby="planungsweg">
        <div className={styles.head}>
          <h2 id="planungsweg" className={styles.key}>
            Planungsweg
          </h2>
          <p className={styles.title}>
            <Reveal>Von der Idee bis zur Realisierung.</Reveal>
          </p>
        </div>
        <Rows items={phases} size="m" />
      </section>

      {/* H05 Generalplanung */}
      <section className={styles.block} aria-labelledby="generalplanung">
        <div className={styles.head}>
          <h2 id="generalplanung" className={styles.key}>
            Generalplanung
          </h2>
          <p className={styles.title}>
            <Reveal>
              Ein Projekt. <span className={styles.soft}>Viele Disziplinen.</span> Ein
              abgestimmtes Ganzes.
            </Reveal>
          </p>
        </div>
        <Rows items={disciplines} size="m" />
        <div className={styles.after}>
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
        </div>
      </section>
    </>
  );
}
