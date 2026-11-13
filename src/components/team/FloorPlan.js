import styles from "./FloorPlan.module.css";

// Abstrahierter Bürogrundriss als dezente grafische Ebene (T01).
// Wände zeichnen sich beim Laden, Türen schwenken nach.
export default function FloorPlan({ className = "" }) {
  const walls = [
    "M20 20 H980 V560 H20 Z",
    "M20 220 H330",
    "M390 220 H600",
    "M600 20 V180",
    "M600 240 V420",
    "M600 470 V560",
    "M330 220 V420",
    "M330 470 V560",
    "M780 20 V300",
    "M780 360 V560",
    "M780 300 H980",
  ];
  const doors = [
    { d: "M330 220 A60 60 0 0 1 390 220", l: "M330 220 L380 190" },
    { d: "M600 180 A60 60 0 0 1 600 240", l: "M600 180 L630 228" },
    { d: "M330 420 A50 50 0 0 0 330 470", l: "M330 420 L370 448" },
    { d: "M600 420 A50 50 0 0 1 600 470", l: "M600 420 L560 452" },
    { d: "M780 300 A60 60 0 0 0 780 360", l: "M780 300 L742 346" },
  ];
  const tables = [
    [80, 60, 200, 100],
    [400, 280, 140, 90],
    [400, 400, 140, 90],
    [820, 60, 120, 180],
    [640, 60, 100, 80],
    [90, 300, 180, 80],
    [820, 400, 120, 120],
  ];
  return (
    <svg
      viewBox="0 0 1000 580"
      className={`${styles.plan} ${className}`}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <g className={styles.walls}>
        {walls.map((d, i) => (
          <path key={d} d={d} pathLength="1" style={{ "--i": i }} />
        ))}
      </g>
      <g className={styles.doors}>
        {doors.map((d, i) => (
          <g key={i} style={{ "--i": i }}>
            <path d={d.d} className={styles.arc} pathLength="1" />
            <path d={d.l} />
          </g>
        ))}
      </g>
      <g className={styles.tables}>
        {tables.map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} style={{ "--i": i }} />
        ))}
      </g>
      <g className={styles.axis}>
        <path d="M0 290 H1000" />
        <path d="M490 0 V580" />
      </g>
    </svg>
  );
}
