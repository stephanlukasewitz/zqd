"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import styles from "./ProjectModal.module.css";

// D01/D06: mittig aufgehende Karte über der abgedunkelten Galerie.
export default function ProjectModal({ slug, children }) {
  const router = useRouter();
  const card = useRef(null);
  const closing = useRef(false);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    router.back();
  };

  useEffect(() => {
    const prevFocus = document.activeElement;
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    html.style.paddingRight = scrollbar ? `${scrollbar}px` : "";
    card.current?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const f = card.current.querySelectorAll(
          'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"]),input,select,textarea',
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
      // Fokus kehrt zur Ausgangskachel zurück.
      const tile = document.querySelector(`[data-slug="${slug}"]`);
      (tile || prevFocus)?.focus?.({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && close()}>
      <div
        ref={card}
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`title-${slug}`}
        tabIndex={-1}
      >
        <button type="button" className={styles.close} onClick={close} aria-label="Projekt schließen">
          <span aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}
