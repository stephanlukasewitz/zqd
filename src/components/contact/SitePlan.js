import styles from "./SitePlan.module.css";

// Ein abstrahierter Lageplan statt eingebetteter Karte: kein Drittanbieter,
// keine Einwilligung nötig, lädt sofort. Der rote Punkt markiert das Büro.
export default function SitePlan() {
  const blocks = [
    "M40 40 h150 v90 h-150z",
    "M230 40 h120 v60 h-40 v30 h-80z",
    "M390 40 h180 v90 h-180z",
    "M40 190 h110 v140 h-110z",
    "M190 190 h160 v60 h-160z",
    "M190 290 h70 v40 h-70z",
    "M300 290 h50 v40 h-50z",
    "M390 190 h80 v140 h-80z",
    "M510 190 h60 v140 h-60z",
    "M40 390 h220 v110 h-220z",
    "M300 390 h270 v110 h-270z",
  ];
  return (
    <svg viewBox="0 0 610 540" className={styles.plan} role="img" aria-label="Schematischer Lageplan des Büros">
      <rect x="0.5" y="0.5" width="609" height="539" className={styles.border} />
      <path d="M0 160 H610 M0 360 H610 M210 0 V540 M370 0 V540" className={styles.streets} />
      {blocks.map((d, i) => (
        <path key={i} d={d} className={styles.block} style={{ "--i": i }} />
      ))}
      <g className={styles.pin}>
        <circle cx="290" cy="310" r="28" className={styles.pulse} />
        <rect x="282" y="302" width="16" height="16" />
      </g>
      <g className={styles.north} transform="translate(560 490)">
        <path d="M0 -22 L8 6 L0 0 L-8 6 Z" />
        <text y="22" textAnchor="middle">
          N
        </text>
      </g>
    </svg>
  );
}
