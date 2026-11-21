"use client";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSiteInfo } from "../actions";
import SaveBar, { notifySaved } from "@/components/SaveBar";

const FIELDS = [
  ["legalName", "Firmenname"],
  ["email", "E-Mail"],
  ["phone", "Telefon"],
  ["street", "Straße"],
  ["zip", "PLZ"],
  ["city", "Ort"],
  ["country", "Land"],
  ["mapsQuery", "Suchbegriff für Google Maps (Route planen)"],
];

export default function SiteForm({ site, initial }) {
  const start0 = useMemo(
    () => ({ ...Object.fromEntries(FIELDS.map(([k]) => [k, initial[k] || ""])), description: initial.description || "", lat: String(initial.geo?.lat ?? ""), lng: String(initial.geo?.lng ?? "") }),
    [initial],
  );
  const [f, setF] = useState(start0);
  const [err, setErr] = useState(null);
  const [saving, start] = useTransition();
  const router = useRouter();
  const [prev, setPrev] = useState(start0);
  if (prev !== start0) {
    setPrev(start0);
    setF(start0);
  }
  const dirty = JSON.stringify(f) !== JSON.stringify(start0);
  const save = () =>
    start(async () => {
      setErr(null);
      const r = await saveSiteInfo(site, f);
      if (r.error) return setErr(r.error);
      notifySaved();
      router.refresh();
    });
  const input = (k, label) => (
    <div className="field" key={k}>
      <label htmlFor={k}>{label}</label>
      <input id={k} value={f[k]} onChange={(e) => setF((x) => ({ ...x, [k]: e.target.value }))} />
    </div>
  );
  return (
    <>
      <div className="head">
        <h1>Kontaktdaten<span className="dot">.</span></h1>
      </div>
      <div className="card">
        <div className="row">{FIELDS.slice(0, 3).map(([k, l]) => input(k, l))}</div>
        <div className="row">{FIELDS.slice(3, 7).map(([k, l]) => input(k, l))}</div>
        {input("mapsQuery", FIELDS[7][1])}
        <div className="row">
          {input("lat", "Kartenposition – Breitengrad")}
          {input("lng", "Kartenposition – Längengrad")}
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="description">Kurzbeschreibung (für Suchmaschinen)</label>
          <textarea id="description" rows={3} value={f.description} onChange={(e) => setF((x) => ({ ...x, description: e.target.value }))} />
        </div>
      </div>
      <SaveBar dirty={dirty} saving={saving} error={err} onSave={save} onReset={() => setF(start0)} />
    </>
  );
}
