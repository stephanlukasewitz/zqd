"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import styles from "./Lightbox.module.css";

// Bilder einer Projektseite groß ansehen: Klick öffnet, Pfeile/Tasten/Wischen
// blättern, Escape oder Klick daneben schließt.
const Ctx = createContext(() => {});

export function LightboxProvider({ images, title, children }) {
  const [index, setIndex] = useState(-1);
  const [closing, setClosing] = useState(false);
  const opener = useRef(null);
  const closeBtn = useRef(null);
  const touch = useRef(null);
  const open = index >= 0;
  const count = images.length;

  const show = useCallback((i, trigger) => {
    opener.current = trigger || null;
    setClosing(false);
    setIndex(i);
  }, []);

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setIndex(-1);
      setClosing(false);
      opener.current?.focus({ preventScroll: true });
    }, 280);
  }, []);

  const go = useCallback((d) => setIndex((i) => (i + d + count) % count), [count]);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    window.__lenis?.stop();
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = "";
      window.__lenis?.start();
    };
  }, [open, close, go]);

  const current = open ? images[index] : null;

  return (
    <Ctx.Provider value={show}>
      {children}
      {open && (
        <div
          className={styles.overlay}
          data-closing={closing || undefined}
          role="dialog"
          aria-modal="true"
          aria-label={`Bilder: ${title}`}
          onClick={(e) => e.target === e.currentTarget && close()}
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current == null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
        >
          <div className={styles.top}>
            <span>
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <button ref={closeBtn} type="button" className={styles.close} onClick={close}>
              Schließen <span aria-hidden="true" />
            </button>
          </div>

          <div className={styles.stage} onClick={(e) => e.target === e.currentTarget && close()}>
            <div key={index} className={styles.frame}>
              <Image src={current.image} alt={current.alt} fill sizes="92vw" quality={85} className={styles.img} />
            </div>
          </div>

          {count > 1 && (
            <div className={styles.bottom}>
              <button type="button" onClick={() => go(-1)} aria-label="Vorheriges Bild">
                ←
              </button>
              <span className={styles.caption}>{current.alt}</span>
              <button type="button" onClick={() => go(1)} aria-label="Nächstes Bild">
                →
              </button>
            </div>
          )}
        </div>
      )}
    </Ctx.Provider>
  );
}

// Macht ein Bild anklickbar.
export function Zoom({ index, label, className, children }) {
  const show = useContext(Ctx);
  return (
    <button
      type="button"
      className={`${styles.zoom} ${className || ""}`}
      onClick={(e) => show(index, e.currentTarget)}
      aria-label={`Bild vergrößern: ${label}`}
    >
      {children}
    </button>
  );
}
