// Der Seitenübergang läuft global über den TransitionProvider (Vorhang).
// Diese Hülle bleibt als fester Einstiegspunkt pro Seite bestehen.
export default function PageTransition({ children }) {
  return children;
}
