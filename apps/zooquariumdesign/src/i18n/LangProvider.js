"use client";

import { createContext, useCallback, useContext } from "react";
import { localize } from "./config";

// Sprache und Oberflächentexte für Client-Komponenten.
const Ctx = createContext({ lang: "de", ui: {}, values: {} });

export function LangProvider({ lang, ui, values, children }) {
  return <Ctx.Provider value={{ lang, ui, values }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

// Interne Adresse → Adresse der aktuellen Sprache
export function useHref() {
  const { lang } = useContext(Ctx);
  return useCallback((href) => localize(href, lang), [lang]);
}
