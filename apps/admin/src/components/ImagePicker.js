"use client";
import { useRef, useState } from "react";
import { thumbUrl, uploadImage } from "./media";
import { Img, Spinner } from "./ui";

// Ein einzelnes Bild (Startbild, Teamfoto, Logo) – ersetzen per Klick oder Ziehen
export default function ImagePicker({ site, value, onChange, kind = "photo", ratio = "3 / 2", contain = false, label = "Bild ersetzen" }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [over, setOver] = useState(false);
  const pick = async (file) => {
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      onChange(await uploadImage(site, file, kind));
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };
  const url = thumbUrl(site, value, 600);
  return (
    <div>
      <div
        className={`img${over ? " over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          pick(e.dataTransfer.files?.[0]);
        }}
      >
        {busy && (
          <div className="progress">
            <Spinner size={22} />
          </div>
        )}
        {url ? (
          <Img src={url} style={{ aspectRatio: ratio, objectFit: contain ? "contain" : "cover", background: "#fff", padding: contain ? 12 : 0, opacity: busy ? 0.45 : undefined }} />
        ) : (
          <div className="drop" style={{ aspectRatio: ratio, border: 0 }}>Kein Bild</div>
        )}
        <div className="bar">
          <button type="button" className="btn ghost sm" onClick={() => input.current.click()} disabled={busy}>
            {busy ? (
              <>
                <Spinner size={11} /> Wird hochgeladen …
              </>
            ) : (
              label
            )}
          </button>
        </div>
      </div>
      {err && <p className="msg err" style={{ marginTop: 8 }}>{err}</p>}
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0]) && (e.target.value = "")} />
    </div>
  );
}
