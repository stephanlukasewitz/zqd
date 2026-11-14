"use server";

// Versand über die Resend-API (https://resend.com). Benötigte Umgebungsvariablen auf Vercel:
//   RESEND_API_KEY     – API-Schlüssel
//   CONTACT_TO         – Empfängeradresse, z. B. info@zqd-gmbh.com
//   CONTACT_FROM       – verifizierte Absenderadresse, z. B. "ZQD Website <web@zqd.de>"
// Erfolg wird nur gemeldet, wenn der Dienst den Versand bestätigt (C03).

import { dictFor } from "@/i18n/dict";

const TYPES = ["Masterplanung", "Tieranlage", "Aquarium", "Sonstiges"];

function clean(v, max = 2000) {
  return String(v ?? "")
    .trim()
    .slice(0, max);
}

export async function sendInquiry(_prev, formData) {
  // Honeypot gegen Spam-Bots
  if (clean(formData.get("website"))) return { ok: true };
  const lang = clean(formData.get("lang"), 5);
  const m = dictFor(lang).formErrors;

  const data = {
    name: clean(formData.get("name"), 200),
    org: clean(formData.get("org"), 200),
    email: clean(formData.get("email"), 200),
    phone: clean(formData.get("phone"), 60),
    country: clean(formData.get("country"), 100),
    type: clean(formData.get("type"), 40),
    message: clean(formData.get("message"), 5000),
    consent: formData.get("consent") === "on",
  };

  const errors = {};
  if (!data.name) errors.name = m.name;
  if (!data.org) errors.org = m.org;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = m.email;
  if (!data.message) errors.message = m.message;
  if (data.type && !TYPES.includes(data.type)) data.type = "";
  if (!data.consent) errors.consent = m.consent;

  if (Object.keys(errors).length) {
    return { ok: false, errors, values: { ...data, consent: undefined } };
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  if (!key || !to || !from) {
    return {
      ok: false,
      error: m.notConfigured,
      values: data,
    };
  }

  const text = [
    `Name: ${data.name}`,
    `Einrichtung/Unternehmen: ${data.org}`,
    `E-Mail: ${data.email}`,
    data.phone && `Telefon: ${data.phone}`,
    data.country && `Land: ${data.country}`,
    data.type && `Projektart: ${data.type}`,
    lang && lang !== "de" && `Sprache: ${lang.toUpperCase()}`,
    "",
    data.message,
  ]
    .filter((l) => l !== false && l !== "")
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `Projektanfrage: ${data.org}`,
        text,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: m.failed,
      values: data,
    };
  }
}
