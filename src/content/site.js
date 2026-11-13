// Zentrale Inhalte und Kontaktdaten.
// Werte in eckigen Klammern sind Platzhalter und müssen vor dem Livegang ersetzt werden.

export const site = {
  name: "ZQD",
  legalName: "ZQD GmbH",
  brand: "Zooquariumdesign · Architekturgarage",
  description:
    "Architektur und Generalplanung für zoologische Einrichtungen – von der Masterplanung bis zur einzelnen Tieranlage.",
  url: "https://zqd-gmbh.com",
  email: "info@zqd-gmbh.com",
  phone: "+49 40 81 95 13 86",
  street: "Große Elbstraße 131",
  zip: "22767",
  city: "Hamburg",
  country: "Deutschland",
  // Wird für den Routenlink genutzt, sobald die Adresse feststeht.
  mapsQuery: "ZQD GmbH, Große Elbstraße 131, 22767 Hamburg",
  // Koordinaten für die Karte (Näherung für Große Elbstraße 131 – bitte prüfen).
  geo: { lat: 53.5451, lng: 9.9332 },
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/projekte", label: "Projekte" },
  { href: "/team", label: "Team" },
  { href: "/kontakt", label: "Kontakt" },
];

export const legalNav = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
];
