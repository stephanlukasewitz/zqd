import styles from "./Phases.module.css";

const phases = [
  {
    title: "Beratung & Konzeption",
    text: "Projektziele, Machbarkeit, Bedarf und erste Konzeptansätze.",
    lph: [],
    details: [
      "Bedarfs- und Bestandsanalyse",
      "Machbarkeitsstudien",
      "Masterplanung",
      "Konzept- und Wettbewerbsentwürfe",
    ],
  },
  {
    title: "Entwurf & Planung",
    text: "HOAI LPH 1–5 von den Grundlagen bis zur Ausführungsplanung.",
    lph: [1, 2, 3, 4, 5],
    details: [
      "LPH 1 Grundlagenermittlung",
      "LPH 2 Vorplanung",
      "LPH 3 Entwurfsplanung",
      "LPH 4 Genehmigungsplanung",
      "LPH 5 Ausführungsplanung",
    ],
  },
  {
    title: "Umsetzung & Betreuung",
    text: "HOAI LPH 6–9 von Ausschreibung und Vergabe bis zur Objektbetreuung.",
    lph: [6, 7, 8, 9],
    details: [
      "LPH 6 Vorbereitung der Vergabe",
      "LPH 7 Mitwirkung bei der Vergabe",
      "LPH 8 Objektüberwachung",
      "LPH 9 Objektbetreuung",
    ],
  },
];

export default function Phases() {
  return (
    <ol className={styles.phases}>
      {phases.map((p, i) => (
        <li key={p.title} className={`${styles.phase} reveal`}>
          <div className={styles.ruler} aria-hidden="true">
            {p.lph.length ? (
              p.lph.map((n) => (
                <span key={n} className={styles.tick}>
                  {n}
                </span>
              ))
            ) : (
              <span className={styles.tick} data-open>
                0
              </span>
            )}
          </div>
          <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
          <h3 className={styles.title}>{p.title}</h3>
          <p className={styles.text}>{p.text}</p>
          <details className={styles.details}>
            <summary>
              <span>Details</span>
              <span className={styles.plus} aria-hidden="true" />
            </summary>
            <ul>
              {p.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </details>
        </li>
      ))}
    </ol>
  );
}
