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
    <ul className={`grid gap-3 sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : ""}`}>
      {list.map((i) => (
        <li key={i.key}>
          <Link href={href(locale, `industry:${i.key}`)} className="card-soft group flex items-center gap-3.5 p-3.5 hover:-translate-y-0.5 hover:shadow-card">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-bright-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
              <Icon name={i.icon} className="h-5 w-5" />
            </span>
            <span className="flex-1 font-display text-[16.5px] font-semibold text-ink transition-colors group-hover:text-accent">{i.content[locale].navLabel}</span>
            <Icon name="arrow" className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
