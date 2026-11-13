"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import TLink from "../transition/TLink";
import styles from "./Journey.module.css";

// Die Startseite als Reise durch die Maßstäbe: vom Masterplan bis in den
// Lebensraum. Scrollen zoomt Ebene für Ebene hinein – nur transform/opacity.

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const ease = (t) => 1 - Math.pow(1 - t, 3);

export default function Journey({ steps }) {
  const root = useRef(null);
  const layers = useRef([]);
  const texts = useRef([]);
  const [active, setActive] = useState(0);
  const n = steps.length;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
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
      const pos = p * (n - 1); // 0 … n-1
      const seg = Math.min(n - 2, Math.floor(pos));
      // Halten, dann zoomen: die Mitte jedes Segments ist die Bewegung.
      const tRaw = pos - seg;
      const t = smooth(0.18, 0.82, tRaw);

      layers.current.forEach((layer, i) => {
        if (!layer) return;
        let scale = 1;
        let opacity = 0;
        let frame = 0;
        if (i < seg) {
          opacity = 0;
        } else if (i === seg) {
          scale = 1 + ease(t) * 1.8;
          opacity = 1 - smooth(0.7, 1, t);
        } else if (i === seg + 1) {
          scale = 0.38 + 0.62 * ease(t);
          opacity = smooth(0.0, 0.1, t);
          frame = 1 - smooth(0.7, 1, t);
        }
        layer.style.transform = `translate3d(0,0,0) scale(${scale})`;
        layer.style.opacity = opacity;
        layer.style.setProperty("--frame", frame);
        layer.style.visibility = opacity > 0.001 ? "visible" : "hidden";
      });

      const current = t > 0.55 ? seg + 1 : seg;
      texts.current.forEach((tx, i) => {
        if (!tx) return;
        let o = 0;
        if (i === seg) o = 1 - smooth(0.05, 0.3, t);
        if (i === seg + 1) o = smooth(0.75, 0.98, t);
        tx.style.opacity = o;
        tx.style.transform = `translate3d(0, ${(1 - o) * 24}px, 0)`;
      });
      setActive(current);
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
      data-dark-zone
      aria-label="Vom Masterplan bis in den Lebensraum"
    >
      <div className={styles.sticky}>
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
              sizes="100vw"
              quality={75}
              preload={i === 0}
              loading={i < 2 ? "eager" : "lazy"}
              className={styles.img}
            />
          </div>
        ))}

        <div className={styles.shade} />

        {/* Einstieg */}
        <div ref={(el) => (texts.current[0] = el)} className={styles.text} style={{ opacity: 1 }}>
          <h1 className={styles.claim}>
            Erfahrung als Fundament<span className={styles.dot}>.</span>
            <span className={styles.claim2}>Entwicklung als Anspruch.</span>
          </h1>
          <p className={styles.lede}>
            <span>
              {steps[0].scale} · {steps[0].word}
            </span>
            <span>
              Vom Masterplan bis in den Lebensraum <span aria-hidden="true">↓</span>
            </span>
          </p>
        </div>

        {steps.slice(1).map((s, k) => (
          <div key={s.scale} ref={(el) => (texts.current[k + 1] = el)} className={styles.text}>
            <p className={styles.scale}>{s.scale}</p>
            <h2 className={styles.word}>{s.word}</h2>
            <p className={styles.line}>{s.line}</p>
            <TLink href={`/projekte/${s.slug}`} className={styles.link}>
              {s.project} <span aria-hidden="true">→</span>
            </TLink>
          </div>
        ))}

        {/* Maßstabsleiste */}
        <ol className={styles.gauge} aria-hidden="true">
          {steps.map((s, i) => (
            <li key={s.scale} data-on={i === active || undefined} data-past={i < active || undefined}>
              <span>{s.scale}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
