import Image from "next/image";
import TLink from "@/components/transition/TLink";
import Reveal from "@/components/fx/Reveal";
import { claim, competence, featured, general, heroImages, phases, philosophy, scales, service } from "@/content/home";
import { projects } from "@/content/projects";
import styles from "./page.module.css";

export const metadata = { title: "Entwurf C – Achsraster" };

const AXES = ["A", "B", "C", "D", "E", "F", "G"];

// Waagerechte Achse mit Nummer im Kreis – beginnt jeden Abschnitt.
function Axis({ n, label }) {
  return (
    <div className={styles.axis}>
      <span className={styles.bubble}>{n}</span>
      {label && <span className={styles.axisLabel}>{label}</span>}
    </div>
  );
}

export default function EntwurfC() {
  const hero = heroImages()[0];
  const items = featured().slice(0, 6);
  // Platzierung der Projekte im Raster (Spalte von / bis, 6 Felder)
  const slots = ["1 / 4", "4 / 7", "2 / 5", "5 / 7", "1 / 3", "3 / 7"];

  return (
    <div className={styles.page}>
      {/* Das Raster: senkrechte Achsen über die ganze Seite */}
      <div className={styles.grid} aria-hidden="true">
        {AXES.map((a, i) => (
          <span key={a} className={styles.line} style={{ "--i": i }}>
            <em>{a}</em>
          </span>
        ))}
      </div>

      {/* 1 – Einstieg */}
      <section className={styles.sec}>
        <Axis n="1" />
        <div className={styles.cells}>
          <p className={styles.service} style={{ gridColumn: "1 / 3" }}>
            {service}
          </p>
          <h1 className={styles.claim} style={{ gridColumn: "1 / 7" }}>
            <Reveal>{claim[0]}</Reveal>
            <Reveal className={styles.soft} delay={120}>
              {claim[1]}
            </Reveal>
          </h1>
          <figure className={styles.heroFig} style={{ gridColumn: "2 / 7" }}>
            <div className={styles.heroMedia}>
              <Image src={hero.image} alt={hero.alt} fill sizes="84vw" preload className={styles.img} />
            </div>
          </figure>
          <p className={styles.note} style={{ gridColumn: "1 / 2" }}>
            Abb. 1<br />
            {hero.title}
          </p>
        </div>
      </section>

      {/* 2 – Haltung */}
      <section className={styles.sec}>
        <Axis n="2" label={philosophy.title} />
        <div className={styles.cells}>
          <p className={styles.lead} style={{ gridColumn: "3 / 7" }}>
            {philosophy.text}
          </p>
          {philosophy.words.map((w, i) => (
            <p key={w} className={styles.word} style={{ gridColumn: `${i * 2 + 1} / ${i * 2 + 3}` }}>
              {w}
            </p>
          ))}
        </div>
      </section>

      {/* 3 – Projekte im Raster */}
      <section className={styles.sec}>
        <Axis n="3" label="Projekte" />
        <div className={styles.cells}>
          {items.map((p, i) => (
            <TLink
              key={p.slug}
              href={`/projekte/${p.slug}`}
              className={styles.proj}
              style={{ gridColumn: slots[i] }}
            >
              <div className={styles.projMedia}>
                <Image src={p.image} alt={p.alt} fill sizes="(max-width: 760px) 100vw, 50vw" className={styles.img} />
              </div>
              <span className={styles.projMeta}>
                <span>{p.title}</span>
                <span>{p.city}</span>
              </span>
            </TLink>
          ))}
          <TLink href="/projekte" className={`tlink ${styles.all}`} style={{ gridColumn: "1 / 4" }}>
            Alle {projects.length} Projekte <span className="arrow" aria-hidden="true">→</span>
          </TLink>
        </div>
      </section>

      {/* 4 – Maßstäbe */}
      <section className={styles.sec}>
        <Axis n="4" label="Maßstäbe" />
        <div className={styles.cells}>
          <h2 className={styles.h2} style={{ gridColumn: "1 / 5" }}>
            <Reveal>{competence.title}</Reveal>
          </h2>
          <p className={styles.text} style={{ gridColumn: "5 / 7" }}>
            {competence.text}
          </p>
          {scales().map((s, i) => (
            <TLink
              key={s.scale}
              href={`/projekte/${s.slug}`}
              className={styles.scale}
              style={{ gridColumn: ["1 / 3", "3 / 5", "5 / 6", "6 / 7"][i] }}
            >
              <div className={styles.scaleMedia} data-i={i}>
                <Image src={s.image} alt={s.alt} fill sizes="50vw" className={styles.img} />
              </div>
              <span className={styles.scaleNum}>{s.scale}</span>
              <span className={styles.scaleWord}>{s.word}</span>
            </TLink>
          ))}
        </div>
      </section>

      {/* 5 – Planungsweg */}
      <section className={styles.sec}>
        <Axis n="5" label="Planungsweg" />
        <div className={styles.cells}>
          <h2 className={styles.h2} style={{ gridColumn: "1 / 5" }}>
            <Reveal>Von der Idee bis zur Realisierung.</Reveal>
          </h2>
          {phases().map((p, i) => (
            <div key={p.label} className={styles.phase} style={{ gridColumn: `${i * 2 + 1} / ${i * 2 + 3}` }}>
              <div className={styles.phaseMedia}>
                <Image src={p.image} alt={p.alt} fill sizes="33vw" className={styles.img} />
              </div>
              <span className={styles.scaleNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{p.label}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6 – Generalplanung */}
      <section className={styles.sec}>
        <Axis n="6" label="Generalplanung" />
        <div className={styles.cells}>
          <h2 className={styles.h2} style={{ gridColumn: "1 / 5" }}>
            <Reveal>{general.title}</Reveal>
          </h2>
          {general.disciplines.map(([k, v], i) => (
            <div key={k} className={styles.disc} style={{ gridColumn: `${i * 2 + 1} / ${i * 2 + 3}` }}>
              <h3>{k}</h3>
              <p>{v}</p>
            </div>
          ))}
          <p className={styles.text} style={{ gridColumn: "3 / 6" }}>
            {general.text}
          </p>
          <TLink href="/team" className={`tlink ${styles.all}`} style={{ gridColumn: "3 / 6" }}>
            Das Team hinter unserer Planung <span className="arrow" aria-hidden="true">→</span>
          </TLink>
        </div>
      </section>
    </div>
  );
}
