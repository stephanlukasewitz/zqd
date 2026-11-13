"use client";

import { useSearchParams } from "next/navigation";
import Gallery from "./Gallery";

export default function GalleryFromUrl(props) {
  const sp = useSearchParams();
  const initial = Object.fromEntries(sp.entries());
  return <Gallery {...props} initial={initial} />;
}
