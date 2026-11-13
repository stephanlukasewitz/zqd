"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import TLink from "../transition/TLink";
import Reveal from "../fx/Reveal";
import WaterImage from "../fx/WaterImage";
import styles from "./Hero.module.css";

const INTERVAL = 7000;

export default function Hero({ slides }) {
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(true);
  const [gl, setGl] = useState(false);
  const stage = useRef(null);
  const count = slides.length;

  const go = useCallback((dir) => setIndex((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(stage.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!inView || reduce || count < 2) return;
    const t = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, inView, go, count]);

  const touch = useRef(null);
  const current = slides[index];

  return (
    <section className={styles.hero} aria-label="Einstieg">
      <div className={styles.top}>
        <p className={styles.service}>
          <span>Zooquariumdesign</span>
          <span>Architektur und Generalplanung für zoologische Einrichtungen</span>
        </p>
        <h1 className={styles.claim}>
          <Reveal className={styles.l1}>Erfahrung als Fundament.</Reveal>
          <Reveal className={styles.l2} delay={120}>
            Entwicklung als Anspruch.
          </Reveal>
        </h1>
        <div className={styles.row}>
          <p className={styles.sub}>Wir denken Lebensräume weiter.</p>
          <div className={styles.actions}>
            <TLink href="/projekte" className="tlink">
              Projekte entdecken <span className="arrow" aria-hidden="true">→</span>
            </TLink>
            <a href="#kompetenz" className="tlink">
              Leistungen <span className="arrow" aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>

      <div ref={stage} className={styles.stage}>
        <div className={styles.sticky}>
          <div
            className={styles.frame}
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
              <WaterImage
                className={styles.canvas}
                sources={slides.map((s) => s.image.src)}
                index={index}
                onReady={() => setGl(true)}
              />
            </div>

          </div>
            <div className={styles.caption}>
            <TLink href={`/projekte/${current.slug}`} className={styles.title}>
              <span key={current.title} className={styles.titleText}>
                {current.title}
              </span>
              <span className={styles.view}>Projekt ansehen →</span>
            </TLink>
            <div className={styles.controls}>
              <button type="button" onClick={() => go(-1)} aria-label="Vorheriges Bild">
                ←
              </button>
              <span className={styles.count}>
                {String(index + 1).padStart(2, "0")}
                <i>/</i>
                {String(count).padStart(2, "0")}
              </span>
              <button type="button" onClick={() => go(1)} aria-label="Nächstes Bild">
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
