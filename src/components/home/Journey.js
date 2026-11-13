"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import TLink from "../transition/TLink";
import styles from "./Journey.module.css";

// Vom Masterplan bis in den Lebensraum: links die Maßstäbe als Index,
// rechts ein Fenster, in dem man Ebene für Ebene hineinzoomt.
// Nur transform/opacity, Text liegt nie auf den Bildern.

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export default function Journey({ steps, title }) {
  const root = useRef(null);
  const layers = useRef([]);
  const [active, setActive] = useState(0);
  const n = steps.length;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = root.current;
    let raf = 0;
    let last = -1;

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp(-r.top / (r.height - vh));
      if (p === last) return;
      last = p;
      const pos = p * (n - 1);
      const seg = Math.min(n - 2, Math.floor(pos));
      const t = smooth(0.25, 0.75, pos - seg);

      layers.current.forEach((layer, i) => {
        if (!layer) return;
        let scale = 1;
        let opacity = 0;
        if (i === seg) {
          scale = 1 + t * 0.35;
          opacity = 1 - smooth(0.35, 0.85, t);
        } else if (i === seg + 1) {
          scale = 0.86 + 0.14 * t;
          opacity = smooth(0.15, 0.65, t);
        }
        if (reduce) scale = 1;
        layer.style.transform = `scale(${scale})`;
        layer.style.opacity = opacity;
        layer.style.visibility = opacity > 0.001 ? "visible" : "hidden";
      });
      setActive(t > 0.5 ? seg + 1 : seg);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [n]);

  return (
    <section
      ref={root}
      className={styles.journey}
      style={{ "--steps": n }}
      aria-labelledby="massstaebe"
    >
      <div className={styles.sticky}>
        <div className={styles.side}>
          <h2 id="massstaebe" className={styles.title}>
            {title}
          </h2>
          <ol className={styles.list}>
            {steps.map((s, i) => (
              <li key={s.scale} data-on={i === active || undefined}>
                <span className={styles.scale}>{s.scale}</span>
                <span className={styles.word}>{s.word}</span>
                <div className={styles.more}>
                  <div>
                    <p>{s.line}</p>
                    <TLink href={`/projekte/${s.slug}`} className="tlink">
                      {s.project} <span className="arrow" aria-hidden="true">→</span>
                    </TLink>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.window}>
          {steps.map((s, i) => (
            <div
              key={s.scale}
              ref={(el) => (layers.current[i] = el)}
              className={styles.layer}
              style={i === 0 ? { opacity: 1, visibility: "visible" } : undefined}
            >
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="(max-width: 900px) 100vw, 58vw"
                className={styles.img}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
