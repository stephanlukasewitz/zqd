"use client";

import { useEffect, useRef } from "react";

// Tiefe für Bilder – dieselbe Sprache wie die Bilderwolke, nur leise:
//   speed  > 0: das Bild zieht schneller als die Seite (näher), < 0: langsamer (ferner)
//   window: nur der Inhalt bewegt sich im feststehenden Rahmen (Fenster-Effekt)
// Gemessen wird nur beim Laden und bei Größenänderungen; im Frame wird nur verschoben
// (keine Layout-Abfragen, keine animierte Unschärfe) – das bleibt auch auf älteren Geräten flüssig.

const items = new Set();
let raf = 0;

function measure(it) {
  const r = it.el.getBoundingClientRect();
  it.top = r.top + window.scrollY;
  it.height = r.height;
}

function frame() {
  raf = 0;
  const vh = window.innerHeight;
  const sy = window.scrollY;
  items.forEach((it) => {
    const top = it.top - sy;
    if (top + it.height < -vh * 0.2 || top > vh * 1.2) return;
    // -1 (oben aus dem Bild) … 0 (Mitte) … 1 (unten herein)
    const lim = it.window ? 1 : 1.2;
    const off = Math.max(-lim, Math.min(lim, (top + it.height / 2 - vh / 2) / vh));
    const y = Math.round(off * it.speed * vh * 10) / 10;
    if (it.window) {
      // so weit vergrößert, dass beim größten Versatz keine Kante sichtbar wird
      const scale = 1 + (2 * Math.abs(it.speed) * vh) / Math.max(1, it.height) + 0.02;
      it.target.style.transform = `translate3d(0, ${y}px, 0) scale(${scale.toFixed(4)})`;
    } else {
      it.target.style.transform = `translate3d(0, ${y}px, 0)`;
    }
  });
}

function request() {
  if (!raf) raf = requestAnimationFrame(frame);
}

function remeasure() {
  items.forEach(measure);
  request();
}

let ro = null;

export default function Depth({ speed = 0.08, window: win = false, className, innerClassName, style, children }) {
  const ref = useRef(null);
  const inner = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const target = inner.current;
    if (!el || !target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // ?v=2: Vergleichsvariante ohne Tiefen-Effekte
    if (document.documentElement.hasAttribute("data-static")) return;
    // gemessen wird die äußere Ebene, bewegt die innere – so misst sich nichts selbst mit
    const it = { el, target, speed, window: win, top: 0, height: 0 };
    target.style.willChange = "transform";
    if (items.size === 0) {
      window.addEventListener("scroll", request, { passive: true });
      window.addEventListener("resize", remeasure);
      ro = new ResizeObserver(remeasure);
      ro.observe(document.body);
    }
    items.add(it);
    measure(it);
    request();
    return () => {
      items.delete(it);
      target.style.transform = "";
      target.style.willChange = "";
      if (items.size === 0) {
        window.removeEventListener("scroll", request);
        window.removeEventListener("resize", remeasure);
        ro?.disconnect();
        ro = null;
      }
    };
  }, [speed, win]);

  return (
    <div ref={ref} className={className} style={{ ...(win ? { overflow: "hidden" } : null), ...style }}>
      <div ref={inner} className={innerClassName}>
        {children}
      </div>
    </div>
  );
}
