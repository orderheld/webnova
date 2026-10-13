import Link from "next/link";
import type { Locale } from "@/content/types";
import { hasRoute, href } from "@/lib/routes";
import { Icon } from "./icons";

const allPrices = { de: "Alle Preise", fr: "Tous les tarifs" };

/**
 * Price line with a link to the price list: on the dark page heroes (`dark`) and in light sections
 * such as the sector preview. `lines` are short texts like "Webseiten ab CHF 2’000", joined with " · ".
 */
export function PriceHint({ locale, lines, dark = false, className = "" }: { locale: Locale; lines: string[]; dark?: boolean; className?: string }) {
  if (!hasRoute("pricing") || !lines.length) return null;
  return (
    <Link
      href={href(locale, "pricing")}
      className={`group inline-flex max-w-full items-center gap-3 rounded-2xl py-2 pl-2 pr-4 text-[14.5px] leading-snug ring-1 ring-inset transition-colors ${
        dark ? "bg-white/[0.08] text-white ring-white/15 hover:bg-white/[0.12]" : "bg-bright-soft text-ink ring-line hover:ring-accent/30"
      } ${className}`}
    >
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white ${dark ? "text-accent" : "text-bright"}`}>
        <Icon name="tag" className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
      <span className="min-w-0 font-semibold">{lines.join(" · ")}</span>
      <span className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap font-medium ${dark ? "text-accent-light group-hover:text-white" : "text-bright group-hover:text-accent"}`}>
        {allPrices[locale]}
        <Icon name="arrow" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
