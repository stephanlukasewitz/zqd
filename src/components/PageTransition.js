import { ViewTransition } from "react";

// Wird in jede page.js gesetzt (nicht ins Layout), damit enter/exit feuern.
// Animiert nur Navigationen mit dem Typ "page" – Browser-Zurück bleibt sofort.
export default function PageTransition({ children }) {
  return (
    <ViewTransition
      enter={{ page: "tide", default: "none" }}
      exit={{ page: "tide", default: "none" }}
      default="none"
    >
      <div>{children}</div>
    </ViewTransition>
  );
}
