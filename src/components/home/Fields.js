"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import TLink from "../transition/TLink";
import styles from "./Fields.module.css";

// Die drei Aufgabenfelder als große Zeilen. Beim Überfahren schwebt ein Bild
// neben dem Zeiger – wie im Projekt-Index.
export default function Fields({ fields }) {
  const preview = useRef(null);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const el = preview.current;
    let x = 0,
      y = 0,
      cx = 0,
      cy = 0,
      raf = 0;
    const loop = () => {
      cx += (x - cx) * 0.14;
      cy += (y - cy) * 0.14;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.2 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e) => {
      x = e.clientX + 32;
      y = e.clientY - 140;
      if (!cx && !cy) {
        cx = x;
        cy = y;
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className={styles.wrap} onPointerLeave={() => setHover(null)}>
      <ul className={styles.list}>
        {fields.map((f, i) => (
          <li key={f.type}>
            <TLink
              href={`/projekte?art=${encodeURIComponent(f.type)}`}
              className={styles.row}
              data-dim={(hover !== null && hover !== i) || undefined}
              onPointerEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
            >
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.word}>{f.word}</span>
              <span className={styles.line}>{f.line}</span>
              <span className={styles.count}>
                {f.count} <span aria-hidden="true">→</span>
              </span>
            </TLink>
          </li>
        ))}
      </ul>

      <div ref={preview} className={styles.preview} aria-hidden="true">
        {fields.map((f, i) => (
          <div key={f.type} className={styles.pv} data-on={hover === i || undefined}>
            <Image src={f.image} alt="" fill sizes="340px" />
          </div>
        ))}
      </div>
    </div>
  );
}
