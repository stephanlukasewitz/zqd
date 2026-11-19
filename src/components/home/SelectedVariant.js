"use client";

import { useSearchParams } from "next/navigation";

// Testweise Varianten für „Ausgewählte Projekte“: ?v=2 zeigt die Bilderwolke.
export default function SelectedVariant({ v1, v2 }) {
  const v = useSearchParams().get("v");
  return v === "2" ? v2 : v1;
}
