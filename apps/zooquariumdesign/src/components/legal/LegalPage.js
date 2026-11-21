import PageTransition from "@/components/PageTransition";
import { getDict, getLang } from "@/i18n/server";
import { withDot } from "../fx/Dot";
import styles from "./LegalPage.module.css";

// Rechtstexte liegen nur auf Deutsch vor; in anderen Sprachen steht ein Hinweis davor.
export default async function LegalPage({ title, legal, children }) {
  const lang = await getLang();
  const d = await getDict();
  const german = legal && lang !== "de";
  return (
    <PageTransition>
      <article className={styles.page}>
        <h1 className={styles.title}>{withDot(title)}</h1>
        {german && d.legal.note && <p className={styles.note}>{d.legal.note}</p>}
        <div className={styles.body} lang={german ? "de" : undefined}>
          {children}
        </div>
      </article>
    </PageTransition>
  );
}

export function Note({ children }) {
  return <p className={styles.note}>{children}</p>;
}
