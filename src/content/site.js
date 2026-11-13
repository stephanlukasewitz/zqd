// Zentrale Inhalte und Kontaktdaten.
// Werte in eckigen Klammern sind Platzhalter und müssen vor dem Livegang ersetzt werden.

export const site = {
  name: "ZQD",
  legalName: "ZQD GmbH",
  brand: "Zooquariumdesign · Architekturgarage",
  description:
    "Architektur und Generalplanung für zoologische Einrichtungen – von der Masterplanung bis zur einzelnen Tieranlage.",
  url: "https://zqd.de",
  email: "[info@zqd.de]",
  phone: "[+49 000 000000]",
  street: "[Straße Hausnummer]",
  zip: "[PLZ]",
  city: "[Stadt]",
  country: "Deutschland",
  // Wird für den Routenlink genutzt, sobald die Adresse feststeht.
  mapsQuery: "",
  // Koordinaten für die Karte auf der Kontaktseite.
  // PLATZHALTER (Hamburg-Zentrum) – durch die echte Büroadresse ersetzen.
  geo: { lat: 53.5511, lng: 9.9937, placeholder: true },
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
