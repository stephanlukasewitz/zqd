"use client";
import { useEffect, useState } from "react";

// Kleine Bausteine für Rückmeldungen: Spinner, Hinweise (Toasts) und Rückfragen.

export function Spinner({ size = 14, light = false }) {
  return <span className={`spin${light ? " light" : ""}`} style={{ width: size, height: size }} aria-hidden="true" />;
}

// ---------- Hinweise
export function toast(text, type = "ok") {
  window.dispatchEvent(new CustomEvent("zqd:toast", { detail: { text, type, id: Math.random() } }));
}

// ---------- Rückfrage, gibt true/false zurück
export function confirmDialog({ title, text, confirm = "Ja", cancel = "Abbrechen", danger = false }) {
  return new Promise((resolve) => {
    window.dispatchEvent(new CustomEvent("zqd:confirm", { detail: { title, text, confirm, cancel, danger, resolve } }));
  });
}

export function Feedback() {
  const [toasts, setToasts] = useState([]);
  const [ask, setAsk] = useState(null);

  useEffect(() => {
    const onToast = (e) => {
      const t = e.detail;
      setToasts((x) => [...x, t]);
      setTimeout(() => setToasts((x) => x.filter((y) => y.id !== t.id)), t.type === "err" ? 7000 : 3500);
    };
    const onConfirm = (e) => setAsk(e.detail);
    window.addEventListener("zqd:toast", onToast);
    window.addEventListener("zqd:confirm", onConfirm);
    return () => {
      window.removeEventListener("zqd:toast", onToast);
      window.removeEventListener("zqd:confirm", onConfirm);
    };
  }, []);

  const close = (v) => {
    ask?.resolve(v);
    setAsk(null);
  };

  // Escape = abbrechen (Enter bestätigt über den fokussierten Knopf)
  useEffect(() => {
    if (!ask) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      ask.resolve(false);
      setAsk(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ask]);

  return (
    <>
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span className="ic">{t.type === "err" ? "!" : "✓"}</span>
            {t.text}
          </div>
        ))}
      </div>
      {ask && (
        <div className="overlay" onMouseDown={() => close(false)}>
          <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t" onMouseDown={(e) => e.stopPropagation()}>
            <h3 id="dlg-t">{ask.title}</h3>
            {ask.text && <p className="muted">{ask.text}</p>}
            <div className="dialog-actions">
              <button className="btn ghost" onClick={() => close(false)}>
                {ask.cancel}
              </button>
              <button className={`btn${ask.danger ? " red" : ""}`} onClick={() => close(true)} autoFocus>
                {ask.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Bild, das weich einblendet, sobald es geladen ist
export function Img({ src, alt = "", className = "", style, ...rest }) {
  const [loaded, setLoaded] = useState(false);
  const [prev, setPrev] = useState(src);
  if (prev !== src) {
    setPrev(src);
    setLoaded(false);
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`fade${loaded ? " in" : ""} ${className}`}
      style={style}
      onLoad={() => setLoaded(true)}
      ref={(el) => {
        if (el?.complete && el.naturalWidth && !loaded) setLoaded(true);
      }}
      {...rest}
    />
  );
}
