"use client";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveTexts } from "../actions";
import SaveBar, { notifySaved } from "@/components/SaveBar";
import { toast } from "@/components/ui";

const GROUPS = {
  home: "Startseite",
  projects: "Projekte",
  team: "Team",
  contact: "Kontakt",
  nav: "Navigation",
  ui: "Bedienelemente",
  values: "Projektart, Leistungen, Länder",
  meta: "Suchmaschinen & Teilen",
  legal: "Impressum & Datenschutz",
  legalNav: "Rechtliches – Navigation",
  formErrors: "Formular – Fehlermeldungen",
  notFound: "Seite nicht gefunden",
};

// Alle Texte als Liste von Pfaden (z. B. home › claim) – Grundlage ist die deutsche Datei
function leaves(obj, path = [], out = []) {
  if (typeof obj === "string") out.push(path);
  else if (Array.isArray(obj)) obj.forEach((v, i) => leaves(v, [...path, i], out));
  else if (obj && typeof obj === "object") for (const k of Object.keys(obj)) leaves(obj[k], [...path, k], out);
  return out;
}
const get = (o, p) => p.reduce((x, k) => (x == null ? undefined : x[k]), o);
function setIn(o, p, v) {
  const root = structuredClone(o ?? {});
  let cur = root;
  p.forEach((k, i) => {
    if (i === p.length - 1) cur[k] = v;
    else {
      if (cur[k] == null || typeof cur[k] !== "object") cur[k] = typeof p[i + 1] === "number" ? [] : {};
      cur = cur[k];
    }
  });
  return root;
}

function Cell({ value, onChange, placeholder }) {
  const rows = Math.min(8, Math.max(1, Math.ceil((value || placeholder || "").length / 48)));
  return <textarea rows={rows} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

export default function TextsForm({ site, initial }) {
  const [t, setT] = useState(initial);
  const [q, setQ] = useState("");
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [err, setErr] = useState(null);
  const [saving, start] = useTransition();
  const router = useRouter();
  const [prev, setPrev] = useState(initial);
  if (prev !== initial) {
    setPrev(initial);
    setT(initial);
  }
  const paths = useMemo(() => leaves(initial.de), [initial]);
  const dirty = JSON.stringify(t) !== JSON.stringify(initial);

  const groups = useMemo(() => {
    const s = q.trim().toLowerCase();
    const out = {};
    for (const p of paths) {
      const vals = ["de", "en", "tr"].map((l) => get(t[l], p) || "");
      if (onlyMissing && vals[1] && vals[2]) continue;
      if (s && !vals.join(" ").toLowerCase().includes(s) && !p.join(".").toLowerCase().includes(s)) continue;
      (out[p[0]] ||= []).push(p);
    }
    return out;
  }, [paths, t, q, onlyMissing]);

  const save = () =>
    start(async () => {
      setErr(null);
      const r = await saveTexts(site, t);
      if (r.error) return setErr(r.error);
      notifySaved();
      toast("Texte im Entwurf gespeichert.");
      router.refresh();
    });

  return (
    <>
      <div className="head">
        <h1>Texte<span className="dot">.</span></h1>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <label className="check" style={{ margin: 0 }}>
            <input type="checkbox" checked={onlyMissing} onChange={(e) => setOnlyMissing(e.target.checked)} />
            Nur fehlende Übersetzungen
          </label>
          <input placeholder="Suchen …" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 220 }} />
        </div>
      </div>
      <p className="muted small" style={{ marginTop: -14 }}>
        Deutsch ist die Hauptsprache. Projekttexte werden bei den Projekten bearbeitet.
      </p>
      <div className="texts">
        <div className="entry" style={{ borderBottom: "1px solid var(--ink)", paddingBottom: 6 }}>
          <span />
          <strong style={{ fontWeight: 400 }}>Deutsch</strong>
          <strong style={{ fontWeight: 400 }}>Englisch</strong>
          <strong style={{ fontWeight: 400 }}>Türkisch</strong>
        </div>
        {Object.entries(groups).map(([g, list]) => (
          <div className="group" key={g}>
            <h2 style={{ margin: "26px 0 4px" }}>{GROUPS[g] || g}</h2>
            {list.map((p) => {
              const changed = ["de", "en", "tr"].some((l) => get(t[l], p) !== get(initial[l], p));
              return (
                <div className={`entry${changed ? " changed" : ""}`} key={p.join(".")}>
                  <span className="key">{p.slice(1).join(" › ")}</span>
                  {["de", "en", "tr"].map((l) => (
                    <Cell
                      key={l}
                      value={get(t[l], p)}
                      placeholder={l === "de" ? "" : get(t.de, p)}
                      onChange={(v) => setT((x) => ({ ...x, [l]: setIn(x[l], p, v) }))}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
        {!Object.keys(groups).length && <p className="muted">Keine Treffer.</p>}
      </div>
      <SaveBar dirty={dirty} saving={saving} error={err} onSave={save} onReset={() => setT(initial)} />
    </>
  );
}
