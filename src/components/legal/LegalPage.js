import PageTransition from "@/components/PageTransition";
import styles from "./LegalPage.module.css";

export default function LegalPage({ title, children }) {
  return (
    <PageTransition>
      <article className={styles.page}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.body}>{children}</div>
      </article>
    </PageTransition>
  );
}

export function Note({ children }) {
  return <p className={styles.note}>{children}</p>;
}
