import Image from "next/image";
import TLink from "../transition/TLink";
import Reveal from "../fx/Reveal";
import { placeOf, projects } from "@/content/projects";
import styles from "./Selected.module.css";

const PICK = ["artenschutz-aquarium-schoenbrunn", "elefantenfreilaufhalle-hagenbeck"];

// Ausgewählte Projekte – zwei versetzte Spalten, wie Blätter auf dem Tisch.
export default function Selected() {
  const list = PICK.map((s) => projects.find((p) => p.slug === s)).filter(Boolean);
  const num = (p) => String(projects.indexOf(p) + 1).padStart(2, "0");

  return (
    <section className={styles.section} aria-labelledby="auswahl">
      <div className={styles.head}>
        <h2 id="auswahl" className={styles.title}>
          <Reveal>Ausgewählte Projekte</Reveal>
        </h2>
        <TLink href="/projekte" className="tlink">
          Alle {projects.length} Projekte <span className="arrow" aria-hidden="true">→</span>
        </TLink>
      </div>

      <ul className={styles.grid}>
        {list.map((p) => (
          <li key={p.slug} className={styles.item}>
            <TLink href={`/projekte/${p.slug}`} className={styles.card}>
              <div className={`${styles.media} img-reveal`}>
                <Image
                  src={p.cover.image}
                  alt={p.cover.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 46vw"
                  className={styles.img}
                />
              </div>
              <div className={styles.meta}>
                <span className={styles.num}>{num(p)}</span>
                <span className={styles.name}>{p.title}</span>
                <span className={styles.place}>{placeOf(p)}</span>
              </div>
            </TLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
