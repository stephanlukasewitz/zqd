import Image from "next/image";
import Depth from "../fx/Depth";
import styles from "./PhaseCards.module.css";

// Leicht unterschiedliches Tempo je Phase (nur ?v=2) – ganze Karte, ohne Unschärfe
const SPEED = [0, 0.05, 0.025];

// Planungsweg in drei Schritten – jeder mit einem Bild aus einem echten Projekt,
// die Leistungen direkt sichtbar.
export default function PhaseCards({ phases }) {
  return (
    <ol className={styles.cards}>
      {phases.map((p, i) => (
        <li key={p.label}>
          <Depth speed={SPEED[i % SPEED.length]} blur={0} innerClassName={styles.card}>
          <div className={`${styles.media} img-reveal`}>
            <Image src={p.image} alt={p.alt} fill sizes="(max-width: 860px) 100vw, 32vw" className={styles.img} />
          </div>
          <p className={styles.credit}>{p.credit}</p>
          <div className={styles.meta}>
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className={styles.label}>{p.label}</h3>
          </div>
          <p className={styles.note}>{p.note}</p>
          <ul className={styles.details}>
            {p.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          </Depth>
        </li>
      ))}
    </ol>
  );
}
