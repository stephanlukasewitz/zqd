import styles from "./Section.module.css";

// H05: Die drei Disziplinen, die in der Generalplanung zusammenlaufen.
const DISCIPLINES = [
  {
    label: "Zoologie",
    text: "Tierbedürfnisse, Haltungsrichtlinien, Vergesellschaftung und die Abläufe hinter den Kulissen.",
  },
  {
    label: "Architektur",
    text: "Gebäude, Gehege, Besucherwege und Einblicke – vom Masterplan bis zum Detail.",
  },
  {
    label: "Fachplanung",
    text: "Tragwerk, Gebäudetechnik und Wassertechnik – abgestimmt in einem Planungsteam.",
  },
];

export default function Section({ children }) {
  return (
    <div className={styles.wrap}>
      <ol className={styles.list}>
        {DISCIPLINES.map((d, i) => (
          <li key={d.label} className="reveal">
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.label}>{d.label}</span>
            <span className={styles.text}>{d.text}</span>
          </li>
        ))}
      </ol>
      <div className={styles.copy}>{children}</div>
    </div>
  );
}
