"use client";
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { Spinner } from "./ui";

const ITEMS = [
  ["", "Übersicht"],
  ["/projekte", "Projekte"],
  ["/startseite", "Startseite"],
  ["/team", "Team & Partner"],
  ["/texte", "Texte"],
  ["/kontakt", "Kontaktdaten"],
];

function Pending() {
  const { pending } = useLinkStatus();
  return pending ? <Spinner size={11} /> : null;
}

export default function Nav({ site }) {
  const path = usePathname();
  return (
    <nav className="nav">
      {ITEMS.map(([p, label]) => {
        const href = `/${site}${p}`;
        const active = p === "" ? path === href : path.startsWith(href);
        return (
          <Link key={p} href={href} aria-current={active ? "page" : undefined}>
            {label}
            <Pending />
          </Link>
        );
      })}
    </nav>
  );
}
