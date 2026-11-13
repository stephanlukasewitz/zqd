"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./ProjectModal.module.css";

// Projektansicht als Blatt, das von unten über die Galerie fährt.
export default function ProjectModal({ slug, children }) {
  const router = useRouter();
  const sheet = useRef(null);
  const scroller = useRef(null);
  const [leaving, setLeaving] = useState(false);

  const close = () => {
    if (leaving) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return router.back();
    setLeaving(true);
    setTimeout(() => router.back(), 480);
  };

  // Beim Wechsel zum nächsten Projekt wieder oben beginnen.
  useEffect(() => {
    scroller.current?.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    html.style.paddingRight = scrollbar ? `${scrollbar}px` : "";
    window.__lenis?.stop();
    sheet.current?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const f = sheet.current.querySelectorAll(
          'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = "";
      html.style.paddingRight = "";
      window.__lenis?.start();
      document.querySelector(`[data-slug="${slug}"]`)?.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.overlay} data-leaving={leaving || undefined}>
      <div className={styles.backdrop} onClick={close} />
      <div
        ref={sheet}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`title-${slug}`}
        tabIndex={-1}
      >
        <div ref={scroller} className={styles.scroller} data-lenis-prevent>
          <button type="button" className={styles.close} onClick={close}>
            Schließen <span aria-hidden="true" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
