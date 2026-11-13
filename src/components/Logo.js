import styles from "./Logo.module.css";

// Kombiniertes ZQD-Logo (G00). Zwei Farbvarianten liegen übereinander und
// werden über die Klasse `onDark` am Elternelement überblendet.
export default function Logo({ variant = "full", className = "", priority }) {
  const base = variant === "mark" ? "zqd-mark" : "zqd-logo";
  const ratio = variant === "mark" ? 352 / 360 : 1864 / 360;
  return (
    <span
      className={`${styles.logo} ${className}`}
      style={{ "--ratio": ratio }}
      data-variant={variant}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.dark}
        src={`/brand/${base}.svg`}
        alt="ZQD – Zooquariumdesign, Architekturgarage"
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.light}
        src={`/brand/${base}-light.svg`}
        alt=""
        aria-hidden="true"
        decoding="async"
      />
    </span>
  );
}
