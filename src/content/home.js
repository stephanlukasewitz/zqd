// Inhalte der Startseite – gemeinsam genutzt von allen Entwürfen.
import { getProject } from "./projects";
import { homeMedia } from "./media";

export const claim = ["Erfahrung als Fundament.", "Entwicklung als Anspruch."];
export const subclaim = "Wir denken Lebensräume weiter.";
export const service = "Architektur und Generalplanung für zoologische Einrichtungen";

export const philosophy = {
  title: "Was unsere Planung prägt",
  text: "Gute Planung beginnt mit dem genauen Verständnis der Aufgabe, ihrer Anforderungen und ihres Umfelds. Wir verbinden Funktion und Gestaltung zu schlüssigen Lösungen, die im Alltag überzeugen und langfristig Bestand haben. Dabei hinterfragen wir Gewohntes, denken vorausschauend und lassen Raum für neue Entwicklungen.",
  words: ["Klarheit", "Verantwortung", "Weitblick"],
};

export const competence = {
  title: "Zoologische Lebensräume ganzheitlich planen.",
  text: "Von der Entwicklung eines gesamten Zoos und seiner Masterplanung bis zur Planung einzelner Tieranlagen, Gebäude und Aquarien: ZQD verbindet unterschiedliche Maßstäbe innerhalb einer umfassenden planerischen Kompetenz.",
};

export const general = {
  title: "Ein Projekt. Viele Disziplinen. Ein abgestimmtes Ganzes.",
  text: "Als Generalplaner übernehmen wir die Verantwortung für das gesamte Planungsteam. Wir führen Zoologie, Architektur und Fachplanungen zusammen, steuern die Schnittstellen und sind für unsere Auftraggeber der eine Ansprechpartner – mit klaren Zuständigkeiten von der ersten Idee bis zur Übergabe.",
  disciplines: [
    ["Zoologie", "Tierbedürfnisse, Haltungsrichtlinien, Vergesellschaftung und die Abläufe hinter den Kulissen."],
    ["Architektur", "Gebäude, Gehege, Besucherwege und Einblicke – vom Masterplan bis zum Detail."],
    ["Fachplanung", "Tragwerk, Gebäudetechnik und Wassertechnik – abgestimmt in einem Planungsteam."],
  ],
};

const pic = (slug, i = 0) => {
  const p = getProject(slug);
  const g = i === 0 ? p.cover : p.gallery[i - 1];
  return { slug, image: g.image, alt: g.alt, title: p.title, zoo: p.zoo, city: p.city, country: p.country, type: p.type };
};

export const phases = () => [
  {
    label: "Beratung & Konzeption",
    text: "Projektziele, Machbarkeit, Bedarf und erste Konzeptansätze.",
    details: ["Bedarfs- und Bestandsanalyse", "Machbarkeitsstudien", "Masterplanung", "Konzept- und Wettbewerbsentwürfe"],
    ...pic("eisbaergehege-schoenbrunn"),
  },
  {
    label: "Entwurf & Planung",
    text: "HOAI LPH 1–5 von den Grundlagen bis zur Ausführungsplanung.",
    details: ["LPH 1 Grundlagenermittlung", "LPH 2 Vorplanung", "LPH 3 Entwurfsplanung", "LPH 4 Genehmigungsplanung", "LPH 5 Ausführungsplanung"],
    ...pic("elefantenwelt-wilhelma", 1),
  },
  {
    label: "Umsetzung & Betreuung",
    text: "HOAI LPH 6–9 von Ausschreibung und Vergabe bis zur Objektbetreuung.",
    details: ["LPH 6 Vorbereitung der Vergabe", "LPH 7 Mitwirkung bei der Vergabe", "LPH 8 Objektüberwachung", "LPH 9 Objektbetreuung"],
    ...pic("biodome-budapest"),
  },
];

export const scales = () => [
  {
    scale: "M 1:5000",
    word: "Masterplan",
    line: "Ganze Zoos weiterentwickeln – Schritt für Schritt und im laufenden Betrieb.",
    ...pic("inselzoo-altenburg"),
  },
  {
    scale: "M 1:500",
    word: "Anlage",
    line: "Häuser und Gehege, die Tieren Raum geben und Besuchern Nähe.",
    ...pic("orang-utan-dome-hagenbeck"),
  },
  {
    scale: "M 1:50",
    word: "Einblick",
    line: "Wo Mensch und Tier sich begegnen – geplant bis zur Scheibe.",
    ...pic("eismeer-hagenbeck"),
  },
  {
    scale: "M 1:1",
    word: "Lebensraum",
    line: "Und mittendrin: Wasser, Licht und Leben.",
    slug: homeMedia.hero[1].slug,
    image: homeMedia.hero[1].image,
    alt: homeMedia.hero[1].alt,
    title: "Tropen-Aquarium",
    zoo: "Tierpark Hagenbeck",
  },
];

export const featured = () =>
  [
    "eismeer-hagenbeck",
    "tropen-aquarium-hagenbeck",
    "polarium-rostock",
    "orang-utan-dome-hagenbeck",
    "artenschutz-aquarium-schoenbrunn",
    "haus-der-giganten-verona",
    "elefantenfreilaufhalle-hagenbeck",
    "dickhaeuterhaus-tierpark-berlin",
    "masterplan-2030-koeln",
  ].map((s) => pic(s));

export const heroImages = () => homeMedia.hero.map((h) => ({ ...h }));
export { pic };
