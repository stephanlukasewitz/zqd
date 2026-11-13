"use client";

import { useState } from "react";
import styles from "./Rows.module.css";

// Große Index-Zeilen – dieselbe Sprache wie Menü und Projektindex.
// Optional aufklappbar (details), beim Überfahren treten die anderen zurück.
export default function Rows({ items, size = "l" }) {
  const [hover, setHover] = useState(null);
  return (
    <ol className={styles.rows} data-size={size} onPointerLeave={() => setHover(null)}>
      {items.map((it, i) => {
        const dim = hover !== null && hover !== i;
        const head = (
          <>
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.label}>{it.label}</span>
            {it.note && <span className={styles.note}>{it.note}</span>}
            {it.details && <span className={styles.plus} aria-hidden="true" />}
          </>
        );
        return (
          <li
            key={it.label}
            className={styles.row}
            data-dim={dim || undefined}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
          >
            {it.details ? (
              <details className={styles.details}>
                <summary className={styles.head}>{head}</summary>
                <div className={styles.body}>
                  {it.text && <p>{it.text}</p>}
                  <ul>
                    {it.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ) : (
              <div className={styles.head}>{head}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
