"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import TLink from "../transition/TLink";
import styles from "./Journey.module.css";

// Vom Masterplan bis in den Lebensraum: ein breites Bildband, in das man
// Maßstab für Maßstab hineinzoomt. Die nächste Ebene öffnet sich als Fenster in
// der aktuellen. Text steht darunter, nie auf den Bildern.

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export default function Journey({ steps, title }) {
  const root = useRef(null);
  const layers = useRef([]);
  const bar = useRef(null);
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
      const p = clamp(-r.top / (r.height - window.innerHeight));
      if (p === last) return;
      last = p;
      const pos = p * (n - 1);
      const seg = Math.min(n - 2, Math.floor(pos));
      const t = smooth(0.2, 0.8, pos - seg);

      layers.current.forEach((layer, i) => {
        if (!layer) return;
        let scale = 1;
        let opacity = 0;
        let frame = 0;
        if (i === seg) {
          scale = 1 + easeOut(t) * 1.6;
          opacity = 1 - smooth(0.75, 1, t);
        } else if (i === seg + 1) {
          scale = 0.34 + 0.66 * easeOut(t);
          opacity = smooth(0, 0.08, t);
          frame = 1 - smooth(0.75, 1, t);
        }
        if (reduce) {
          scale = 1;
          frame = 0;
        }
        layer.style.transform = `scale(${scale})`;
        layer.style.opacity = opacity;
        layer.style.setProperty("--frame", frame);
        layer.style.visibility = opacity > 0.001 ? "visible" : "hidden";
      });
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
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

  const current = steps[active];

  return (
    <section ref={root} className={styles.journey} style={{ "--steps": n }} aria-labelledby="massstaebe">
      <div className={styles.sticky}>
        <div className={styles.band}>
          {steps.map((s, i) => (
            <div
              key={s.scale}
              ref={(el) => (layers.current[i] = el)}
              className={styles.layer}
              style={i === 0 ? { opacity: 1, visibility: "visible" } : undefined}
            >
              <Image src={s.image} alt={s.alt} fill sizes="100vw" quality={75} className={styles.img} />
            </div>
          ))}
        </div>

        <div className={styles.below}>
          <h2 id="massstaebe" className={styles.title}>
            {title}
          </h2>

          <div className={styles.track} aria-hidden="true">
            <span ref={bar} className={styles.bar} />
          </div>

          <ol className={styles.scales}>
            {steps.map((s, i) => (
              <li key={s.scale} data-on={i === active || undefined}>
                <span className={styles.scale}>{s.scale}</span>
                <span className={styles.word}>{s.word}</span>
              </li>
            ))}
          </ol>

          <div className={styles.detail}>
            <p key={current.scale} className={styles.line}>
              {current.line}
            </p>
            <TLink href={`/projekte/${current.slug}`} className="tlink">
              {current.project} <span className="arrow" aria-hidden="true">→</span>
            </TLink>
          </div>
        </div>
      </div>
    </section>
  );
}
