import TLink from "@/components/transition/TLink";
import LegalPage from "@/components/legal/LegalPage";
import { getDict } from "@/i18n/server";

export default async function NotFound() {
  const d = await getDict();
  return (
    <LegalPage title={d.notFound.title}>
      <p>{d.notFound.text}</p>
      <p>
        <TLink href="/" className="tlink">
          {d.notFound.home} <span className="arrow">→</span>
        </TLink>
      </p>
    </LegalPage>
  );
}
