import LegalPage, { Note } from "@/components/legal/LegalPage";
import { site } from "@/content/site";

export const metadata = { title: "Impressum", robots: { index: false } };

export default function Impressum() {
  return (
    <LegalPage title="Impressum">
      <Note>Platzhalter – der Text muss vor Veröffentlichung rechtlich geprüft und vervollständigt werden.</Note>
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        {site.legalName}
        <br />
        {site.street}
        <br />
        {site.zip} {site.city}
      </p>
      <h2>Vertreten durch</h2>
      <p>[Geschäftsführung]</p>
      <h2>Kontakt</h2>
      <p>
        Telefon: {site.phone}
        <br />
        E-Mail: {site.email}
      </p>
      <h2>Registereintrag</h2>
      <p>[Registergericht, Registernummer]</p>
      <h2>Umsatzsteuer-ID</h2>
      <p>[USt-IdNr.]</p>
      <h2>Bildnachweise</h2>
      <p>[Fotografen / Rechteinhaber der Projektbilder]</p>
    </LegalPage>
  );
}
