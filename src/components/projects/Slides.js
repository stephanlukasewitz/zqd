"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./Slides.module.css";

// D05: horizontale Galerie – Wischen (native Scroll-Snap), Pfeile, Tastatur, Vorschaubilder.
export default function Slides({ slides, title }) {
  const track = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    const items = [...el.children];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            setIndex(items.indexOf(e.target));
          }
        }
      },
      { root: el, threshold: [0.6] },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);

  const goTo = (i) => {
    const el = track.current;
    const n = Math.max(0, Math.min(slides.length - 1, i));
    const item = el.children[n];
    el.scrollTo({ left: item.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  const onKey = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    }
  };

  const current = slides[index];

  return (
    <section className={styles.slides} aria-roledescription="Bildergalerie" aria-label={`Bilder: ${title}`}>
      <div
        ref={track}
        className={styles.track}
        tabIndex={0}
        onKeyDown={onKey}
        aria-label="Mit den Pfeiltasten blättern"
      >
        {slides.map((s, i) => (
          <figure
            key={i}
            className={styles.slide}
            aria-roledescription="Bild"
            aria-label={`${i + 1} von ${slides.length}`}
          >
            <div
              className={styles.frame}
              style={{ aspectRatio: `${s.image.width} / ${s.image.height}` }}
            >
              <Image
                src={s.image}
                alt={s.alt}
                fill
                sizes="(max-width: 760px) 92vw, 70vw"
                className={styles.img}
              />
            </div>
          </figure>
        ))}
      </div>

      <div className={styles.bar}>
        <p className={styles.caption} aria-live="polite">
          <span className={styles.num}>
            Abb. {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
          {current?.caption && <span>{current.caption}</span>}
        </p>
        <div className={styles.arrows}>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Vorheriges Bild"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === slides.length - 1}
            aria-label="Nächstes Bild"
          >
            →
          </button>
        </div>
      </div>

      {slides.length > 2 && (
        <div className={styles.thumbs}>
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              className={styles.thumb}
              aria-label={`Bild ${i + 1} anzeigen`}
              aria-current={i === index || undefined}
              onClick={() => goTo(i)}
            >
              <Image src={s.image} alt="" fill sizes="96px" className={styles.thumbImg} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
