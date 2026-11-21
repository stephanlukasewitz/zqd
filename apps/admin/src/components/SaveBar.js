"use client";
import { useEffect } from "react";

// Erscheint, sobald etwas geändert wurde. Warnt beim Verlassen der Seite mit ungespeicherten Änderungen.
export default function SaveBar({ dirty, saving, onSave, onReset, error, note }) {
  useEffect(() => {
    if (!dirty) return;
    const h = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);
  if (!dirty && !error) return null;
  return (
    <div className="savebar" role="region" aria-label="Speichern">
      <span>{error ? <span style={{ color: "#ffb3b8" }}>{error}</span> : note || "Ungespeicherte Änderungen"}</span>
      <span className="spacer" />
      {onReset && (
        <button className="btn ghost sm" onClick={onReset} disabled={saving}>
          Zurücksetzen
        </button>
      )}
      <button className="btn sm" onClick={onSave} disabled={saving || !dirty}>
        {saving ? "Speichern …" : "Im Entwurf speichern"}
      </button>
    </div>
  );
}

// Nach dem Speichern: Entwurfsleiste neu laden
export const notifySaved = () => window.dispatchEvent(new Event("zqd:saved"));
