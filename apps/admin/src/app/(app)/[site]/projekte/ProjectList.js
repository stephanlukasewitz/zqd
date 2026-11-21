"use client";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { reorderProjects, deleteProject } from "../actions";
import { thumbUrl } from "@/components/media";
import SaveBar, { notifySaved } from "@/components/SaveBar";

export default function ProjectList({ site, initial }) {
  const [rows, setRows] = useState(initial);
  const [q, setQ] = useState("");
  const [err, setErr] = useState(null);
  const [saving, start] = useTransition();
  const router = useRouter();
  const dirty = rows.map((r) => r.slug).join() !== initial.map((r) => r.slug).join();
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? rows.filter((r) => (r.title + " " + r.sub).toLowerCase().includes(s)) : rows;
  }, [rows, q]);

  const move = (slug, dir) => {
    const i = rows.findIndex((r) => r.slug === slug);
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
  };
  const save = () =>
    start(async () => {
      const r = await reorderProjects(site, rows.map((x) => x.slug));
      if (r.error) return setErr(r.error);
      setErr(null);
      notifySaved();
      router.refresh();
    });
  const remove = (row) => {
    if (!confirm(`„${row.title}“ wirklich löschen? Das Projekt und seine Bilder werden im Entwurf entfernt.`)) return;
    start(async () => {
      const r = await deleteProject(site, row.slug);
      if (r.error) return alert(r.error);
      setRows((cur) => cur.filter((x) => x.slug !== row.slug));
      notifySaved();
      router.refresh();
    });
  };

  return (
    <>
      <div className="head">
        <h1>
          Projekte<span className="dot">.</span>
        </h1>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input placeholder="Suchen …" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 200 }} />
          <Link className="btn" href={`/${site}/projekte/neu`}>
            + Neues Projekt
          </Link>
        </div>
      </div>
      <p className="muted small" style={{ marginTop: -14, marginBottom: 18 }}>
        Die Reihenfolge entspricht der Projektübersicht auf der Website.
      </p>
      <div className="list">
        {shown.map((r) => {
          const i = rows.indexOf(r);
          return (
            <div className="item" key={r.slug}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {r.cover ? <img src={thumbUrl(site, r.cover, 200)} alt="" loading="lazy" /> : <span className="thumb" />}
              <div className="t">
                <Link href={`/${site}/projekte/${r.slug}`}>{r.title}</Link>
                {r.missing.length > 0 && <span className="tag">Übersetzung fehlt: {r.missing.map((l) => l.toUpperCase()).join(", ")}</span>}
                {r.home.length > 0 && <span className="tag">Startseite</span>}
                <div className="muted small">
                  {r.type} · {r.sub} · {r.count} {r.count === 1 ? "Bild" : "Bilder"}
                </div>
              </div>
              <div className="actions">
                {!q && (
                  <>
                    <button className="icon" aria-label="Nach oben" onClick={() => move(r.slug, -1)} disabled={i === 0}>
                      ↑
                    </button>
                    <button className="icon" aria-label="Nach unten" onClick={() => move(r.slug, 1)} disabled={i === rows.length - 1}>
                      ↓
                    </button>
                  </>
                )}
                <Link className="btn ghost sm" href={`/${site}/projekte/${r.slug}`}>
                  Bearbeiten
                </Link>
                <button className="icon" aria-label="Löschen" title={r.home.length ? "Wird auf der Startseite verwendet" : "Löschen"} onClick={() => remove(r)} disabled={saving}>
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <SaveBar dirty={dirty} saving={saving} error={err} onSave={save} onReset={() => setRows(initial)} note="Reihenfolge geändert" />
    </>
  );
}
