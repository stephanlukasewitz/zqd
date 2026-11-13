import Image from "next/image";
import { placeOf } from "@/content/projects";
import Slides from "./Slides";
import ShareButton from "./ShareButton";
import styles from "./ProjectDetail.module.css";

// D01–D06: Inhalt der Projektkarte – identisch im Overlay und auf der eigenen Projekt-URL.
export default function ProjectDetail({ project: p, headingLevel = 1, closeSlot }) {
  const H = `h${headingLevel}`;
  const facts = [
    p.zoo && ["Auftraggeber", p.zoo],
    ["Ort", placeOf(p)],
    ["Aufgabe", p.type],
    p.year && ["Zeitraum", p.year],
    p.scope && ["Leistungsumfang", p.scope],
    ...(p.facts || []).map((f, i) => [i === 0 ? "Kennzahlen" : "", f]),
  ].filter(Boolean);

  const slides = [p.cover, ...(p.gallery || [])];

  return (
    <article className={styles.detail}>
        <div className={styles.hero}>
          <Image
            src={p.cover.image}
            alt={p.cover.alt}
            fill
            sizes="(max-width: 760px) 100vw, min(1280px, 92vw)"
            preload
            quality={85}
            className={styles.heroImg}
          />
        </div>

      <div className={styles.body}>
        <header className={styles.head}>
          <H id={`title-${p.slug}`} className={styles.title}>
            {p.title}
          </H>
          {closeSlot}
        </header>

        <dl className={styles.facts}>
          {facts.map(([k, v], i) => (
            <div key={i} className={styles.fact}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.text}>
          {p.text?.length ? (
            p.text.map((para, i) => (
              <p key={i} className={i === 0 ? styles.first : undefined}>
                {para}
              </p>
            ))
          ) : (
            <p className={styles.first}>Projektbeschreibung folgt.</p>
          )}
        </div>

        {slides.length > 1 && (
          <Slides
            title={p.title}
            slides={slides.map((s) => ({ image: s.image, alt: s.alt, caption: s.caption }))}
          />
        )}

        <footer className={styles.foot}>
          <ShareButton title={p.title} path={`/projekte/${p.slug}`} />
        </footer>
      </div>
    </article>
  );
}
