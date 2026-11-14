// Deutsch – Standardsprache. Alle anderen Sprachen haben dieselbe Struktur.

const de = {
  meta: {
    title: "ZQD – Architektur und Generalplanung für Zoos und Aquarien",
    description:
      "Architektur und Generalplanung für zoologische Einrichtungen – von der Masterplanung bis zur einzelnen Tieranlage.",
    projects: {
      title: "Projekte",
      description:
        "Ausgewählte Projekte von ZQD: Masterplanungen, Tieranlagen und Aquarien für zoologische Einrichtungen.",
    },
    team: { title: "Team", description: "Das Team hinter ZQD – Menschen, Expertise und Partnernetzwerk." },
    contact: { title: "Kontakt", description: "Sprechen wir über Ihr Projekt – Anfrage, Kontaktdaten und Anfahrt." },
    imprint: { title: "Impressum" },
    privacy: { title: "Datenschutz", heading: "Datenschutzerklärung" },
  },

  nav: { "/": "Home", "/projekte": "Projekte", "/team": "Team", "/kontakt": "Kontakt" },
  legalNav: { "/impressum": "Impressum", "/datenschutz": "Datenschutz" },

  // Werte aus den Projektdaten (intern deutsch) → Anzeige
  values: {
    types: { Masterplanung: "Masterplanung", Tieranlage: "Tieranlage", Aquarium: "Aquarium", Gebäude: "Gebäude" },
    services: {
      Beratung: "Beratung",
      Konzept: "Konzept",
      Architektur: "Architektur",
      Generalplanung: "Generalplanung",
      Wettbewerb: "Wettbewerb",
      "Pro Bono": "Pro Bono",
    },
    countries: {},
  },

  // Texte für Client-Komponenten
  ui: {
    skip: "Zum Inhalt springen",
    home: "ZQD – zur Startseite",
    menu: "Menü",
    close: "Schließen",
    menuLabel: "Menü",
    language: "Sprache",
    navNote: {
      "/": "Startseite",
      "/projekte": "Referenzen und Index",
      "/team": "Menschen und Partner",
      "/kontakt": "Anfrage und Anfahrt",
    },
    footer: { contact: "Kontakt", office: "Büro", route: "Anfahrt", index: "Index", nav: "Footer-Navigation" },
    hero: { label: "Einstieg", tank: "Tiefseebecken", hint: "Bewegen Sie das Wasser" },
    gallery: {
      label: "Projektgalerie",
      search: "Projekte durchsuchen",
      placeholder: "Projekt, Zoo oder Ort suchen …",
      typeGroup: "Projektart",
      all: "Alle",
      service: "Leistung",
      location: "Standort",
      one: "1 Projekt",
      many: "{n} Projekte",
      reset: "Zurücksetzen",
      view: "Ansicht",
      grid: "Raster",
      list: "Index",
      empty: "Keine Projekte für diese Auswahl.",
      emptyReset: "Filter zurücksetzen",
      more: "Weitere Projekte anzeigen",
      moreOf: "{a} von {b}",
    },
    index: { no: "Nr.", project: "Projekt", client: "Auftraggeber", place: "Ort", task: "Aufgabe" },
    lightbox: {
      images: "Bilder",
      close: "Schließen",
      prev: "Vorheriges Bild",
      next: "Nächstes Bild",
      enlarge: "Bild vergrößern",
    },
    back: "Alle Projekte",
    backLabel: "Zurück",
    image: "Bild",
    form: {
      name: "Name",
      org: "Einrichtung / Unternehmen",
      email: "E-Mail",
      phone: "Telefon",
      country: "Land",
      type: "Projektart",
      types: { Masterplanung: "Masterplanung", Tieranlage: "Tieranlage", Aquarium: "Aquarium", Sonstiges: "Sonstiges" },
      message: "Nachricht",
      consentA: "Ich habe die",
      consentLink: "Datenschutzhinweise",
      consentB: "gelesen und bin mit der Verarbeitung meiner Angaben zur Bearbeitung der Anfrage einverstanden.",
      required: "* Pflichtfeld",
      send: "Anfrage senden",
      sending: "Wird gesendet …",
      thanks: "Vielen Dank.",
      thanksText: "Ihre Anfrage wurde erfolgreich übermittelt. Wir melden uns bei Ihnen.",
    },
  },

  home: {
    claim: ["Erfahrung als Fundament.", "Entwicklung als Anspruch."],
    subclaim: "Wir denken Lebensräume weiter.",
    service: "Architektur und Generalplanung für zoologische Einrichtungen",
    philosophy: {
      title: "Was unsere Planung prägt",
      lead: "Gute Planung beginnt mit dem genauen Verständnis der Aufgabe, ihrer Anforderungen und ihres Umfelds.",
      body: "Wir verbinden Funktion und Gestaltung zu schlüssigen Lösungen, die im Alltag überzeugen und langfristig Bestand haben. Dabei hinterfragen wir Gewohntes, denken vorausschauend und lassen Raum für neue Entwicklungen.",
      words: ["Klarheit", "Verantwortung", "Weitblick"],
    },
    principles: {
      title: "Wofür wir planen.",
      items: [
        [
          "Das Wohlbefinden der Tiere hat Priorität.",
          "Grundlage sind neueste Erkenntnisse, Erfahrungen und Beobachtungen aus ihrem natürlichen Lebensraum.",
        ],
        [
          "Besucher erleben Tiere nah und unverstellt.",
          "Einblicke, die Verständnis wecken und Respekt vor dem Lebensraum der Tiere vermitteln.",
        ],
        [
          "Pflege und Betrieb sind Teil des Entwurfs.",
          "Wege, Abläufe und Technik hinter den Kulissen planen wir so sorgfältig wie das, was man sieht.",
        ],
        [
          "Anlagen bleiben entwicklungsfähig.",
          "Robust im Betrieb, wirtschaftlich im Unterhalt und offen für das, was Zoos morgen brauchen.",
        ],
      ],
    },
    insights: "Einblicke",
    competence: {
      title: "Zoologische Lebensräume ganzheitlich planen.",
      text: "Von der Entwicklung eines gesamten Zoos und seiner Masterplanung bis zur Planung einzelner Tieranlagen, Gebäude und Aquarien: ZQD verbindet unterschiedliche Maßstäbe innerhalb einer umfassenden planerischen Kompetenz.",
    },
    fields: {
      Masterplanung: ["Masterplanung", "Ganze Zoos weiterentwickeln – Schritt für Schritt und im laufenden Betrieb."],
      Tieranlage: ["Tieranlagen", "Häuser und Gehege, die Tieren Raum geben und Besuchern Nähe."],
      Aquarium: ["Aquarien", "Unterwasserwelten mit Einblicken, die Mensch und Tier zusammenbringen."],
    },
    count: "{n} Projekte",
    viewProject: "Projekt ansehen",
    phasesTitle: "Von der Idee bis zur Realisierung.",
    phasesIntro:
      "Wir begleiten Projekte durch alle Leistungsphasen der HOAI – vollständig oder genau in den Phasen, in denen Sie uns brauchen.",
    phases: [
      {
        label: "Beratung & Konzeption",
        text: "Projektziele, Machbarkeit, Bedarf und erste Konzeptansätze.",
        details: ["Bedarfs- und Bestandsanalyse", "Machbarkeitsstudien", "Masterplanung", "Konzept- und Wettbewerbsentwürfe"],
      },
      {
        label: "Entwurf & Planung",
        text: "HOAI LPH 1–5 von den Grundlagen bis zur Ausführungsplanung.",
        details: ["LPH 1 Grundlagenermittlung", "LPH 2 Vorplanung", "LPH 3 Entwurfsplanung", "LPH 4 Genehmigungsplanung", "LPH 5 Ausführungsplanung"],
      },
      {
        label: "Umsetzung & Betreuung",
        text: "HOAI LPH 6–9 von Ausschreibung und Vergabe bis zur Objektbetreuung.",
        details: ["LPH 6 Vorbereitung der Vergabe", "LPH 7 Mitwirkung bei der Vergabe", "LPH 8 Objektüberwachung", "LPH 9 Objektbetreuung"],
      },
    ],
    general: {
      title: "Ein Projekt. Viele Disziplinen. Ein abgestimmtes Ganzes.",
      text: "Als Generalplaner übernehmen wir die Verantwortung für das gesamte Planungsteam. Wir führen Zoologie, Architektur und Fachplanungen zusammen, steuern die Schnittstellen und sind für unsere Auftraggeber der eine Ansprechpartner – mit klaren Zuständigkeiten von der ersten Idee bis zur Übergabe.",
      disciplines: [
        ["Zoologie", "Tierbedürfnisse, Haltungsrichtlinien, Vergesellschaftung und die Abläufe hinter den Kulissen."],
        ["Architektur", "Gebäude, Gehege, Besucherwege und Einblicke – vom Masterplan bis zum Detail."],
        ["Fachplanung", "Tragwerk, Gebäudetechnik und Wassertechnik – abgestimmt in einem Planungsteam."],
      ],
      teamLink: "Das Team kennenlernen",
    },
    selected: "Ausgewählte Projekte",
    allProjects: "Alle {n} Projekte",
  },

  projects: {
    title: "Unsere Projekte",
    sub: "Ausgewählte Aufgaben, Ansätze und Ergebnisse.",
    facts: {
      label: "Projektdaten",
      client: "Auftraggeber",
      location: "Standort",
      task: "Aufgabe",
      year: "Jahr",
      services: "Leistungen",
    },
    pending: "Projektbeschreibung folgt.",
    next: "Nächstes Projekt",
  },

  team: {
    title: ["Erfahrung verbindet.", "Neue Perspektiven bewegen."],
    sub: "Das Team hinter ZQD.",
    cultureTitle: "Zusammenarbeit im Büro",
    culture:
      "Bei ZQD arbeiten unterschiedliche fachliche Perspektiven eng zusammen. Klare Abstimmung, fachlicher Austausch und gemeinsame Verantwortung prägen unsere tägliche Planung.",
    people: "Mitarbeitende",
    portrait: "Porträt {name}",
    qualification: "Qualifikation",
    focus: "Aufgaben",
    experience: "Erfahrung",
    email: "E-Mail",
    partnersTitle: "Kompetenz im Netzwerk",
    partners: "Für komplexe Aufgaben arbeiten wir mit spezialisierten Partnern zusammen.",
    logo: "Logo {name}",
    external: "{name} (öffnet externe Website)",
    roles: { "Architekt, Managing Partner": "Architekt, Managing Partner" },
    fields: { Verband: "Verband", Architektur: "Architektur" },
  },

  contact: {
    title: "Sprechen wir über Ihr Projekt.",
    sub: "Ob Masterplanung, neue Tieranlage oder Modernisierung – wir freuen uns auf Ihre Anfrage.",
    inquiry: "Anfrage",
    direct: "Direkter Kontakt",
    email: "E-Mail",
    phone: "Telefon",
    officeTitle: "Büro & Anfahrt",
    route: "Route planen",
    routeNote: "(öffnet Google Maps)",
  },

  legal: { note: null },

  notFound: {
    title: "Diese Seite gibt es nicht.",
    text: "Vielleicht wurde sie verschoben oder die Adresse ist nicht ganz richtig.",
    home: "Zur Startseite",
  },

  // Formularprüfung (Server)
  formErrors: {
    name: "Bitte geben Sie Ihren Namen an.",
    org: "Bitte geben Sie Ihre Einrichtung oder Ihr Unternehmen an.",
    email: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
    message: "Bitte beschreiben Sie kurz Ihr Anliegen.",
    consent: "Bitte bestätigen Sie die Datenschutzhinweise.",
    notConfigured:
      "Das Formular ist noch nicht mit einem Postfach verbunden. Bitte schreiben Sie uns direkt per E-Mail.",
    failed:
      "Ihre Anfrage konnte gerade nicht übermittelt werden. Bitte versuchen Sie es erneut oder schreiben Sie uns per E-Mail.",
  },
};

export default de;
