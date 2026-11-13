import styles from "./Disciplines.module.css";

// Reduziertes Schema der Schnittstellen (H05): drei Disziplinen, ein Zentrum.
export default function Disciplines({ className = "" }) {
  const nodes = [
    { label: "Zoologie", x: 60, y: 60, anchor: "start" },
    { label: "Architektur", x: 540, y: 60, anchor: "end" },
    { label: "Fachplanung", x: 300, y: 400, anchor: "middle" },
  ];
  const c = { x: 300, y: 205 };
  return (
    <figure className={`${styles.figure} ${className}`}>
      <svg
        viewBox="0 0 600 440"
        className={styles.svg}
        role="img"
        aria-labelledby="schema-title"
      >
        <title id="schema-title">
          Zoologie, Architektur und Fachplanung laufen in der Generalplanung von
          ZQD zusammen.
        </title>
        <g className={styles.frame}>
          <rect x="0.5" y="0.5" width="599" height="439" />
        </g>
        {nodes.map((n, i) => (
          <line
            key={n.label}
            className={styles.edge}
            style={{ "--i": i }}
            x1={n.x}
            y1={n.y + (n.y > c.y ? -22 : 22)}
            x2={c.x}
            y2={c.y}
            pathLength="1"
          />
        ))}
        {nodes.map((n) => (
          <g key={n.label} className={styles.node}>
            <rect
              x={n.x - 5}
              y={n.y + (n.y > c.y ? -27 : 17)}
              width="10"
              height="10"
            />
            <text
              x={n.x}
              y={n.y}
              textAnchor={n.anchor === "middle" ? "middle" : n.anchor}
              dominantBaseline={n.y > c.y ? "hanging" : "auto"}
            >
              {n.label}
            </text>
          </g>
        ))}
        <g className={styles.center}>
          <rect x={c.x - 34} y={c.y - 34} width="68" height="68" />
          <text x={c.x} y={c.y + 6} textAnchor="middle">
            ZQD
          </text>
        </g>
        <text className={styles.caption} x="590" y="428" textAnchor="end">
          Generalplanung
        </text>
      </svg>
    </figure>
  );
}
