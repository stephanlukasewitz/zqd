"use client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { publishDraft, discardDraft } from "@/app/(app)/[site]/actions";
import { Spinner, confirmDialog, toast } from "./ui";

const DONE = ["success", "error", "failure", "inactive", "unknown"];

// Zeigt, ob es unveröffentlichte Änderungen gibt, den Stand der Vorschau bzw. der Live-Seite
// und die Knöpfe zum Veröffentlichen.
export default function DraftBar({ site }) {
  const [s, setS] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(null); // "publish" | "discard"
  const [published, setPublished] = useState(false);
  const [, start] = useTransition();
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

  // Solange Vorschau oder Live-Seite gebaut werden, regelmäßig nachsehen
  // Nach dem Veröffentlichen erscheint der Live-Build erst nach ein paar Sekunden bei GitHub
  const liveState = s?.live?.state ?? (published ? "pending" : null);
  const building = s?.draft ? s.preview && !DONE.includes(s.preview.state) : published && !DONE.includes(liveState);
  useEffect(() => {
    if (!building) return;
    const t = setInterval(load, 6000);
    return () => clearInterval(t);
  }, [building, load]);

  // Live-Build fertig → Hinweis
  const liveDone = published && s && !s.draft && liveState === "success";
  useEffect(() => {
    if (!liveDone) return;
    toast("Die Live-Seite ist aktualisiert.");
    const t = setTimeout(() => setPublished(false), 0);
    return () => clearTimeout(t);
  }, [liveDone]);

  const publish = async () => {
    const ok = await confirmDialog({
      title: "Änderungen veröffentlichen?",
      text: "Der Entwurf geht live. Die Website ist danach in etwa 2–3 Minuten aktualisiert.",
      confirm: "Veröffentlichen",
      danger: true,
    });
    if (!ok) return;
    setBusy("publish");
    const r = await publishDraft(site);
    setBusy(null);
    if (r?.error) return toast(r.error, "err");
    toast("Veröffentlicht – die Live-Seite wird jetzt aktualisiert.");
    setPublished(true);
    // Live-Build erscheint erst nach ein paar Sekunden bei GitHub
    setS((x) => ({ ...x, draft: false, files: [], live: null }));
    setTimeout(load, 4000);
    start(() => router.refresh());
  };

  const discard = async () => {
    const ok = await confirmDialog({
      title: "Entwurf verwerfen?",
      text: "Alle Änderungen seit der letzten Veröffentlichung gehen verloren. Das lässt sich nicht rückgängig machen.",
      confirm: "Verwerfen",
      danger: true,
    });
    if (!ok) return;
    setBusy("discard");
    const r = await discardDraft(site);
    setBusy(null);
    if (r?.error) return toast(r.error, "err");
    toast("Entwurf verworfen.");
    await load();
    start(() => router.refresh());
  };

  if (err)
    return (
      <div className="draft">
        <span className="state" style={{ color: "var(--red)" }}>
          <span className="pulse on" /> {err}
        </span>
      </div>
    );
  if (!s)
    return (
      <div className="draft">
        <span className="state muted">
          <Spinner size={12} /> Stand wird geladen …
        </span>
      </div>
    );

  if (!s.draft) {
    const liveBuilding = published && !DONE.includes(liveState);
    const liveFailed = published && ["error", "failure"].includes(liveState);
    return (
      <div className="draft">
        {liveBuilding ? (
          <span className="state">
            <Spinner size={12} /> Live-Seite wird aktualisiert …
          </span>
        ) : liveFailed ? (
          <span className="state" style={{ color: "var(--red)" }}>
            <span className="pulse on" /> Aktualisierung der Live-Seite fehlgeschlagen
          </span>
        ) : (
          <span className="state">
            <span className="pulse ok" /> Alles veröffentlicht
          </span>
        )}
        <span className="spacer" />
        {(liveBuilding || liveFailed) && s.live?.details && (
          <a className="muted small" href={s.live.details} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            Details ↗
          </a>
        )}
      </div>
    );
  }

  const n = s.files.length;
  const p = s.preview || {};
  const ready = p.state === "success" && p.url;
  const failed = p.state === "error" || p.state === "failure";
  return (
    <div className="draft">
      <span className="state">
        <span className="pulse on" /> Entwurf mit {n} {n === 1 ? "Änderung" : "Änderungen"}
      </span>
      {p.state !== "unknown" && (
        <span className="state muted">
          {ready ? <span className="pulse ok" /> : failed ? <span className="pulse on" /> : <Spinner size={12} />}
          {ready ? "Vorschau bereit" : failed ? "Vorschau fehlgeschlagen" : "Vorschau wird erstellt …"}
        </span>
      )}
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
      <button className="btn ghost sm" disabled={!!busy} onClick={discard}>
        {busy === "discard" && <Spinner size={11} />}
        {busy === "discard" ? "Wird verworfen …" : "Verwerfen"}
      </button>
      <button className="btn red sm" disabled={!!busy} onClick={publish}>
        {busy === "publish" && <Spinner size={11} light />}
        {busy === "publish" ? "Wird veröffentlicht …" : "Veröffentlichen"}
      </button>
    </div>
  );
}
