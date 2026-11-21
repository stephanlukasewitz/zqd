import Link from "next/link";
import { getSite } from "@/lib/sites";
import { getProjects, readJSON } from "@/lib/content";

export default async function Overview({ params }) {
  const site = getSite((await params).site);
  const [projects, team] = await Promise.all([getProjects(site), readJSON(site, "team.json", { people: [], partners: [] })]);
  const untranslated = projects.filter((p) => !p.en?.text?.length || !p.tr?.text?.length).length;
  const cards = [
    ["/projekte", "Projekte", `${projects.length} Projekte${untranslated ? ` · ${untranslated} ohne vollständige Übersetzung` : ""}`],
    ["/startseite", "Startseite", "Startbild, Bildauswahl, Projektwolke"],
    ["/team", "Team & Partner", `${team.people.length} Personen · ${team.partners.length} Partner`],
    ["/texte", "Texte", "Alle Texte der Seite in Deutsch, Englisch und Türkisch"],
    ["/kontakt", "Kontaktdaten", "Adresse, Telefon, E-Mail, Karte"],
  ];
  return (
    <>
      <div className="head">
        <h1>
          Übersicht<span className="dot">.</span>
        </h1>
      </div>
      <div className="row">
        {cards.map(([p, t, d]) => (
          <Link key={p} href={`/${site.id}${p}`} className="card" style={{ textDecoration: "none" }}>
            <h2>{t}</h2>
            <p className="muted small" style={{ margin: "6px 0 0" }}>
              {d}
            </p>
          </Link>
        ))}
      </div>
      <div className="section card" style={{ background: "var(--soft)", border: 0 }}>
        <h3 style={{ marginBottom: 8 }}>So funktioniert es</h3>
        <ol className="muted" style={{ margin: 0, paddingLeft: 18 }}>
          <li>Speichere deine Änderungen – sie landen zuerst in einem Entwurf, die Live-Seite bleibt unverändert.</li>
          <li>Nach etwa 2 Minuten ist oben die Vorschau bereit. Dort kannst du dir alles in Ruhe ansehen.</li>
          <li>Mit „Veröffentlichen“ geht dein Entwurf live. „Verwerfen“ löscht alle Änderungen seit der letzten Veröffentlichung.</li>
        </ol>
      </div>
    </>
  );
}
