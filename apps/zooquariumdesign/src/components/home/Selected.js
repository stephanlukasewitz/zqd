import Image from "next/image";
import TLink from "../transition/TLink";
import Reveal from "../fx/Reveal";
import { getProjects, placeOf } from "@/content/projects";
import { home } from "@/content/home";
import { fmt } from "@/i18n/config";
import { getDict, getLang } from "@/i18n/server";
import styles from "./Selected.module.css";


// Ausgewählte Projekte – vier Projekte in zwei versetzten Spalten, wie Blätter auf dem Tisch.
// Derzeit nur als Vergleichsvariante (?v=2) neben der Bilderwolke.
export default async function Selected({ space, id = "auswahl", className = "" }) {
  const lang = await getLang();
  const d = await getDict();
  const projects = getProjects(lang);
  const list = home.selected.map((s) => projects.find((p) => p.slug === s)).filter(Boolean);
  const num = (p) => String(projects.indexOf(p) + 1).padStart(2, "0");

  return (
    <section
      className={`${styles.section} ${className}`}
      style={space ? { paddingTop: space } : undefined}
      aria-labelledby={id}
    >
      <div className={styles.head}>
        <h2 id={id} className={styles.title}>
          <Reveal>{d.home.selected}</Reveal>
        </h2>
        <TLink href="/projekte" className="tlink">
          {fmt(d.home.allProjects, { n: projects.length })} <span className="arrow" aria-hidden="true">→</span>
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
