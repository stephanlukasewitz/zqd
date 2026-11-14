import LegalPage from "@/components/legal/LegalPage";
import { site } from "@/content/site";

export const metadata = { title: "Datenschutz", robots: { index: false } };

export default function Datenschutz() {
  return (
    <LegalPage title="Datenschutzerklärung">
      <h2>Verantwortliche Stelle</h2>
      <p>
        Verantwortliche Stelle im Sinne der Datenschutzgesetze, insbesondere der
        EU-Datenschutzgrundverordnung (DSGVO), ist:
      </p>
      <p>
        {site.legalName}
        <br />
        {site.street}
        <br />
        {site.zip} {site.city}
        <br />
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>

      <h2>Ihre Betroffenenrechte</h2>
      <p>Unter den angegebenen Kontaktdaten können Sie jederzeit folgende Rechte ausüben:</p>
      <ul>
        <li>Auskunft über Ihre bei uns gespeicherten Daten und deren Verarbeitung,</li>
        <li>Berichtigung unrichtiger personenbezogener Daten,</li>
        <li>Löschung Ihrer bei uns gespeicherten Daten,</li>
        <li>
          Einschränkung der Datenverarbeitung, sofern wir Ihre Daten aufgrund gesetzlicher Pflichten
          noch nicht löschen dürfen,
        </li>
        <li>Widerspruch gegen die Verarbeitung Ihrer Daten bei uns und</li>
        <li>
          Datenübertragbarkeit, sofern Sie in die Datenverarbeitung eingewilligt haben oder einen
          Vertrag mit uns abgeschlossen haben.
        </li>
      </ul>
      <p>
        Sofern Sie uns eine Einwilligung erteilt haben, können Sie diese jederzeit mit Wirkung für
        die Zukunft widerrufen.
      </p>
      <p>
        Sie können sich jederzeit mit einer Beschwerde an die für Sie zuständige Aufsichtsbehörde
        wenden. Ihre zuständige Aufsichtsbehörde richtet sich nach dem Bundesland Ihres Wohnsitzes,
        Ihrer Arbeit oder der mutmaßlichen Verletzung. Eine Liste der Aufsichtsbehörden (für den
        nichtöffentlichen Bereich) mit Anschrift finden Sie unter:{" "}
        <a
          href="https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          bfdi.bund.de
        </a>
        .
      </p>

      <h2>Zwecke der Datenverarbeitung durch die verantwortliche Stelle und Dritte</h2>
      <p>
        Wir verarbeiten Ihre personenbezogenen Daten nur zu den in dieser Datenschutzerklärung
        genannten Zwecken. Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den
        genannten Zwecken findet nicht statt. Wir geben Ihre persönlichen Daten nur an Dritte
        weiter, wenn:
      </p>
      <ul>
        <li>Sie Ihre ausdrückliche Einwilligung dazu erteilt haben,</li>
        <li>die Verarbeitung zur Abwicklung eines Vertrags mit Ihnen erforderlich ist,</li>
        <li>die Verarbeitung zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist,</li>
        <li>
          die Verarbeitung zur Wahrung berechtigter Interessen erforderlich ist und kein Grund zur
          Annahme besteht, dass Sie ein überwiegendes schutzwürdiges Interesse an der Nichtweitergabe
          Ihrer Daten haben.
        </li>
      </ul>

      <h2>Hosting</h2>
      <p>
        Diese Website wird bei der Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA
        gehostet. Beim Aufruf der Website verarbeitet Vercel technisch notwendige Daten wie
        IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite und Browserinformationen, um
        die Website auszuliefern und ihre Sicherheit zu gewährleisten. Rechtsgrundlage ist Art. 6
        Abs. 1 lit. f DSGVO.
      </p>

      <h2>Kontaktformular</h2>
      <p>
        Wenn Sie uns über das Kontaktformular eine Anfrage senden, verarbeiten wir Ihre Angaben aus
        dem Formular, um Ihre Anfrage zu bearbeiten. Die Nachricht wird über den E-Mail-Dienst
        Resend (Plus Five Five, Inc., USA) an uns zugestellt. Rechtsgrundlage ist Art. 6 Abs. 1
        lit. b bzw. lit. f DSGVO. Die Daten werden gelöscht, sobald sie für die Bearbeitung nicht
        mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
      </p>

      <h2>Cookies und lokale Speicherung</h2>
      <p>
        Diese Website setzt keine Cookies und verwendet keine Analyse- oder Trackingdienste. Damit
        Filter und Scrollposition auf der Projektseite beim Zurückgehen erhalten bleiben, wird diese
        Einstellung für die Dauer Ihres Besuchs im Sitzungsspeicher Ihres Browsers abgelegt; sie
        wird beim Schließen des Tabs gelöscht und nicht an uns übertragen.
      </p>

      <h2>Schriftarten</h2>
      <p>
        Die verwendete Schrift wird von unserem eigenen Server ausgeliefert. Beim Aufruf der Website
        wird keine Verbindung zu Google oder anderen Schriftanbietern hergestellt.
      </p>

      <h2>Karte</h2>
      <p>
        Die Karte auf der Kontaktseite basiert auf OpenStreetMap. Die Kartenkacheln werden über
        unseren eigenen Server ausgeliefert; dabei werden keine Daten Ihres Browsers an
        OpenStreetMap übermittelt.
      </p>

      <h2>Änderung unserer Datenschutzbestimmungen</h2>
      <p>
        Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen
        rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der
        Datenschutzerklärung umzusetzen, z.&nbsp;B. bei der Einführung neuer Services. Für Ihren
        erneuten Besuch gilt dann die neue Datenschutzerklärung.
      </p>

      <h2>Fragen zum Datenschutz</h2>
      <p>
        Wenn Sie Fragen zum Datenschutz haben, schreiben Sie uns bitte eine E-Mail an{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> oder wenden Sie sich direkt an die für den
        Datenschutz verantwortliche Person in unserer Organisation.
      </p>
      <p>
        Die Datenschutzerklärung wurde mit dem{" "}
        <a
          href="https://www.activemind.de/datenschutz/datenschutzhinweis-generator/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Datenschutzerklärungs-Generator der activeMind AG
        </a>{" "}
        erstellt.
      </p>
    </LegalPage>
  );
}
