"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";

const INTERVAL = 7000;

export default function Hero({ slides }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const root = useRef(null);
  const count = slides.length;

  const go = useCallback(
    (dir) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    const el = root.current;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || !inView || reduce || count < 2) return;
    const t = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, inView, go, count]);

  // Wischgesten auf Touch-Geräten
  const touch = useRef(null);
  const onTouchStart = (e) => (touch.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touch.current = null;
  };

  const current = slides[index];

  return (
    <section
      ref={root}
      className={styles.hero}
      data-dark-zone
      aria-roledescription="Karussell"
      aria-label="Ausgewählte Referenzen"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.media}>
        {slides.map((s, i) => (
          <div
            key={s.image.src}
            className={styles.slide}
            data-active={i === index || undefined}
            aria-hidden={i !== index}
          >
            <Image
              src={s.image}
              alt={s.alt}
              fill
              sizes="100vw"
              quality={75}
              preload={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              className={styles.img}
            />
          </div>
        ))}
        <div className={styles.shade} />
      </div>

      <div className={styles.content}>
        <p className={styles.service}>
          Architektur und Generalplanung für zoologische Einrichtungen
        </p>
        <h1 className={styles.claim}>
          <span>Erfahrung als Fundament.</span>{" "}
          <span>Entwicklung als Anspruch.</span>
        </h1>
        <p className={styles.sub}>Wir denken Lebensräume weiter.</p>
        <div className={styles.actions}>
          <Link
            href="/projekte"
            className={styles.primary}
            transitionTypes={["page"]}
          >
            Projekte entdecken <span aria-hidden="true">→</span>
          </Link>
          <a href="#kompetenz" className={styles.secondary}>
            Leistungen kennenlernen
          </a>
        </div>
      </div>

      <div className={styles.caption}>
        <p className={styles.fig} aria-live="polite">
          <span className={styles.figNum}>
            Abb. {String(index + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </span>
          <span className={styles.figTitle} key={current.title}>
            {current.title}
          </span>
        </p>
        <div className={styles.controls}>
          <button type="button" onClick={() => go(-1)} aria-label="Vorheriges Bild">
            ←
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Automatischen Wechsel starten" : "Automatischen Wechsel anhalten"}
            className={styles.pause}
            data-paused={paused || undefined}
          />
          <button type="button" onClick={() => go(1)} aria-label="Nächstes Bild">
            →
          </button>
        </div>
        <div
          className={styles.progress}
          key={index}
          data-running={(!paused && inView) || undefined}
          style={{ "--dur": `${INTERVAL}ms` }}
        />
      </div>
    </section>
  );
}
