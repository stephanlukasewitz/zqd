"use client";

import { useEffect, useRef } from "react";

// Tiefe für Bilder – dieselbe Sprache wie die Bilderwolke, nur leise:
//   speed  > 0: das Bild zieht schneller als die Seite (näher), < 0: langsamer (ferner)
//   window: nur der Inhalt bewegt sich im feststehenden Rahmen (Fenster-Effekt)
//   blur:   an den Bildschirmrändern leicht weich, scharf in der Mitte
// Vorerst nur aktiv mit ?v=2 auf der Startseite.

const items = new Set();
let raf = 0;

function frame() {
  raf = 0;
  const vh = window.innerHeight;
  items.forEach((it) => {
    const r = it.el.getBoundingClientRect();
    if (r.bottom < -vh * 0.2 || r.top > vh * 1.2) return;
    // -1 (oben aus dem Bild) … 0 (Mitte) … 1 (unten herein)
    const lim = it.window ? 1 : 1.2;
    const off = Math.max(-lim, Math.min(lim, (r.top + r.height / 2 - vh / 2) / vh));
    const y = Math.round(off * it.speed * vh * 10) / 10;
    if (it.window) {
      // so weit vergrößert, dass beim größten Versatz keine Kante sichtbar wird
      const scale = 1 + (2 * Math.abs(it.speed) * vh) / Math.max(1, r.height) + 0.02;
      it.target.style.transform = `translate3d(0, ${y}px, 0) scale(${scale.toFixed(4)})`;
    } else {
      it.target.style.transform = `translate3d(0, ${y}px, 0)`;
    }
    if (it.blur) {
      const b = Math.max(0, Math.abs(off) - 0.32) * it.blur;
      it.target.style.filter = b > 0.05 ? `blur(${b.toFixed(2)}px)` : "";
    }
  });
}

function request() {
  if (!raf) raf = requestAnimationFrame(frame);
}

export default function Depth({ speed = 0.08, window: win = false, blur = 6, className, innerClassName, style, children }) {
  const ref = useRef(null);
  const inner = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const active = new URLSearchParams(window.location.search).get("v") === "2";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!active || reduce) return;
    // gemessen wird die äußere Ebene, bewegt die innere – so misst sich nichts selbst mit
    const target = inner.current;
    if (!target) return;
    const it = { el, target, speed, window: win, blur };
    target.style.willChange = "transform";
    if (items.size === 0) {
      window.addEventListener("scroll", request, { passive: true });
      window.addEventListener("resize", request);
    }
    items.add(it);
    request();
    return () => {
      items.delete(it);
      target.style.transform = "";
      target.style.filter = "";
      if (items.size === 0) {
        window.removeEventListener("scroll", request);
        window.removeEventListener("resize", request);
      }
    };
  }, [speed, win, blur]);

  return (
    <div ref={ref} className={className} style={{ ...(win ? { overflow: "hidden" } : null), ...style }}>
      <div ref={inner} className={innerClassName}>
        {children}
      </div>
    </div>
  );
}
