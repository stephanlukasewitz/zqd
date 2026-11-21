"use client";

import { useEffect, useRef } from "react";

// Einmaliges, zeitgesteuertes Ankommen: Sobald der Bereich ins Bild kommt, setzt
// die Komponente data-in – die Bewegung selbst macht CSS mit fester Dauer. So
// gleitet alles gleich ruhig an seinen Platz, egal wie schnell gescrollt wird.
// Ohne JavaScript, bei „Bewegung reduzieren“, in ?v=2 oder wenn der Bereich beim
// Laden schon sichtbar ist, steht alles sofort da (data-armed wird nie gesetzt).
export default function Arrive({ as: Tag = "div", className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.hasAttribute("data-static")) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;
    el.setAttribute("data-armed", "");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.setAttribute("data-in", "");
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
