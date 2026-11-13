"use server";

// Versand über die Resend-API (https://resend.com). Benötigte Umgebungsvariablen auf Vercel:
//   RESEND_API_KEY     – API-Schlüssel
//   CONTACT_TO         – Empfängeradresse, z. B. info@zqd-gmbh.com
//   CONTACT_FROM       – verifizierte Absenderadresse, z. B. "ZQD Website <web@zqd.de>"
// Erfolg wird nur gemeldet, wenn der Dienst den Versand bestätigt (C03).

const TYPES = ["Masterplanung", "Tieranlage", "Aquarium", "Sonstiges"];

function clean(v, max = 2000) {
  return String(v ?? "")
    .trim()
    .slice(0, max);
}

export async function sendInquiry(_prev, formData) {
  // Honeypot gegen Spam-Bots
  if (clean(formData.get("website"))) return { ok: true };

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
  if (!data.name) errors.name = "Bitte geben Sie Ihren Namen an.";
  if (!data.org) errors.org = "Bitte geben Sie Ihre Einrichtung oder Ihr Unternehmen an.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
  if (!data.message) errors.message = "Bitte beschreiben Sie kurz Ihr Anliegen.";
  if (data.type && !TYPES.includes(data.type)) data.type = "";
  if (!data.consent) errors.consent = "Bitte bestätigen Sie die Datenschutzhinweise.";

  if (Object.keys(errors).length) {
    return { ok: false, errors, values: { ...data, consent: undefined } };
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  if (!key || !to || !from) {
    return {
      ok: false,
      error:
        "Das Formular ist noch nicht mit einem Postfach verbunden. Bitte schreiben Sie uns direkt per E-Mail.",
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
      error:
        "Ihre Anfrage konnte gerade nicht übermittelt werden. Bitte versuchen Sie es erneut oder schreiben Sie uns per E-Mail.",
      values: data,
    };
  }
}
