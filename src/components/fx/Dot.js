import styles from "./Frame.module.css";

// Roter Schlusspunkt – der Akzent aus dem „Z“ des Logos.
export function Dot() {
  return <span className={styles.dot}>.</span>;
}

// Satz mit rotem Schlusspunkt: "Text." → ["Text", <Dot />]
export function withDot(text) {
  if (typeof text !== "string" || !text.endsWith(".")) return text;
  return [text.slice(0, -1), <Dot key="dot" />];
}
