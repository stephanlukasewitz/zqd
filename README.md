# ZQD – Website

Next.js-Website für ZQD Zooquariumdesign / Architekturgarage.

## Entwicklung

```bash
pnpm install
pnpm dev
```

## Struktur

- `src/app` – Seiten (Home, Projekte mit Overlay-Karte und eigener URL je Projekt, Team, Kontakt, Rechtliches)
- `src/components` – Header/Footer, Startseiten-Abschnitte, Galerie, Projektkarte, Formular
- `src/content/site.js` – Kontaktdaten und Navigation (**Platzhalter in eckigen Klammern ersetzen**)
- `src/content/team.js` – Teamangaben und Partner (**Platzhalter ersetzen**)
- `src/content/projects.generated.js`, `src/content/media.js` – automatisch erzeugt
- `src/assets` – web-optimierte Bilder (automatisch erzeugt)
- `public/Reference/` – Originalmaterial; wird nicht ausgeliefert (siehe `.vercelignore`)

## Bilder neu erzeugen

Auswahl und Texte stehen in `scripts/media-manifest.json`. Nach Änderungen:

```bash
python3 scripts/build-media.py
```

(benötigt Python mit Pillow)

## Kontaktformular

Versand über [Resend](https://resend.com). Auf Vercel als Umgebungsvariablen setzen:
`RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`. Ohne diese Werte meldet das Formular ehrlich, dass es noch nicht verbunden ist.
