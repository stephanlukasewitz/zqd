"use client";
import { useRef, useState } from "react";
import { thumbUrl, uploadImage } from "./media";

// Bilder eines Projekts: Reihenfolge per Ziehen oder Pfeilen, erstes Bild = Titelbild
export default function ImageList({ site, images, onChange }) {
  const input = useRef(null);
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(null);
  const [uploading, setUploading] = useState(0);
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
    setUploading((n) => n + list.length);
    const added = [];
    for (const f of list) {
      try {
        added.push(await uploadImage(site, f, "photo"));
      } catch (e) {
        setErr(`${f.name}: ${e.message}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    // Neueste Liste verwenden (während des Hochladens kann umsortiert worden sein)
    onChange((cur) => [...cur, ...added]);
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbUrl(site, img, 400)} alt="" loading="lazy" draggable={false} />
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
          {uploading ? `${uploading} ${uploading === 1 ? "Bild wird" : "Bilder werden"} hochgeladen …` : "+ Bilder hinzufügen\n(klicken oder hierher ziehen)"}
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
