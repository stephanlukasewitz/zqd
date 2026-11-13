import Image from "next/image";
import styles from "./PhaseCards.module.css";

// Planungsweg in drei Schritten – jeder mit einem Bild aus einem echten Projekt.
export default function PhaseCards({ phases }) {
  return (
    <ol className={styles.cards}>
      {phases.map((p, i) => (
        <li key={p.label} className={styles.card}>
          <div className={`${styles.media} img-reveal`}>
            <Image src={p.image} alt={p.alt} fill sizes="(max-width: 860px) 100vw, 32vw" className={styles.img} />
          </div>
          <div className={styles.meta}>
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className={styles.label}>{p.label}</h3>
          </div>
          <p className={styles.note}>{p.note}</p>
          <details className={styles.details}>
            <summary>
              <span>Leistungen</span>
              <span className={styles.plus} aria-hidden="true" />
            </summary>
            <ul>
              {p.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </details>
          <p className={styles.credit}>{p.credit}</p>
        </li>
      ))}
    </ol>
  );
}
