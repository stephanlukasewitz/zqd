import LegalPage from "@/components/legal/LegalPage";
import { site } from "@/content/site";

export const metadata = { title: "Impressum" };

export default function Impressum() {
  const tel = site.phone.replace(/[^\d+]/g, "");
  return (
    <LegalPage title="Impressum">
      <p>
        {site.legalName}
        <br />
        {site.street}
        <br />
        {site.zip} {site.city}
        <br />
        {site.country}
      </p>
      <p>
        Telefon: <a href={`tel:${tel}`}>{site.phone}</a>
        <br />
        E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
      <p>
        Managing Partner: Architekt Sezai I. Candan
        <br />
        Amtsgericht Hamburg HRB 121366
        <br />
        Verantwortlich für den Inhalt der Seite: Architekt Sezai I. Candan
      </p>

      <h2>Haftungsausschluss (Disclaimer)</h2>

      <h3>1. Inhalt des Onlineangebotes</h3>
      <p>
        Der Autor übernimmt keinerlei Gewähr für die Aktualität, Korrektheit, Vollständigkeit
        oder Qualität der bereitgestellten Informationen. Haftungsansprüche gegen den Autor,
        welche sich auf Schäden materieller oder ideeller Art beziehen, die durch die Nutzung
        oder Nichtnutzung der dargebotenen Informationen bzw. durch die Nutzung fehlerhafter und
        unvollständiger Informationen verursacht wurden, sind grundsätzlich ausgeschlossen,
        sofern seitens des Autors kein nachweislich vorsätzliches oder grob fahrlässiges
        Verschulden vorliegt.
      </p>
      <p>
        Alle Angebote sind freibleibend und unverbindlich. Der Autor behält es sich ausdrücklich
        vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern,
        zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.
      </p>

      <h3>2. Verweise und Links</h3>
      <p>
        Bei direkten oder indirekten Verweisen auf fremde Internetseiten („Links“), die außerhalb
        des Verantwortungsbereiches des Autors liegen, würde eine Haftungsverpflichtung
        ausschließlich in dem Fall in Kraft treten, in dem der Autor von den Inhalten Kenntnis
        hat und es ihm technisch möglich und zumutbar wäre, die Nutzung im Falle rechtswidriger
        Inhalte zu verhindern.
      </p>
      <p>
        Der Autor erklärt hiermit ausdrücklich, dass zum Zeitpunkt der Linksetzung keine
        illegalen Inhalte auf den zu verlinkenden Seiten erkennbar waren. Auf die aktuelle und
        zukünftige Gestaltung, die Inhalte oder die Urheberschaft der gelinkten/verknüpften
        Seiten hat der Autor keinerlei Einfluss. Deshalb distanziert er sich hiermit ausdrücklich
        von allen Inhalten aller gelinkten/verknüpften Seiten, die nach der Linksetzung verändert
        wurden. Diese Feststellung gilt für alle innerhalb des eigenen Internetangebotes
        gesetzten Links und Verweise sowie für Fremdeinträge in vom Autor eingerichteten
        Gästebüchern, Diskussionsforen und Mailinglisten. Für illegale, fehlerhafte oder
        unvollständige Inhalte und insbesondere für Schäden, die aus der Nutzung oder
        Nichtnutzung solcherart dargebotener Informationen entstehen, haftet allein der Anbieter
        der Seite, auf welche verwiesen wurde, nicht derjenige, der über Links auf die jeweilige
        Veröffentlichung lediglich verweist.
      </p>

      <h3>3. Urheber- und Kennzeichenrecht</h3>
      <p>
        Der Autor ist bestrebt, in allen Publikationen die Urheberrechte der verwendeten
        Grafiken, Tondokumente, Videosequenzen und Texte zu beachten, von ihm selbst erstellte
        Grafiken, Tondokumente, Videosequenzen und Texte zu nutzen oder auf lizenzfreie Grafiken,
        Tondokumente, Videosequenzen und Texte zurückzugreifen.
      </p>
      <p>
        Alle innerhalb des Internetangebotes genannten und ggf. durch Dritte geschützten Marken-
        und Warenzeichen unterliegen uneingeschränkt den Bestimmungen des jeweils gültigen
        Kennzeichenrechts und den Besitzrechten der jeweiligen eingetragenen Eigentümer. Allein
        aufgrund der bloßen Nennung ist nicht der Schluss zu ziehen, dass Markenzeichen nicht
        durch Rechte Dritter geschützt sind!
      </p>
      <p>
        Das Copyright für veröffentlichte, vom Autor selbst erstellte Objekte bleibt allein beim
        Autor der Seiten. Eine Vervielfältigung oder Verwendung solcher Grafiken, Tondokumente,
        Videosequenzen und Texte in anderen elektronischen oder gedruckten Publikationen ist ohne
        ausdrückliche Zustimmung des Autors nicht gestattet.
      </p>

      <h3>4. Datenschutz</h3>
      <p>
        Sofern innerhalb des Internetangebotes die Möglichkeit zur Eingabe persönlicher oder
        geschäftlicher Daten (E-Mail-Adressen, Namen, Anschriften) besteht, so erfolgt die
        Preisgabe dieser Daten seitens des Nutzers auf ausdrücklich freiwilliger Basis. Die
        Inanspruchnahme und Bezahlung aller angebotenen Dienste ist – soweit technisch möglich
        und zumutbar – auch ohne Angabe solcher Daten bzw. unter Angabe anonymisierter Daten oder
        eines Pseudonyms gestattet.
      </p>

      <h3>5. Rechtswirksamkeit dieses Haftungsausschlusses</h3>
      <p>
        Dieser Haftungsausschluss ist als Teil des Internetangebotes zu betrachten, von dem aus
        auf diese Seite verwiesen wurde. Sofern Teile oder einzelne Formulierungen dieses Textes
        der geltenden Rechtslage nicht, nicht mehr oder nicht vollständig entsprechen sollten,
        bleiben die übrigen Teile des Dokumentes in ihrem Inhalt und ihrer Gültigkeit davon
        unberührt.
      </p>
      <p>
        Quelle:{" "}
        <a href="https://www.disclaimer.de" target="_blank" rel="noopener noreferrer">
          www.disclaimer.de
        </a>
      </p>
    </LegalPage>
  );
}
