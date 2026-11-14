import Image from "next/image";
import styles from "./PhaseCards.module.css";

// Planungsweg in drei Schritten – jeder mit einem Bild aus einem echten Projekt,
// die Leistungen direkt sichtbar.
export default function PhaseCards({ phases }) {
  return (
    <ol className={styles.cards}>
      {phases.map((p, i) => (
        <li key={p.label} className={styles.card}>
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
        </li>
      ))}
    </ol>
  );
}
