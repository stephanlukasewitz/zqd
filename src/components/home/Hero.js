"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import TLink from "../transition/TLink";
import styles from "./Hero.module.css";

const INTERVAL = 6500;

export default function Hero({ slides }) {
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(true);
  const [hover, setHover] = useState(false);
  const band = useRef(null);
  const count = slides.length;

  const go = useCallback((dir) => setIndex((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(band.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!inView || hover || reduce || count < 2) return;
    const t = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, inView, hover, go, count]);

  const touch = useRef(null);
  const current = slides[index];

  return (
    <section className={styles.hero} aria-label="Einstieg">
      <div className={styles.top}>
        <p className={styles.service}>
          Architektur und Generalplanung
          <br />
          für zoologische Einrichtungen
        </p>
        <h1 className={styles.claim}>
          <span className={styles.line}>
            <span>Erfahrung als Fundament.</span>
          </span>
          <span className={styles.line}>
            <span>Entwicklung als Anspruch.</span>
          </span>
        </h1>
        <div className={styles.row}>
          <p className={styles.sub}>Wir denken Lebensräume weiter.</p>
          <div className={styles.actions}>
            <TLink href="/projekte" className="tlink">
              Projekte entdecken <span className="arrow" aria-hidden="true">→</span>
            </TLink>
            <a href="#kompetenz" className="tlink">
              Leistungen kennenlernen <span className="arrow" aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>

      <div
        ref={band}
        className={styles.band}
        aria-roledescription="Karussell"
        aria-label="Ausgewählte Referenzen"
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={() => setHover(false)}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current == null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        <TLink
          href={`/projekte/${current.slug}`}
          className={styles.media}
          data-cursor="Ansehen"
          aria-label={`Projekt ansehen: ${current.title}`}
        >
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
        </TLink>

        <div className={styles.caption}>
          <p aria-live="polite" key={current.title} className={styles.title}>
            {current.title}
          </p>
          <div className={styles.controls}>
            <button type="button" onClick={() => go(-1)} aria-label="Vorheriges Bild">
              ←
            </button>
            <span className={styles.count}>
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => go(1)} aria-label="Nächstes Bild">
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
