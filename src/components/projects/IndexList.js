"use client";

import Image from "next/image";
import TLink from "../transition/TLink";
import { useEffect, useRef, useState } from "react";
import styles from "./IndexList.module.css";

// Projekte als Index – beim Überfahren einer Zeile schwebt das Bild neben dem Zeiger.
export default function IndexList({ items, numbers }) {
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
      x = e.clientX + 28;
      y = e.clientY - 120;
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
      <div className={`${styles.row} ${styles.headRow}`} aria-hidden="true">
        <span>Nr.</span>
        <span>Projekt</span>
        <span>Auftraggeber</span>
        <span>Ort</span>
        <span>Aufgabe</span>
      </div>
      <ul>
        {items.map((p) => (
          <li key={p.slug}>
            <TLink
              href={`/projekte/${p.slug}`}
              data-slug={p.slug}
              onClick={() => {
                try {
                  sessionStorage.setItem("zqd:projekte-y", String(window.scrollY));
                } catch {}
              }}
              className={styles.row}
              data-dim={(hover && hover !== p.slug) || undefined}
              onPointerEnter={() => setHover(p.slug)}
              onFocus={() => setHover(p.slug)}
            >
              <span className={styles.num}>{numbers[p.slug]}</span>
              <span className={styles.title}>{p.title}</span>
              <span>{p.zoo || "–"}</span>
              <span>{[p.city, p.country].filter(Boolean).join(", ")}</span>
              <span>{p.type}</span>
            </TLink>
          </li>
        ))}
      </ul>

      <div ref={preview} className={styles.preview} aria-hidden="true">
        {items.map((p) => (
          <div key={p.slug} className={styles.pv} data-on={hover === p.slug || undefined}>
            <Image src={p.cover.image} alt="" fill sizes="360px" />
          </div>
        ))}
      </div>
    </div>
  );
}
