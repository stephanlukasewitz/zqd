"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveTeam } from "../actions";
import { forSave, thumbUrl } from "@/components/media";
import ImagePicker from "@/components/ImagePicker";
import LangTabs from "@/components/LangTabs";
import SaveBar, { notifySaved } from "@/components/SaveBar";
import { Img, confirmDialog, toast } from "@/components/ui";

const tri = () => ({ de: "", en: "", tr: "" });

function Tri({ label, value, onChange, lang }) {
  const v = value || tri();
  return (
    <div className="field">
      <label>{label}</label>
      <input value={v[lang] || ""} placeholder={lang !== "de" && v.de ? `Deutsch: ${v.de}` : ""} onChange={(e) => onChange({ ...v, [lang]: e.target.value })} />
    </div>
  );
}

function Mover({ i, n, move, remove }) {
  return (
    <span className="actions">
      <button type="button" className="icon" aria-label="Nach oben" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
      <button type="button" className="icon" aria-label="Nach unten" onClick={() => move(i, 1)} disabled={i === n - 1}>↓</button>
      <button type="button" className="icon" aria-label="Entfernen" onClick={remove}>✕</button>
    </span>
  );
}

export default function TeamForm({ site, initial }) {
  const [t, setT] = useState(initial);
  const [open, setOpen] = useState(null);
  const [lang, setLang] = useState("de");
  const [err, setErr] = useState(null);
  const [saving, start] = useTransition();
  const router = useRouter();
  const [prev, setPrev] = useState(initial);
  if (prev !== initial) {
    setPrev(initial);
    setT(initial);
  }
  const dirty = JSON.stringify(t) !== JSON.stringify(initial);

  const upd = (k, i, v) => setT((x) => ({ ...x, [k]: x[k].map((y, j) => (j === i ? { ...y, ...v } : y)) }));
  const move = (k) => (i, d) =>
    setT((x) => {
      const a = [...x[k]];
      const j = i + d;
      if (j < 0 || j >= a.length) return x;
      [a[i], a[j]] = [a[j], a[i]];
      return { ...x, [k]: a };
    });
  const remove = async (k, i, name) => {
    const ok = await confirmDialog({
      title: `„${name || "Eintrag"}“ entfernen?`,
      text: "Wird erst beim Speichern übernommen.",
      confirm: "Entfernen",
      danger: true,
    });
    if (!ok) return;
    setT((x) => ({ ...x, [k]: x[k].filter((_, j) => j !== i) }));
    setOpen(null);
  };

  const save = () =>
    start(async () => {
      setErr(null);
      const r = await saveTeam(site, {
        people: t.people.map((p) => ({ ...p, image: forSave(p.image) })),
        partners: t.partners.map((p) => ({ ...p, logo: forSave(p.logo) })),
      });
      if (r.error) return setErr(r.error);
      notifySaved();
      toast("Team & Partner im Entwurf gespeichert.");
      router.refresh();
    });

  return (
    <>
      <div className="head">
        <h1>Team & Partner<span className="dot">.</span></h1>
      </div>
      <LangTabs value={lang} onChange={setLang} />

      <div className="section" style={{ marginTop: 0 }}>
        <div className="head" style={{ marginBottom: 12 }}>
          <h2>Team</h2>
          <button
            className="btn ghost sm"
            onClick={() => {
              setT((x) => ({ ...x, people: [...x.people, { id: "", name: "", role: tri(), degree: tri(), focus: tri(), experience: tri(), email: "", image: null }] }));
              setOpen(`p${t.people.length}`);
            }}
          >
            + Person
          </button>
        </div>
        <div className="list">
          {t.people.map((p, i) => (
            <div key={p.id || `new-${i}`} style={{ borderBottom: "1px solid var(--line)" }}>
              <div className="item" style={{ borderBottom: 0 }}>
                {p.image ? <Img src={thumbUrl(site, p.image, 200)} /> : <span className="thumb" />}
                <button type="button" className="t" onClick={() => setOpen(open === `p${i}` ? null : `p${i}`)} style={{ all: "unset", cursor: "pointer" }}>
                  {p.name || <span className="muted">Neue Person</span>}
                  <div className="muted small">{p.role?.[lang] || p.role?.de}</div>
                </button>
                <Mover i={i} n={t.people.length} move={move("people")} remove={() => remove("people", i, p.name)} />
              </div>
              {open === `p${i}` && (
                <div className="row" style={{ padding: "6px 0 22px", alignItems: "start" }}>
                  <ImagePicker site={site} value={p.image} kind="portrait" label="Foto wählen" onChange={(img) => upd("people", i, { image: img })} />
                  <div style={{ gridColumn: "span 2" }}>
                    <div className="row">
                      <div className="field">
                        <label>Name</label>
                        <input value={p.name} onChange={(e) => upd("people", i, { name: e.target.value })} />
                      </div>
                      <div className="field">
                        <label>E-Mail (optional)</label>
                        <input type="email" value={p.email || ""} onChange={(e) => upd("people", i, { email: e.target.value })} />
                      </div>
                    </div>
                    <Tri label="Funktion" lang={lang} value={p.role} onChange={(v) => upd("people", i, { role: v })} />
                    <Tri label="Abschluss / Qualifikation" lang={lang} value={p.degree} onChange={(v) => upd("people", i, { degree: v })} />
                    <Tri label="Aufgabenbereich" lang={lang} value={p.focus} onChange={(v) => upd("people", i, { focus: v })} />
                    <Tri label="Berufserfahrung" lang={lang} value={p.experience} onChange={(v) => upd("people", i, { experience: v })} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="head" style={{ marginBottom: 12 }}>
          <h2>Partner</h2>
          <button
            className="btn ghost sm"
            onClick={() => {
              setT((x) => ({ ...x, partners: [...x.partners, { id: "", name: "", field: tri(), url: "", logo: null }] }));
              setOpen(`q${t.partners.length}`);
            }}
          >
            + Partner
          </button>
        </div>
        <div className="list">
          {t.partners.map((p, i) => (
            <div key={p.id || `new-${i}`} style={{ borderBottom: "1px solid var(--line)" }}>
              <div className="item" style={{ borderBottom: 0 }}>
                {p.logo ? <Img src={thumbUrl(site, p.logo, 200)} style={{ objectFit: "contain", background: "#fff", border: "1px solid var(--line)" }} /> : <span className="thumb" />}
                <button type="button" className="t" onClick={() => setOpen(open === `q${i}` ? null : `q${i}`)} style={{ all: "unset", cursor: "pointer" }}>
                  {p.name || <span className="muted">Neuer Partner</span>}
                  <div className="muted small">{p.field?.[lang] || p.field?.de}</div>
                </button>
                <Mover i={i} n={t.partners.length} move={move("partners")} remove={() => remove("partners", i, p.name)} />
              </div>
              {open === `q${i}` && (
                <div className="row" style={{ padding: "6px 0 22px", alignItems: "start" }}>
                  <ImagePicker site={site} value={p.logo} kind="logo" contain ratio="4 / 3" label="Logo wählen" onChange={(img) => upd("partners", i, { logo: img })} />
                  <div style={{ gridColumn: "span 2" }}>
                    <div className="field">
                      <label>Name</label>
                      <input value={p.name} onChange={(e) => upd("partners", i, { name: e.target.value })} />
                    </div>
                    <Tri label="Bereich (optional)" lang={lang} value={p.field || tri()} onChange={(v) => upd("partners", i, { field: v })} />
                    <div className="field">
                      <label>Website (optional)</label>
                      <input type="url" value={p.url || ""} placeholder="https://" onChange={(e) => upd("partners", i, { url: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} error={err} onSave={save} onReset={() => setT(initial)} />
    </>
  );
}
