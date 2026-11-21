"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveHome } from "../actions";
import { thumbUrl, forSave } from "@/components/media";
import ImagePicker from "@/components/ImagePicker";
import SaveBar, { notifySaved } from "@/components/SaveBar";
import { Img, toast } from "@/components/ui";

// Ein Projektbild wählen: Projekt + eines seiner Bilder
function PicSelect({ site, projects, value, onChange, label }) {
  const p = projects.find((x) => x.slug === value.project);
  return (
    <div className="card" style={{ padding: 14 }}>
      {label && <label>{label}</label>}
      <select value={value.project} onChange={(e) => onChange({ project: e.target.value, image: 0 })}>
        {projects.map((x) => (
          <option key={x.slug} value={x.slug}>
            {x.title}
            {x.zoo ? ` – ${x.zoo}` : ""}
          </option>
        ))}
      </select>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginTop: 10, paddingBottom: 4 }}>
        {(p?.images || []).map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => onChange({ ...value, image: i })}
            aria-label={`Bild ${i + 1}`}
            aria-pressed={value.image === i}
            style={{
              padding: 0,
              border: value.image === i ? "2px solid var(--ink)" : "2px solid transparent",
              borderRadius: 6,
              background: "none",
              cursor: "pointer",
              flex: "0 0 auto",
            }}
          >
            <Img src={thumbUrl(site, img, 200)} loading="lazy" style={{ width: 84, height: 56, objectFit: "cover", display: "block", borderRadius: 4 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// Projekte in Reihenfolge auswählen (Wolke, ausgewählte Projekte)
function SlugList({ projects, value, onChange, max }) {
  const [add, setAdd] = useState("");
  const name = (s) => projects.find((p) => p.slug === s)?.title || s;
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const n = [...value];
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  const rest = projects.filter((p) => !value.includes(p.slug));
  return (
    <div>
      <div className="list">
        {value.map((s, i) => (
          <div key={s} className="item" style={{ gridTemplateColumns: "28px 1fr auto", padding: "8px 0" }}>
            <span className="muted small">{i + 1}</span>
            <span>{name(s)}</span>
            <span className="actions">
              <button type="button" className="icon" aria-label="Nach oben" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
              <button type="button" className="icon" aria-label="Nach unten" onClick={() => move(i, 1)} disabled={i === value.length - 1}>↓</button>
              <button type="button" className="icon" aria-label="Entfernen" onClick={() => onChange(value.filter((x) => x !== s))}>✕</button>
            </span>
          </div>
        ))}
      </div>
      {(!max || value.length < max) && (
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <select value={add} onChange={(e) => setAdd(e.target.value)}>
            <option value="">Projekt hinzufügen …</option>
            {rest.map((p) => (
              <option key={p.slug} value={p.slug}>{p.title}</option>
            ))}
          </select>
          <button type="button" className="btn ghost" disabled={!add} onClick={() => { onChange([...value, add]); setAdd(""); }}>
            Hinzufügen
          </button>
        </div>
      )}
    </div>
  );
}

export default function HomeForm({ site, initial, projects, phaseLabels = [] }) {
  const [h, setH] = useState(initial);
  const [err, setErr] = useState(null);
  const [saving, start] = useTransition();
  const router = useRouter();
  const [prev, setPrev] = useState(initial);
  if (prev !== initial) {
    setPrev(initial);
    setH(initial);
  }
  const dirty = JSON.stringify(h) !== JSON.stringify(initial);
  const set = (k, v) => setH((x) => ({ ...x, [k]: v }));
  const setAt = (k, i, v) => setH((x) => ({ ...x, [k]: x[k].map((y, j) => (j === i ? { ...y, ...v } : y)) }));

  const save = () =>
    start(async () => {
      setErr(null);
      const r = await saveHome(site, { ...h, hero: { ...h.hero, image: forSave(h.hero.image) } });
      if (r.error) return setErr(r.error);
      notifySaved();
      toast("Startseite im Entwurf gespeichert.");
      router.refresh();
    });

  const FIELD = { Masterplanung: "Masterplanung", Tieranlage: "Tieranlagen", Aquarium: "Aquarien" };
  const PHASE = [0, 1, 2].map((i) => `Phase ${i + 1}${phaseLabels[i] ? ` – ${phaseLabels[i]}` : ""}`);

  return (
    <>
      <div className="head">
        <h1>Startseite<span className="dot">.</span></h1>
      </div>

      <div className="section" style={{ marginTop: 0 }}>
        <h2>Startbild</h2>
        <p className="muted small" style={{ margin: "4px 0 14px" }}>Das große Bild oben. Die Bildunterschrift kommt aus dem verknüpften Projekt.</p>
        <div className="row" style={{ alignItems: "start" }}>
          <ImagePicker site={site} value={h.hero.image} kind="hero" onChange={(img) => set("hero", { ...h.hero, image: img })} />
          <div className="field">
            <label>Verknüpftes Projekt</label>
            <select value={h.hero.project} onChange={(e) => set("hero", { ...h.hero, project: e.target.value })}>
              {projects.map((p) => <option key={p.slug} value={p.slug}>{p.title}{p.zoo ? ` – ${p.zoo}` : ""}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Bildpaar</h2>
        <div className="row">
          {h.pair.map((x, i) => (
            <PicSelect key={i} site={site} projects={projects} value={x} label={i === 0 ? "Links" : "Rechts"} onChange={(v) => setAt("pair", i, v)} />
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Arbeitsfelder</h2>
        <div className="row">
          {h.fields.map((x, i) => (
            <PicSelect key={i} site={site} projects={projects} value={x} label={FIELD[x.type] || x.type} onChange={(v) => setAt("fields", i, v)} />
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Planungsphasen</h2>
        <div className="row">
          {h.phases.map((x, i) => (
            <PicSelect key={i} site={site} projects={projects} value={x} label={PHASE[i]} onChange={(v) => setAt("phases", i, v)} />
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Bildband</h2>
        <div className="row">
          <PicSelect site={site} projects={projects} value={h.band} onChange={(v) => set("band", v)} />
        </div>
      </div>

      <div className="section">
        <h2>Projektwolke</h2>
        <p className="muted small" style={{ margin: "4px 0 14px" }}>Die Bilder, die beim Scrollen durchs Bild ziehen (jeweils das Titelbild).</p>
        <SlugList projects={projects} value={h.cloud} onChange={(v) => set("cloud", v)} />
      </div>


      <SaveBar dirty={dirty} saving={saving} error={err} onSave={save} onReset={() => setH(initial)} />
    </>
  );
}
