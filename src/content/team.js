import { partnerLogos, teamPhotos } from "./media";

// Teamdaten. Angaben in eckigen Klammern sind Platzhalter und vor Veröffentlichung
// durch freigegebene, verifizierte Angaben zu ersetzen (T03).
const people = {
  "1dsc-9540-ca": {
    name: "Sezai I. Candan",
    role: "Architekt, Managing Partner",
    degree: "Dipl.-Ing. Architekt",
    focus: "[Aufgabenbereich]",
    experience: "[Berufserfahrung]",
    email: "",
  },
  christof2: { name: "Christof [Nachname]", role: "[Funktion]" },
  "irem-foto-raf": { name: "İrem [Nachname]", role: "[Funktion]" },
  "sena-foto-raf": { name: "Sena [Nachname]", role: "[Funktion]" },
  "tu-e-foto-raf": { name: "Tuğçe [Nachname]", role: "[Funktion]" },
};

export const team = teamPhotos.map((t) => ({
  degree: "[Abschluss / Qualifikation]",
  focus: "[Aufgabenbereich]",
  experience: "[Berufserfahrung]",
  email: "",
  ...people[t.file],
  image: t.image,
}));

// Fachgebiete und Links bitte ergänzen bzw. freigeben lassen (T04).
const partnerInfo = {
  "vdz-logo-name-cmyk": { field: "Verband", url: "" },
  "logo-pinck": { field: "[Fachgebiet]", url: "" },
  "logo-wetzel-von-seht": { field: "[Fachgebiet]", url: "" },
  "logo-isc-arc": { field: "Architektur", url: "" },
  "logo-team-leisure": { field: "[Fachgebiet]", url: "" },
  "global-supplies": { field: "[Fachgebiet]", url: "" },
};

const partnerNames = {
  "vdz-logo-name-cmyk": "Verband der Zoologischen Gärten",
  "logo-pinck": "Pinck Ingenieur Consulting",
  "logo-wetzel-von-seht": "Wetzel & von Seht",
  "logo-isc-arc": "isc.arc",
  "logo-team-leisure": "Team Leisure",
  "global-supplies": "Global Supplies",
};

export const partners = partnerLogos.map((p) => ({
  name: partnerNames[p.file] || p.name,
  ...partnerInfo[p.file],
  image: p.image,
}));
