import Hero from "@/components/home/Hero";
import { withDot } from "@/components/fx/Dot";
import Split from "@/components/home/Split";
import Selected from "@/components/home/Selected";
import PhaseCards from "@/components/home/PhaseCards";
import TLink from "@/components/transition/TLink";
import Reveal from "@/components/fx/Reveal";
import { claim, competence, general, heroImages, phases, philosophy, pic, scales } from "@/content/home";
import styles from "./page.module.css";

export default function HomePage() {
  const hero = heroImages()[0];
  const polarium = pic("polarium-rostock");

  // Geteilter Einstieg: links der Text, rechts das Bild zum jeweiligen Abschnitt.
  const story = [
    {
      image: polarium.image,
      alt: polarium.alt,
      caption: `${polarium.title}, ${polarium.zoo}`,
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
    ...scales().map((s, i) => ({
      kind: "step",
      image: s.image,
      alt: s.alt,
      caption: `${s.scale} · ${s.title}${s.zoo ? ", " + s.zoo : ""}`,
      content: (
        <div>
          {i === 0 && (
            <div className={styles.compHead}>
              <h2 className={styles.h2}>
                <Reveal>{withDot(competence.title)}</Reveal>
              </h2>
              <p className={styles.text}>{competence.text}</p>
            </div>
          )}
          <p className={styles.scale}>{s.scale}</p>
          <p className={styles.word}>{s.word}</p>
          <p className={styles.line}>{s.line}</p>
          <TLink href={`/projekte/${s.slug}`} className="tlink">
            {s.title}
            {s.zoo ? `, ${s.zoo}` : ""} <span className="arrow" aria-hidden="true">→</span>
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
      <Hero slide={hero} claim={claim} />

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
