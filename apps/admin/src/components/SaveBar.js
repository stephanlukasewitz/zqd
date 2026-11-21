"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Spinner, confirmDialog } from "./ui";

// Erscheint, sobald etwas geändert wurde. Speichern auch mit ⌘S / Strg+S.
// Warnt beim Verlassen der Seite (Neuladen, Schließen, Links im Dashboard) mit ungespeicherten Änderungen.
export default function SaveBar({ dirty, saving, onSave, onReset, error, note, busyLabel }) {
  const router = useRouter();
  const save = useRef(onSave);
  useEffect(() => {
    save.current = onSave;
  });

  useEffect(() => {
    if (!dirty) return;
    const unload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const key = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!saving) save.current?.();
      }
    };
    // Klicks auf interne Links abfangen
    const click = async (e) => {
      const a = e.target.closest?.("a[href]");
      if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      e.stopPropagation();
      const ok = await confirmDialog({
        title: "Ungespeicherte Änderungen",
        text: "Wenn du die Seite jetzt verlässt, gehen deine Änderungen verloren.",
        confirm: "Seite verlassen",
        cancel: "Hierbleiben",
        danger: true,
      });
      if (ok) {
        window.removeEventListener("beforeunload", unload);
        router.push(url.pathname + url.search);
      }
    };
    window.addEventListener("beforeunload", unload);
    window.addEventListener("keydown", key);
    document.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("beforeunload", unload);
      window.removeEventListener("keydown", key);
      document.removeEventListener("click", click, true);
    };
  }, [dirty, saving, router]);

  if (!dirty && !error && !saving) return null;
  return (
    <div className="savebar" role="region" aria-label="Speichern">
      <span>{error ? <span style={{ color: "#ffb3b8" }}>{error}</span> : saving ? busyLabel || "Wird gespeichert …" : note || "Ungespeicherte Änderungen"}</span>
      <span className="spacer" />
      {onReset && !saving && (
        <button className="btn ghost sm" onClick={onReset}>
          Zurücksetzen
        </button>
      )}
      <button className="btn sm" onClick={onSave} disabled={saving || !dirty}>
        {saving ? (
          <>
            <Spinner size={11} /> Speichern …
          </>
        ) : (
          <>
            Im Entwurf speichern<kbd>⌘S</kbd>
          </>
        )}
      </button>
    </div>
  );
}

// Nach dem Speichern: Entwurfsleiste neu laden
export const notifySaved = () => window.dispatchEvent(new Event("zqd:saved"));
