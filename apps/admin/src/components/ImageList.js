"use client";
import { useEffect, useRef, useState } from "react";
import { thumbUrl, uploadImage } from "./media";
import { Img, Spinner, toast } from "./ui";

// Bilder eines Projekts: Reihenfolge per Ziehen oder Pfeilen, erstes Bild = Titelbild
export default function ImageList({ site, images, onChange, onUploading }) {
  const input = useRef(null);
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(null);
  const [pending, setPending] = useState([]); // { id, preview } – Bilder, die gerade hochladen
  const uploading = pending.length;
  useEffect(() => {
    onUploading?.(uploading);
  }, [uploading, onUploading]);
  const [err, setErr] = useState(null);
  const [dropOver, setDropOver] = useState(false);

  const move = (from, to) => {
    if (to < 0 || to >= images.length || from === to) return;
    const next = [...images];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onChange(next);
  };
  const remove = (i) => onChange(images.filter((_, j) => j !== i));

  const add = async (files) => {
    const list = [...(files || [])].filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setErr(null);
    const jobs = list.map((f) => ({ id: Math.random().toString(36).slice(2), file: f, preview: URL.createObjectURL(f) }));
    setPending((p) => [...p, ...jobs]);
    // Nacheinander hochladen, jedes fertige Bild sofort anzeigen
    let failed = 0;
    for (const j of jobs) {
      try {
        const img = await uploadImage(site, j.file, "photo");
        onChange((cur) => [...cur, { ...img, preview: j.preview }]);
      } catch (e) {
        failed++;
        setErr(`${j.file.name}: ${e.message}`);
      } finally {
        setPending((p) => p.filter((x) => x.id !== j.id));
      }
    }
    const ok = jobs.length - failed;
    if (ok) toast(ok === 1 ? "Bild hochgeladen – noch speichern nicht vergessen." : `${ok} Bilder hochgeladen – noch speichern nicht vergessen.`);
  };

  return (
    <div>
      <div className="images">
        {images.map((img, i) => (
          <div
            key={img.src || img.blob}
            className={`img${drag === i ? " dragging" : ""}${over === i && drag !== i ? " over" : ""}`}
            draggable
            onDragStart={(e) => {
              setDrag(i);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              if (drag === null) return;
              e.preventDefault();
              setOver(i);
            }}
            onDrop={(e) => {
              if (drag === null) return;
              e.preventDefault();
              move(drag, i);
              setDrag(null);
              setOver(null);
            }}
            onDragEnd={() => {
              setDrag(null);
              setOver(null);
            }}
          >
            {i === 0 && <span className="badge">Titelbild</span>}
            <Img src={thumbUrl(site, img, 400)} loading="lazy" draggable={false} />
            <div className="bar">
              <span style={{ display: "flex", gap: 4 }}>
                <button type="button" className="icon" aria-label="Nach vorne" onClick={() => move(i, i - 1)} disabled={i === 0}>
                  ←
                </button>
                <button type="button" className="icon" aria-label="Nach hinten" onClick={() => move(i, i + 1)} disabled={i === images.length - 1}>
                  →
                </button>
              </span>
              <button type="button" className="icon" aria-label="Bild entfernen" title="Entfernen" onClick={() => remove(i)}>
                ✕
              </button>
            </div>
          </div>
        ))}
        {pending.map((j) => (
          <div key={j.id} className="img uploading">
            <Img src={j.preview} />
            <div className="progress">
              <Spinner size={22} />
            </div>
            <div className="bar">
              <span className="muted small">Wird hochgeladen …</span>
            </div>
          </div>
        ))}
        <div
          className={`drop${dropOver ? " over" : ""}`}
          onClick={() => input.current.click()}
          onDragOver={(e) => {
            if (drag !== null) return;
            e.preventDefault();
            setDropOver(true);
          }}
          onDragLeave={() => setDropOver(false)}
          onDrop={(e) => {
            if (drag !== null) return;
            e.preventDefault();
            setDropOver(false);
            add(e.dataTransfer.files);
          }}
        >
          {"+ Bilder hinzufügen\n(klicken oder hierher ziehen)"}
        </div>
      </div>
      {err && <p className="msg err" style={{ marginTop: 10 }}>{err}</p>}
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          add(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
