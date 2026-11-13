import IndexList from "../projects/IndexList";
import TLink from "../transition/TLink";
import Reveal from "../fx/Reveal";
import { projects, toCard } from "@/content/projects";
import styles from "./Selected.module.css";

const PICK = [
  "eismeer-hagenbeck",
  "tropen-aquarium-hagenbeck",
  "artenschutz-aquarium-schoenbrunn",
  "polarium-rostock",
  "orang-utan-dome-hagenbeck",
  "haus-der-giganten-verona",
  "masterplan-2030-koeln",
  "dickhaeuterhaus-tierpark-berlin",
];

// Ausgewählte Projekte als Index – dasselbe Muster wie die Projektübersicht.
export default function Selected() {
  const list = PICK.map((s) => projects.find((p) => p.slug === s)).filter(Boolean);
  const numbers = Object.fromEntries(
    projects.map((p, i) => [p.slug, String(i + 1).padStart(2, "0")]),
  );
  const countries = new Set(projects.map((p) => p.country).filter(Boolean)).size;
  const clients = new Set(projects.map((p) => p.zoo).filter(Boolean)).size;

  return (
    <section className={styles.section} aria-labelledby="auswahl">
      <div className={styles.head}>
        <h2 id="auswahl" className={styles.title}>
          <Reveal>Ausgewählte Projekte</Reveal>
        </h2>
        <TLink href="/projekte?ansicht=index" className="tlink">
          Alle {projects.length} Projekte <span className="arrow" aria-hidden="true">→</span>
        </TLink>
      </div>

      <IndexList items={list.map(toCard)} numbers={numbers} />

      <dl className={styles.figures}>
        <div>
          <dt>Projekte</dt>
          <dd>{projects.length}</dd>
        </div>
        <div>
          <dt>Länder</dt>
          <dd>{countries}</dd>
        </div>
        <div>
          <dt>Zoologische Einrichtungen</dt>
          <dd>{clients}</dd>
        </div>
        <div>
          <dt>Leistungsphasen</dt>
          <dd>1–9</dd>
        </div>
      </dl>
    </section>
  );
}
