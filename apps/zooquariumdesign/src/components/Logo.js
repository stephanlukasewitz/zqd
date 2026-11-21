import styles from "./Logo.module.css";

// Kombiniertes ZQD-Logo (G00). Zwei Farbvarianten liegen übereinander und
// werden über die Klasse `onDark` am Elternelement überblendet.
export default function Logo({ variant = "full", className = "", priority }) {
  const files = { mark: "zqd-mark", wordmark: "zqd-wordmark", full: "zqd-logo" };
  const ratios = { mark: 352 / 360, wordmark: 1412 / 118, full: 1864 / 360 };
  const base = files[variant] || files.full;
  const ratio = ratios[variant] || ratios.full;
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
        alt="Zooquariumdesign – ZQD GmbH"
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
