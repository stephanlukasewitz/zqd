import Hero from "@/components/home/Hero";
import Split from "@/components/home/Split";
import Selected from "@/components/home/Selected";
import PhaseCards from "@/components/home/PhaseCards";
import TLink from "@/components/transition/TLink";
import Reveal from "@/components/fx/Reveal";
import { withDot } from "@/components/fx/Dot";
import { claim, competence, general, heroImages, phases, philosophy, pic } from "@/content/home";
import { projects } from "@/content/projects";
import styles from "./page.module.css";

const count = (type) => projects.filter((p) => p.type === type).length;

// Die vier Aufgabenfelder – jeweils mit echter Projektzahl und Filterlink.
const fields = [
  {
    type: "Masterplanung",
    word: "Masterplanung",
    line: "Ganze Zoos weiterentwickeln – Schritt für Schritt und im laufenden Betrieb.",
    image: pic("inselzoo-altenburg"),
  },
  {
    type: "Tieranlage",
    word: "Tieranlagen",
    line: "Häuser und Gehege, die Tieren Raum geben und Besuchern Nähe.",
    image: pic("orang-utan-dome-hagenbeck"),
  },
  {
    type: "Aquarium",
    word: "Aquarien",
    line: "Unterwasserwelten mit Einblicken, die Mensch und Tier zusammenbringen.",
    image: { ...heroImages()[1], title: "Tropen-Aquarium", zoo: "Tierpark Hagenbeck" },
  },
];

export default function HomePage() {
  const badeteich = pic("elefanten-badeteich-hagenbeck");

  // Geteilter Abschnitt: links der Text, rechts das Bild zum jeweiligen Abschnitt.
  const story = [
    {
      image: badeteich.image,
      alt: badeteich.alt,
      caption: `${badeteich.title}, ${badeteich.zoo}`,
      content: (
        <div className={styles.philo}>
          <h2 className={styles.h2}>
            <Reveal>{withDot(philosophy.title + ".")}</Reveal>
          </h2>
          <p className={styles.body}>{philosophy.text}</p>
          <ol className={styles.values}>
            {philosophy.words.map((w, i) => (
              <li key={w}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {w}
              </li>
            ))}
          </ol>
        </div>
      ),
    },
    ...fields.map((f, i) => ({
      kind: "step",
      image: f.image.image,
      alt: f.image.alt,
      caption: `${f.image.title}, ${f.image.zoo}`,
      content: (
        <div>
          {i === 0 && (
            <div className={styles.compHead}>
              <h2 className={styles.h2}>
                <Reveal>{withDot(competence.title)}</Reveal>
              </h2>
              <p className={styles.body}>{competence.text}</p>
            </div>
          )}
          <p className={styles.fieldNum}>{String(i + 1).padStart(2, "0")}</p>
          <p className={styles.word}>{f.word}</p>
          <p className={styles.line}>{f.line}</p>
          <TLink href={`/projekte?art=${encodeURIComponent(f.type)}`} className="tlink">
            {count(f.type)} Projekte ansehen <span className="arrow" aria-hidden="true">→</span>
          </TLink>
        </div>
      ),
    })),
  ];

  const cards = phases().map((p) => ({
    label: p.label,
    note: p.text,
    details: p.details,
    image: p.image,
    alt: p.alt,
    credit: `${p.title}, ${p.zoo}`,
  }));

  return (
    <>
      <Hero slide={heroImages()[1]} claim={claim} />

      <div className={styles.splitGap} />
      <Split sections={story} />

      {/* H04 Planungsweg */}
      <section className={styles.block} aria-labelledby="planungsweg">
        <div className={styles.row}>
          <h2 id="planungsweg" className={styles.key}>
            Planungsweg
          </h2>
          <p className={`${styles.main} ${styles.title}`}>
            <Reveal>{withDot("Von der Idee bis zur Realisierung.")}</Reveal>
          </p>
        </div>
        <PhaseCards phases={cards} />
      </section>

      {/* H05 Generalplanung */}
      <section className={styles.block} aria-labelledby="generalplanung">
        <div className={styles.row}>
          <h2 id="generalplanung" className={styles.key}>
            Generalplanung
          </h2>
          <div className={styles.main}>
            <p className={styles.title}>
              <Reveal>{withDot(general.title)}</Reveal>
            </p>
            <ol className={styles.disciplines}>
              {general.disciplines.map(([k, v], i) => (
                <li key={k}>
                  <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.dName}>{k}</span>
                  <span className={styles.dText}>{v}</span>
                </li>
              ))}
            </ol>
            <p className={styles.copy}>{general.text}</p>
            <TLink href="/team" className="tlink">
              Das Team hinter unserer Planung kennenlernen{" "}
              <span className="arrow" aria-hidden="true">→</span>
            </TLink>
          </div>
        </div>
      </section>

      <Selected />
    </>
  );
}
