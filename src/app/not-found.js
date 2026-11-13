import Link from "next/link";
import LegalPage from "@/components/legal/LegalPage";

export default function NotFound() {
  return (
    <LegalPage title="Diese Seite gibt es nicht.">
      <p>Vielleicht wurde sie verschoben oder die Adresse ist nicht ganz richtig.</p>
      <p>
        <Link href="/" className="tlink">
          Zur Startseite <span className="arrow">→</span>
        </Link>
      </p>
    </LegalPage>
  );
}
