import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { scryptSync, timingSafeEqual, createHmac } from "node:crypto";

// Sitzung: signiertes Cookie (HMAC-SHA256), 30 Tage gültig. Kein Konto bei GitHub nötig.
const COOKIE = "zqd_admin";
const MAX_AGE = 60 * 60 * 24 * 30;

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET fehlt oder ist zu kurz.");
  return s;
}

const sign = (data) => createHmac("sha256", secret()).update(data).digest("base64url");

export function checkCredentials(email, password) {
  const wantEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (!wantEmail) return false;
  const stored = process.env.ADMIN_PASSWORD_HASH || "";
  let pwOk = false;
  if (stored) {
    // Empfohlen: nur der Hash (pnpm --filter admin passwort)
    const [algo, salt, hash] = stored.split(":");
    if (algo !== "scrypt" || !salt || !hash) return false;
    const got = scryptSync(String(password || ""), salt, 64);
    const want = Buffer.from(hash, "hex");
    pwOk = want.length === got.length && timingSafeEqual(got, want);
  } else if (process.env.ADMIN_PASSWORD) {
    // Einfachere Variante: Passwort direkt als (geheime) Umgebungsvariable bei Vercel
    const a = createHmac("sha256", "pw").update(String(password || "")).digest();
    const b = createHmac("sha256", "pw").update(process.env.ADMIN_PASSWORD).digest();
    pwOk = timingSafeEqual(a, b);
  }
  return pwOk && String(email || "").trim().toLowerCase() === wantEmail;
}

export async function startSession() {
  const payload = Buffer.from(JSON.stringify({ u: process.env.ADMIN_EMAIL, exp: Date.now() + MAX_AGE * 1000 })).toString(
    "base64url",
  );
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function getSession() {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;
  const want = Buffer.from(sign(payload));
  const got = Buffer.from(sig);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

// Für Seiten: ohne Sitzung zum Login
export async function requireSession() {
  const s = await getSession();
  if (!s) redirect("/login");
  return s;
}

// Für Server-Aktionen und API-Routen: ohne Sitzung abbrechen
export async function assertSession() {
  const s = await getSession();
  if (!s) throw new Error("Nicht angemeldet.");
  return s;
}
