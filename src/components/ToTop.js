"use client";

// Sanft zurück zum Seitenanfang – über Lenis, falls aktiv.
export default function ToTop({ className }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.4 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      Nach oben <span aria-hidden="true">↑</span>
    </button>
  );
}
