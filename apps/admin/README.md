# ZQD Verwaltung (Dashboard)

Eigene Anmeldung (E-Mail + Passwort), unabhängig vom GitHub-Konto. Das Dashboard schreibt über einen
GitHub-Schlüssel, der nur auf dieses Repository zugreifen darf.

## Ablauf

1. Änderungen speichern → sie landen als Commit auf dem Branch `entwurf`. Die Live-Seite bleibt unverändert.
2. Vercel baut daraus automatisch eine Vorschau (ca. 2 Minuten). Oben im Dashboard erscheint „Vorschau ansehen“.
3. „Veröffentlichen“ übernimmt den Entwurf in `main` → Vercel aktualisiert die Live-Seite. Der Branch `entwurf` wird gelöscht.
4. „Verwerfen“ löscht den Entwurf (alle Änderungen seit der letzten Veröffentlichung).

## Einrichtung

### 1. GitHub-Schlüssel

github.com → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token

- Repository access: **Only select repositories** → `zqd`
- Permissions → Repository permissions:
  - **Contents: Read and write**
  - **Commit statuses: Read-only** (für den Stand der Vorschau)
- Ablaufdatum nach Wunsch (danach einen neuen Schlüssel erzeugen und bei Vercel ersetzen)

### 2. Vercel-Projekt

Vercel → Add New → Project → Repository `zqd` importieren

- Root Directory: `apps/admin`
- Environment Variables:

| Name | Wert |
| --- | --- |
| `ADMIN_EMAIL` | E-Mail-Adresse für die Anmeldung |
| `ADMIN_PASSWORD` | Passwort (als „Sensitive“ markieren) |
| `SESSION_SECRET` | beliebige lange Zufallszeichenfolge (mind. 32 Zeichen) |
| `GITHUB_TOKEN` | der Schlüssel aus Schritt 1 |
| `GITHUB_REPO` | `stephanlukasewitz/zqd` |
| `LIVE_URL_ZOOQUARIUMDESIGN` | optional, Adresse der Live-Seite (Standard: https://vercel.zqd-xyz.app) |
| `VERCEL_PROJECT_ZOOQUARIUMDESIGN` | optional, Name des Vercel-Projekts der Website (Standard: `zqd`) |

Statt `ADMIN_PASSWORD` kann auch nur ein Hash hinterlegt werden: `pnpm --filter admin passwort` → `ADMIN_PASSWORD_HASH`.

## Lokal entwickeln

`apps/admin/.env.local` mit `CONTENT_BACKEND=local` → Änderungen werden direkt in die Dateien im Repository geschrieben.

```bash
pnpm --filter admin dev
```
