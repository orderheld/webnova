import Link from "next/link";
import { Icon } from "@/components/icons";
import { industries } from "@/content/industries";
import { industryUi } from "@/content/industries/ui";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { href } from "@/lib/routes";
import { SectionHead } from "./head";

/** Index of all industry pages: numbered, typographic, three columns on desktop. */
export function IndustriesTeaser({ locale, exclude, title, lead }: { locale: Locale; exclude?: string; title?: string; lead?: string }) {
  const s = structure[locale];
  const list = industries.filter((i) => i.key !== exclude);
  return (
    <section className="container-x section-y">
      <SectionHead
        eyebrow={s.industriesEyebrow}
        title={title ?? s.industriesTitle}
        lead={lead ?? s.industriesLead}
        action={
          <Link href={href(locale, "industries")} className="link-arrow">
            {industryUi[locale].allIndustries}
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        }
      />
      <IndustryIndex locale={locale} list={list} />
    </section>
  );
}

export function IndustryIndex({ locale, list = industries, cols = 3 }: { locale: Locale; list?: typeof industries; cols?: 2 | 3 }) {
  return (
    <ul className={`grid border-t border-ink sm:grid-cols-2 sm:gap-x-8 ${cols === 3 ? "lg:grid-cols-3" : ""}`}>
      {list.map((i, n) => (
        <li key={i.key}>
          <Link href={href(locale, `industry:${i.key}`)} className="group grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-3 border-b border-line py-4">
            <span className="text-[12.5px] tabular-nums text-muted">{String(n + 1).padStart(2, "0")}</span>
            <span className="font-display text-[18px] font-semibold tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">{i.content[locale].navLabel}</span>
            <Icon name="arrow" className="h-4 w-4 self-center text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
