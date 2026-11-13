import LegalPage, { Note } from "@/components/legal/LegalPage";
import { site } from "@/content/site";

export const metadata = { title: "Datenschutz", robots: { index: false } };

export default function Datenschutz() {
  return (
    <LegalPage title="Datenschutzerklärung">
      <Note>Platzhalter – der Text muss vor Veröffentlichung rechtlich geprüft und vervollständigt werden.</Note>
      <h2>Verantwortliche Stelle</h2>
      <p>
        {site.legalName}, {site.street}, {site.zip} {site.city}, {site.email}
      </p>
      <h2>Hosting</h2>
      <p>[Angaben zum Hosting bei Vercel Inc. und zu Server-Logfiles]</p>
      <h2>Kontaktformular</h2>
      <p>
        [Angaben zur Verarbeitung der Formulardaten, Rechtsgrundlage, Speicherdauer und zum
        eingesetzten E-Mail-Dienst]
      </p>
      <h2>Schriftarten</h2>
      <p>Die verwendete Schrift wird lokal von unserem Server ausgeliefert; es werden keine Daten an Dritte übertragen.</p>
      <h2>Ihre Rechte</h2>
      <p>[Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Beschwerderecht]</p>
    </LegalPage>
  );
}
