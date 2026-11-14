"use client";

import { useSearchParams } from "next/navigation";
import Gallery from "./Gallery";

export default function GalleryFromUrl(props) {
  const sp = useSearchParams();
  return <Gallery {...props} search={sp.toString()} />;
}
