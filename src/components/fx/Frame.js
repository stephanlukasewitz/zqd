"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Frame.module.css";

// Das Rahmen-Motiv aus dem ZQD-Logo: ein Schlüsselwort wird von einer feinen
// Linie eingefasst, die sich zeichnet, sobald das Wort ins Bild kommt.
export default function Frame({ children, delay = 500 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className={styles.frame} data-on={on || undefined} style={{ "--delay": `${delay}ms` }}>
      {children}
      <svg className={styles.box} aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100">
        <rect x="0" y="0" width="100" height="100" pathLength="1" />
      </svg>
    </span>
  );
}

// Roter Schlusspunkt – der Akzent aus dem „Z“ des Logos.
export function Dot() {
  return <span className={styles.dot}>.</span>;
}
