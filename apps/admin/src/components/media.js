"use client";

// Vorschau-Adresse eines Bildes: neu hochgeladen → lokale Vorschau, sonst über das Dashboard aus dem Repository
export function thumbUrl(site, img, w = 480) {
  if (!img) return null;
  if (img.preview) return img.preview;
  if (!img.src) return null;
  return `/api/media/${site}/${img.src.replace(/^\/media\//, "")}?w=${w}`;
}

// Große Fotos vor dem Hochladen im Browser verkleinern (Upload-Grenze ca. 4,5 MB)
async function shrink(file, kind) {
  const small = file.size < 3.5 * 1024 * 1024 && /^image\/(jpeg|png|webp)$/.test(file.type);
  if (small) return file;
  const bmp = await createImageBitmap(file);
  const max = 3000;
  const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * s);
  c.height = Math.round(bmp.height * s);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  const type = kind === "logo" ? "image/png" : "image/jpeg";
  return await new Promise((r) => c.toBlob(r, type, 0.9));
}

export async function uploadImage(site, file, kind = "photo") {
  const body = await shrink(file, kind);
  const res = await fetch(`/api/upload/${site}?kind=${kind}`, { method: "POST", body });
  let j;
  try {
    j = await res.json();
  } catch {
    throw new Error(res.status === 413 ? "Datei zu groß." : "Hochladen fehlgeschlagen.");
  }
  if (!res.ok || j.error) throw new Error(j.error || "Hochladen fehlgeschlagen.");
  return { blob: j.blob, width: j.width, height: j.height, preview: URL.createObjectURL(file) };
}

// Für die Server-Aktion: lokale Vorschau entfernen
export const forSave = (img) => (img ? (img.blob ? { blob: img.blob, width: img.width, height: img.height } : { src: img.src, width: img.width, height: img.height }) : null);
