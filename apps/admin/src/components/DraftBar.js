"use client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { publishDraft, discardDraft } from "@/app/(app)/[site]/actions";

// Zeigt, ob es unveröffentlichte Änderungen gibt, den Stand der Vorschau und die Knöpfe zum Veröffentlichen.
export default function DraftBar({ site }) {
  const [s, setS] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, start] = useTransition();
  const router = useRouter();

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/status/${site}`, { cache: "no-store" });
      const j = await r.json();
      if (j.error) setErr(j.error);
      else {
        setErr(null);
        setS(j);
      }
    } catch {}
  }, [site]);

  useEffect(() => {
    const first = setTimeout(load, 0);
    const onChange = () => load();
    window.addEventListener("zqd:saved", onChange);
    return () => {
      clearTimeout(first);
      window.removeEventListener("zqd:saved", onChange);
    };
  }, [load]);

  // Solange die Vorschau gebaut wird, regelmäßig nachsehen
  const waiting = s?.draft && s.preview && !["success", "error", "failure", "inactive"].includes(s.preview.state);
  useEffect(() => {
    if (!waiting) return;
    const t = setInterval(load, 6000);
    return () => clearInterval(t);
  }, [waiting, load]);

  const act = (fn, confirmText) => {
    if (!confirm(confirmText)) return;
    start(async () => {
      const r = await fn(site);
      if (r?.error) setErr(r.error);
      await load();
      router.refresh();
    });
  };

  if (err) return <div className="draft"><span className="msg err" style={{ margin: 0 }}>{err}</span></div>;
  if (!s) return <div className="draft"><span className="muted">Stand wird geladen …</span></div>;
  if (!s.draft)
    return (
      <div className="draft">
        <span className="state"><span className="pulse ok" /> Alles veröffentlicht</span>
      </div>
    );

  const n = s.files.length;
  const p = s.preview || {};
  const ready = p.state === "success" && p.url;
  const failed = p.state === "error" || p.state === "failure";
  return (
    <div className="draft">
      <span className="state">
        <span className="pulse on" /> Entwurf mit {n} {n === 1 ? "Änderung" : "Änderungen"}
      </span>
      <span className="state muted">
        <span className={`pulse ${ready ? "ok" : failed ? "on" : "wait"}`} />
        {ready ? "Vorschau bereit" : failed ? "Vorschau fehlgeschlagen" : "Vorschau wird erstellt …"}
      </span>
      <span className="spacer" />
      {p.details && (
        <a className="muted small" href={p.details} target="_blank" rel="noreferrer" title="Build bei Vercel" style={{ textDecoration: "none" }}>
          Details ↗
        </a>
      )}
      {ready && (
        <a className="btn ghost sm" href={p.url} target="_blank" rel="noreferrer">
          Vorschau ansehen ↗
        </a>
      )}
      <button
        className="btn ghost sm"
        disabled={busy}
        onClick={() => act(discardDraft, "Alle unveröffentlichten Änderungen verwerfen? Das lässt sich nicht rückgängig machen.")}
      >
        Verwerfen
      </button>
      <button
        className="btn red sm"
        disabled={busy}
        onClick={() => act(publishDraft, "Änderungen jetzt veröffentlichen? Die Live-Seite wird in etwa 2–3 Minuten aktualisiert.")}
      >
        {busy ? "Bitte warten …" : "Veröffentlichen"}
      </button>
    </div>
  );
}
