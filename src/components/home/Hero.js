"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import TLink from "../transition/TLink";
import Reveal from "../fx/Reveal";
import WaterImage from "../fx/WaterImage";
import { withDot } from "../fx/Dot";
import styles from "./Hero.module.css";

const INTERVAL = 7000;

// Erster Bildschirm: ein Vollbild-Foto, darüber nur Schriftzug und Menü.
// Der Claim folgt darunter auf Weiß.
export default function Hero({ slides, claim }) {
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(true);
  const [gl, setGl] = useState(false);
  const stage = useRef(null);
  const touch = useRef(null);
  const count = slides.length;
  const go = useCallback((d) => setIndex((i) => (i + d + count) % count), [count]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(stage.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!inView || reduce || count < 2) return;
    const t = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, inView, go, count]);

  const current = slides[index];

  return (
    <>
      <section
        ref={stage}
        className={styles.stage}
        data-dark-zone
        aria-roledescription="Karussell"
        aria-label="Ausgewählte Referenzen"
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current == null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        <div className={styles.media} data-gl={gl || undefined}>
          {slides.map((s, i) => (
            <div key={s.image.src} className={styles.slide} data-active={i === index || undefined}>
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="100vw"
                preload={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                className={styles.img}
              />
            </div>
          ))}
          <WaterImage
            className={styles.canvas}
            sources={slides.map((s) => s.image.src)}
            index={index}
            onReady={() => setGl(true)}
          />
        </div>

        <div className={styles.bar}>
          <TLink href={`/projekte/${current.slug}`} className={styles.title}>
            <span key={current.title}>{current.title}</span>
          </TLink>
          <div className={styles.controls}>
            <button type="button" onClick={() => go(-1)} aria-label="Vorheriges Bild">
              ←
            </button>
            <span>
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => go(1)} aria-label="Nächstes Bild">
              →
            </button>
          </div>
        </div>
      </section>

      <section className={styles.intro} aria-label="Claim">
        <h1 className={styles.claim}>
          <Reveal className={styles.l1}>{withDot(claim[0])}</Reveal>
          <Reveal className={styles.l2} delay={120}>
            {claim[1]}
          </Reveal>
        </h1>
      </section>
    </>
  );
}
