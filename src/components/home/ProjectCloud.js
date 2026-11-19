"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import TLink from "../transition/TLink";
import styles from "./ProjectCloud.module.css";

// Ausgewählte Projekte als „Bilderwolke“: Beim Scrollen steigen die Bilder in
// unterschiedlicher Tiefe auf – ferne (klein) langsam und hinter dem Titel,
// nahe (groß) schnell und davor. Oben und unten zeichnen zwei feste Bänder weich,
// scharf ist nur die Mitte. Gerechnet wird pro Frame nur ein translate je Bild.

// Jedes Bild durchquert die Bildschirmmitte zu einem eigenen Zeitpunkt t (gleichmäßig
// über die Sektion verteilt) – so gibt es weder Klumpen noch Lücken.
// x: linke Kante (% der Breite), w: Breite (vw), r: Seitenverhältnis (B/H),
// d: Tiefe – nahe Bilder (d ≥ 1) sind größer, schneller und liegen vor dem Titel.
const SLOTS = [
  { x: 9, w: 14, r: 4 / 5, d: 1.0 },
  { x: 71, w: 12, r: 1, d: 0.8 },
  { x: 41, w: 9, r: 3 / 2, d: 0.55 },
  { x: 84, w: 11, r: 4 / 5, d: 0.7 },
  { x: 15, w: 21, r: 3 / 2, d: 1.35 },
  { x: 60, w: 11, r: 4 / 5, d: 0.75 },
  { x: 2, w: 9, r: 1, d: 0.6 },
  { x: 68, w: 22, r: 4 / 5, d: 1.45 },
  { x: 30, w: 12, r: 1, d: 0.8 },
  { x: 52, w: 9, r: 3 / 2, d: 0.5 },
  { x: 6, w: 17, r: 4 / 5, d: 1.15 },
  { x: 80, w: 12, r: 3 / 2, d: 0.9 },
  { x: 38, w: 19, r: 4 / 5, d: 1.3 },
  { x: 62, w: 10, r: 1, d: 0.65 },
];

export default function ProjectCloud({ items, title, allLabel }) {
  const root = useRef(null);
  const tiles = useRef([]);
  const text = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = false;
    // Maße nur beim Laden und bei Größenänderungen lesen – im Frame wird nur geschrieben
    const m = { top: 0, span: 1, vh: 0, heights: [] };
    const measure = () => {
      const r = el.getBoundingClientRect();
      m.vh = window.innerHeight;
      m.top = r.top + window.scrollY;
      m.span = Math.max(1, r.height - m.vh);
      m.heights = tiles.current.map((t) => (t ? t.offsetHeight : 0));
    };

    const frame = () => {
      raf = 0;
      const { vh, heights } = m;
      const p = Math.min(1, Math.max(0, (window.scrollY - m.top) / m.span));
      const n = tiles.current.length;
      tiles.current.forEach((t, i) => {
        if (!t) return;
        const slot = SLOTS[i % SLOTS.length];
        const h = heights[i];
        // verteilt bis an beide Enden: schon beim Hereinscrollen und bis zum Schluss Bilder im Bild
        const at = -0.06 + (i / Math.max(1, n - 1)) * 1.06;
        const speed = vh * (1.8 + slot.d * 1.4);
        const y = reduce ? vh / 2 - h / 2 : vh / 2 - h / 2 + (at - p) * speed;
        // außerhalb des Bildschirms gar nicht zeichnen lassen
        const out = y > vh + 40 || y < -h - 40;
        if (out !== t._out) {
          t.style.visibility = out ? "hidden" : "";
          t._out = out;
        }
        if (!out) t.style.transform = `translate3d(0, ${Math.round(y * 10) / 10}px, 0)`;
      });
      if (text.current) {
        const o = Math.min(1, Math.min(p + 0.12, 1 - p) * 8);
        text.current.style.opacity = reduce ? 1 : o.toFixed(3);
      }
    };
    const request = () => {
      if (visible && !raf) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      request();
    });
    io.observe(el);
    const onResize = () => {
      measure();
      request();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(el);
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", onResize);
    measure();
    frame();
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section ref={root} className={styles.cloud} aria-labelledby="auswahl">
      <div className={styles.sticky}>
        <div ref={text} className={styles.text}>
          <h2 id="auswahl" className={styles.title}>
            {title}
          </h2>
          <TLink href="/projekte" className="tlink">
            {allLabel} <span className="arrow" aria-hidden="true">→</span>
          </TLink>
        </div>

        <ul className={styles.tiles}>
          {items.map((p, i) => {
            const slot = SLOTS[i % SLOTS.length];
            return (
              <li
                key={p.slug}
                ref={(n) => (tiles.current[i] = n)}
                className={styles.tile}
                data-near={slot.d >= 1 || undefined}
                style={{ left: `${slot.x}%`, "--w": slot.w, aspectRatio: slot.r }}
              >
                <TLink href={`/projekte/${p.slug}`} aria-label={p.title} className={styles.link}>
                  <Image src={p.image} alt={p.alt} fill sizes={`${Math.ceil(slot.w * 1.6)}vw`} className={styles.img} />
                </TLink>
              </li>
            );
          })}
        </ul>

        <div className={`${styles.haze} ${styles.top}`} aria-hidden="true" />
        <div className={`${styles.haze} ${styles.bottom}`} aria-hidden="true" />
      </div>
    </section>
  );
}
