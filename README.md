# ZQD – Website

Next.js-Website für ZQD Zooquariumdesign / Architekturgarage.

## Entwicklung

```bash
pnpm install
pnpm dev
```

## Struktur

- `src/app/[lang]` – Seiten (Home, Projekte mit eigener URL je Projekt, Team, Kontakt, Rechtliches) für alle Sprachen
- `src/components` – Header/Footer, Startseiten-Abschnitte, Galerie, Projektseite, Formular
- `src/content/site.js` – Kontaktdaten (**Platzhalter in eckigen Klammern ersetzen**)
- `src/content/team.js` – Teamangaben und Partner (**Platzhalter ersetzen**)
- `src/content/projects.generated.js`, `src/content/media.js` – automatisch erzeugt
- `src/assets` – web-optimierte Bilder (automatisch erzeugt)
- `public/Reference/` – Originalmaterial; wird nicht ausgeliefert (siehe `.vercelignore`)

## Sprachen

Deutsch (Standard, ohne Präfix), Englisch (`/en`) und Türkisch (`/tr`), mit übersetzten Adressen
(`/projekte` → `/en/projects` → `/tr/projeler`).

- `src/i18n/config.js` – Sprachen und Pfadnamen; `next.config.mjs` ordnet die Adressen per Rewrite zu
- `src/i18n/dict/{de,en,tr}.js` – alle Texte der Oberfläche und der Startseite
- `src/content/i18n/projects.{en,tr}.json` – Projekttexte; `projects.de.json` ist die deutsche Vorlage
- Interne Links immer mit deutschem Pfad schreiben (`<TLink href="/projekte">`) – sie werden automatisch übersetzt
- Impressum und Datenschutz sind nur auf Deutsch; in den anderen Sprachen steht ein Hinweis davor

## Bilder neu erzeugen

Auswahl und Texte stehen in `scripts/media-manifest.json`. Nach Änderungen:

```bash
python3 scripts/build-media.py
```

(benötigt Python mit Pillow)

## Kontaktformular

Versand über [Resend](https://resend.com). Auf Vercel als Umgebungsvariablen setzen:
`RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`. Ohne diese Werte meldet das Formular ehrlich, dass es noch nicht verbunden ist.
