import Hero from "@/components/home/Hero";
import Journey from "@/components/home/Journey";
import PhaseCards from "@/components/home/PhaseCards";
import Selected from "@/components/home/Selected";
import TLink from "@/components/transition/TLink";
import Reveal from "@/components/fx/Reveal";
import { getProject } from "@/content/projects";
import { homeMedia } from "@/content/media";
import styles from "./page.module.css";

const img = (slug, i = 0) => {
  const p = getProject(slug);
  const g = i === 0 ? p.cover : p.gallery[i - 1];
  return { image: g.image, alt: g.alt, title: p.title, zoo: p.zoo };
};

// Vier Maßstäbe – vom ganzen Zoo bis ins Becken (H03 als Erzählung).
function steps() {
  const deep = homeMedia.hero[1];
  return [
    {
      ...img("inselzoo-altenburg"),
      slug: "inselzoo-altenburg",
      scale: "M 1:5000",
      word: "Masterplan",
      line: "Ganze Zoos weiterentwickeln – Schritt für Schritt und im laufenden Betrieb.",
      project: "Masterplan Inselzoo Altenburg",
    },
    {
      ...img("orang-utan-dome-hagenbeck"),
      slug: "orang-utan-dome-hagenbeck",
      scale: "M 1:500",
      word: "Anlage",
      line: "Häuser und Gehege, die Tieren Raum geben und Besuchern Nähe.",
      project: "Orang-Utan-Dome, Tierpark Hagenbeck",
    },
    {
      ...img("eismeer-hagenbeck"),
      slug: "eismeer-hagenbeck",
      scale: "M 1:50",
      word: "Einblick",
      line: "Wo Mensch und Tier sich begegnen – geplant bis zur Scheibe.",
      project: "Eismeer, Tierpark Hagenbeck",
    },
    {
      image: deep.image,
      alt: deep.alt,
      slug: deep.slug,
      scale: "M 1:1",
      word: "Lebensraum",
      line: "Und mittendrin: Wasser, Licht und Leben.",
      project: "Tropen-Aquarium, Tierpark Hagenbeck",
    },
  ];
}

function phases() {
  const a = img("eisbaergehege-schoenbrunn");
  const b = img("elefantenwelt-wilhelma", 1);
  const c = img("biodome-budapest");
  return [
    {
      label: "Beratung & Konzeption",
      note: "Projektziele, Machbarkeit, Bedarf und erste Konzeptansätze.",
      details: ["Bedarfs- und Bestandsanalyse", "Machbarkeitsstudien", "Masterplanung", "Konzept- und Wettbewerbsentwürfe"],
      ...a,
      credit: `Modell, ${a.title}, ${a.zoo}`,
    },
    {
      label: "Entwurf & Planung",
      note: "HOAI LPH 1–5 von den Grundlagen bis zur Ausführungsplanung.",
      details: ["LPH 1 Grundlagenermittlung", "LPH 2 Vorplanung", "LPH 3 Entwurfsplanung", "LPH 4 Genehmigungsplanung", "LPH 5 Ausführungsplanung"],
      ...b,
      credit: `Visualisierung, ${b.title}, ${b.zoo}`,
    },
    {
      label: "Umsetzung & Betreuung",
      note: "HOAI LPH 6–9 von Ausschreibung und Vergabe bis zur Objektbetreuung.",
      details: ["LPH 6 Vorbereitung der Vergabe", "LPH 7 Mitwirkung bei der Vergabe", "LPH 8 Objektüberwachung", "LPH 9 Objektbetreuung"],
      ...c,
      credit: `Baustelle, ${c.title}, ${c.zoo}`,
    },
  ];
}

const disciplines = [
  ["Zoologie", "Tierbedürfnisse, Haltungsrichtlinien, Vergesellschaftung und die Abläufe hinter den Kulissen."],
  ["Architektur", "Gebäude, Gehege, Besucherwege und Einblicke – vom Masterplan bis zum Detail."],
  ["Fachplanung", "Tragwerk, Gebäudetechnik und Wassertechnik – abgestimmt in einem Planungsteam."],
];

export default function HomePage() {
  return (
    <>
      <Hero slide={homeMedia.hero[0]} />

      {/* H02 Haltung */}
      <section className={styles.block} aria-labelledby="haltung">
        <div className={styles.row}>
          <h2 id="haltung" className={styles.key}>
            Was unsere Planung prägt
          </h2>
          <div className={styles.main}>
            <p className={`${styles.statement} reveal`}>
              Gute Planung beginnt mit dem genauen Verständnis der Aufgabe, ihrer
              Anforderungen und ihres Umfelds. Wir verbinden Funktion und Gestaltung zu
              schlüssigen Lösungen, die im Alltag überzeugen und langfristig Bestand haben.
            </p>
            <p className={styles.words}>
              <span>Klarheit</span>
              <span>Verantwortung</span>
              <span>Weitblick</span>
            </p>
          </div>
        </div>
      </section>

      {/* H03 Maßstäbe */}
      <div className={styles.journeyGap} />
      <Journey steps={steps()} title="Vom Masterplan bis in den Lebensraum" />

      <Selected />

      {/* H04 Planungsweg */}
      <section className={styles.block} aria-labelledby="planungsweg">
        <div className={styles.row}>
          <h2 id="planungsweg" className={styles.key}>
            Planungsweg
          </h2>
          <p className={`${styles.main} ${styles.title}`}>
            <Reveal>Von der Idee bis zur Realisierung.</Reveal>
          </p>
        </div>
        <PhaseCards phases={phases()} />
      </section>

      {/* H05 Generalplanung */}
      <section className={styles.block} aria-labelledby="generalplanung">
        <div className={styles.row}>
          <h2 id="generalplanung" className={styles.key}>
            Generalplanung
          </h2>
          <div className={styles.main}>
            <p className={styles.title}>
              <Reveal>
                Ein Projekt. <span className={styles.soft}>Viele Disziplinen.</span> Ein
                abgestimmtes Ganzes.
              </Reveal>
            </p>
            <ol className={styles.disciplines}>
              {disciplines.map(([k, v], i) => (
                <li key={k}>
                  <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.dName}>{k}</span>
                  <span className={styles.dText}>{v}</span>
                </li>
              ))}
            </ol>
            <p className={styles.copy}>
              Als Generalplaner übernehmen wir die Verantwortung für das gesamte
              Planungsteam. Wir führen Zoologie, Architektur und Fachplanungen zusammen,
              steuern die Schnittstellen und sind für unsere Auftraggeber der eine
              Ansprechpartner – mit klaren Zuständigkeiten von der ersten Idee bis zur
              Übergabe.
            </p>
            <TLink href="/team" className="tlink">
              Das Team hinter unserer Planung kennenlernen{" "}
              <span className="arrow" aria-hidden="true">→</span>
            </TLink>
          </div>
        </div>
      </section>
    </>
  );
}
