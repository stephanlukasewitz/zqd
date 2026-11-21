"use client";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveProject } from "../../actions";
import LangTabs from "@/components/LangTabs";
import ImageList from "@/components/ImageList";
import SaveBar, { notifySaved } from "@/components/SaveBar";
import { forSave } from "@/components/media";

// Absätze: durch Leerzeile getrennt. Kennzahlen: eine pro Zeile.
const toParas = (arr) => (arr || []).join("\n\n");
const fromParas = (s) => s.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
const toLines = (arr) => (arr || []).join("\n");
const fromLines = (s) => s.split("\n").map((x) => x.trim()).filter(Boolean);

function toForm(p) {
  const lang = (x = {}) => ({
    title: x.title || "",
    zoo: x.zoo || "",
    city: x.city || "",
    scope: x.scope || "",
    facts: toLines(x.facts),
    text: toParas(x.text),
  });
  return {
    slug: p.slug,
    type: p.type,
    services: p.services || [],
    country: p.country || "",
    year: p.year ?? "",
    de: lang(p.de),
    en: lang(p.en),
    tr: lang(p.tr),
  };
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

export default function ProjectForm({ site, isNew, initial, types, services, countries, countryLabels, liveUrl, slugs }) {
  const start0 = useMemo(() => toForm(initial), [initial]);
  const [f, setF] = useState(start0);
  const [images, setImages] = useState(initial.images || []);
  const [lang, setLang] = useState("de");
  const [slugTouched, setSlugTouched] = useState(false);
  const [labels, setLabels] = useState({ en: "", tr: "" });
  const [err, setErr] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, start] = useTransition();
  const router = useRouter();
  // Nach dem Speichern kommen neue Daten vom Server → Formular übernehmen
  const [prev, setPrev] = useState(initial);
  if (prev !== initial) {
    setPrev(initial);
    setF(start0);
    setImages(initial.images || []);
  }

  const dirty = JSON.stringify(f) !== JSON.stringify(start0) || JSON.stringify(images.map(forSave)) !== JSON.stringify((initial.images || []).map(forSave));
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const setL = (k, v) =>
    setF((x) => {
      const next = { ...x, [lang]: { ...x[lang], [k]: v } };
      if (isNew && !slugTouched && lang === "de" && k === "title") next.slug = slugify(v);
      return next;
    });

  const newCountry = f.country && !countries.includes(f.country);
  const missing = Object.fromEntries(["en", "tr"].map((l) => [l, !f[l].title || !f[l].text]));
  const slugTaken = isNew && slugs.includes(f.slug);

  const save = () =>
    start(async () => {
      setErr(null);
      const data = {
        type: f.type,
        services: f.services,
        country: f.country,
        year: f.year,
        ...Object.fromEntries(
          ["de", "en", "tr"].map((l) => [
            l,
            { title: f[l].title, zoo: f[l].zoo, city: f[l].city, scope: f[l].scope, facts: fromLines(f[l].facts), text: fromParas(f[l].text) },
          ]),
        ),
      };
      const r = await saveProject(site, {
        isNew,
        slug: f.slug,
        data,
        images: images.map(forSave),
        countryLabels: newCountry ? labels : undefined,
      });
      if (r.error) return setErr(r.error);
      notifySaved();
      setSaved(true);
      if (isNew) router.replace(`/${site}/projekte/${r.slug}`);
      else router.refresh();
    });

  const L = f[lang];
  const ph = (k) => (lang === "de" ? "" : f.de[k] ? `Deutsch: ${f.de[k].slice(0, 120)}` : "");

  return (
    <>
      <div className="head">
        <div>
          <p className="small" style={{ margin: "0 0 6px" }}>
            <Link href={`/${site}/projekte`} className="muted" style={{ textDecoration: "none" }}>
              ← Alle Projekte
            </Link>
          </p>
          <h1>
            {f.de.title || (isNew ? "Neues Projekt" : "Ohne Titel")}
            <span className="dot">.</span>
          </h1>
        </div>
        {!isNew && (
          <a className="btn ghost sm" href={`${liveUrl}/projekte/${initial.slug}`} target="_blank" rel="noreferrer">
            Live ansehen ↗
          </a>
        )}
      </div>

      {saved && !dirty && <p className="msg ok">Im Entwurf gespeichert. Die Vorschau wird oben aktualisiert.</p>}

      <div className="card">
        <div className="row">
          <div className="field">
            <label htmlFor="type">Projektart</label>
            <select id="type" value={f.type} onChange={(e) => set("type", e.target.value)}>
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="country">Land</label>
            <input id="country" list="countries" value={f.country} onChange={(e) => set("country", e.target.value)} />
            <datalist id="countries">
              {countries.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="field">
            <label htmlFor="year">Jahr (optional)</label>
            <input id="year" value={f.year} inputMode="numeric" onChange={(e) => set("year", e.target.value)} placeholder="z. B. 2019" />
          </div>
        </div>
        {newCountry && (
          <div className="row">
            <div className="field">
              <label>„{f.country}“ auf Englisch</label>
              <input value={labels.en} onChange={(e) => setLabels((x) => ({ ...x, en: e.target.value }))} />
            </div>
            <div className="field">
              <label>„{f.country}“ auf Türkisch</label>
              <input value={labels.tr} onChange={(e) => setLabels((x) => ({ ...x, tr: e.target.value }))} />
            </div>
          </div>
        )}
        <div className="field" style={{ marginBottom: 6 }}>
          <label>Leistungen (für den Filter)</label>
          {services.map((s) => (
            <label key={s} className="check">
              <input
                type="checkbox"
                checked={f.services.includes(s)}
                onChange={(e) => set("services", e.target.checked ? [...f.services, s] : f.services.filter((x) => x !== s))}
              />
              {s}
            </label>
          ))}
        </div>
        {isNew && (
          <div className="field" style={{ marginTop: 10 }}>
            <label htmlFor="slug">Adresse</label>
            <input
              id="slug"
              value={f.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
            />
            <p className="small muted" style={{ margin: "6px 0 0" }}>
              {slugTaken ? <span style={{ color: "var(--red)" }}>Diese Adresse ist schon vergeben.</span> : <>…/projekte/{f.slug || "…"} · lässt sich später nicht mehr ändern</>}
            </p>
          </div>
        )}
      </div>

      <div className="section">
        <h2>Texte</h2>
        <p className="muted small" style={{ margin: "4px 0 14px" }}>
          Deutsch ist die Hauptsprache. Leere Felder auf Englisch oder Türkisch zeigen auf der Website den deutschen Text.
        </p>
        <LangTabs value={lang} onChange={setLang} missing={missing} />
        <div className="row">
          <div className="field">
            <label>Titel</label>
            <input value={L.title} placeholder={ph("title")} onChange={(e) => setL("title", e.target.value)} />
          </div>
          <div className="field">
            <label>Zoo / Auftraggeber</label>
            <input value={L.zoo} placeholder={ph("zoo")} onChange={(e) => setL("zoo", e.target.value)} />
          </div>
          <div className="field">
            <label>Ort</label>
            <input value={L.city} placeholder={ph("city")} onChange={(e) => setL("city", e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Leistungsumfang</label>
          <input value={L.scope} placeholder={ph("scope")} onChange={(e) => setL("scope", e.target.value)} />
        </div>
        <div className="field">
          <label>Kennzahlen – eine pro Zeile</label>
          <textarea rows={3} value={L.facts} placeholder={ph("facts")} onChange={(e) => setL("facts", e.target.value)} />
        </div>
        <div className="field">
          <label>Projekttext – Absätze durch eine Leerzeile trennen</label>
          <textarea rows={14} value={L.text} placeholder={ph("text")} onChange={(e) => setL("text", e.target.value)} />
        </div>
      </div>

      <div className="section">
        <h2>Bilder</h2>
        <p className="muted small" style={{ margin: "4px 0 14px" }}>
          Das erste Bild ist das Titelbild. Reihenfolge per Ziehen oder mit den Pfeilen ändern. Große Fotos werden automatisch verkleinert.
        </p>
        <ImageList site={site} images={images} onChange={setImages} />
      </div>

      <SaveBar
        dirty={dirty && !slugTaken}
        saving={saving}
        error={err}
        onSave={save}
        onReset={
          isNew
            ? undefined
            : () => {
                setF(start0);
                setImages(initial.images || []);
              }
        }
      />
    </>
  );
}
