import Image from "next/image";
import TLink from "../transition/TLink";
import { projects } from "@/content/projects";
import styles from "./Selected.module.css";

const PICK = [
  "elefanten-badeteich-hagenbeck",
  "artenschutz-aquarium-schoenbrunn",
  "haus-der-giganten-verona",
  "elefantenfreilaufhalle-hagenbeck",
  "kaenguruhaus-hagenbeck",
  "dickhaeuterhaus-tierpark-berlin",
];

// Ausgewählte Projekte als ruhige Vorschau – zwei versetzte Spalten.
export default function Selected() {
  const list = PICK.map((s) => projects.find((p) => p.slug === s)).filter(Boolean);
  return (
    <section className={styles.section} aria-labelledby="auswahl">
      <div className={styles.head}>
        <h2 id="auswahl" className={styles.title}>
          Ausgewählte Projekte<sup>({projects.length})</sup>
        </h2>
        <TLink href="/projekte" className="tlink">
          Alle Projekte <span className="arrow" aria-hidden="true">→</span>
        </TLink>
      </div>
      <ul className={styles.grid}>
        {list.map((p, i) => (
          <li key={p.slug} className={styles.item}>
            <TLink href={`/projekte/${p.slug}`} className={styles.card}>
              <div className={`${styles.media} img-reveal`} data-shape={i % 3 === 1 ? "tall" : undefined}>
                <Image
                  src={p.cover.image}
                  alt={p.cover.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 46vw"
                  className={styles.img}
                />
              </div>
              <div className={styles.meta}>
                <span>{p.title}</span>
                <span className={styles.place}>{[p.zoo, p.city].filter(Boolean).join(", ")}</span>
              </div>
            </TLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
