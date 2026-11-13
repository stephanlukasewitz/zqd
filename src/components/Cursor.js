"use client";

import { useEffect, useRef } from "react";
import styles from "./Cursor.module.css";

// Ein ruhiger Punkt statt Mauszeiger – nur bei feiner Maus, nicht bei Touch.
// Über Elementen mit data-cursor="Text" wächst er und zeigt das Wort.
export default function Cursor() {
  const dot = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = dot.current;
    document.documentElement.classList.add("has-cursor");

    let x = -100,
      y = -100,
      cx = x,
      cy = y,
      raf = 0,
      visible = false;

    const loop = () => {
      const k = reduce ? 1 : 0.22;
      cx += (x - cx) * k;
      cy += (y - cy) * k;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (Math.abs(x - cx) > 0.1 || Math.abs(y - cy) > 0.1) raf = requestAnimationFrame(loop);
      else raf = 0;
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        cx = x;
        cy = y;
        el.dataset.visible = "";
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onOver = (e) => {
      const t = e.target.closest?.("[data-cursor], a, button, summary, label, select");
      if (!t) {
        delete el.dataset.state;
        return;
      }
      const text = t.getAttribute("data-cursor");
      if (text) {
        label.current.textContent = text;
        el.dataset.state = "label";
      } else {
        el.dataset.state = "link";
      }
    };

    const onLeave = () => {
      visible = false;
      delete el.dataset.visible;
    };
    const onDown = () => (el.dataset.down = "");
    const onUp = () => delete el.dataset.down;

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={dot} className={styles.cursor} aria-hidden="true">
      <span className={styles.dot} />
      <span ref={label} className={styles.label} />
    </div>
  );
}
