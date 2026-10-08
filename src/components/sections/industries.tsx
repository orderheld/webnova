import Link from "next/link";
import { Icon } from "@/components/icons";
import { industries } from "@/content/industries";
import { industryUi } from "@/content/industries/ui";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { href } from "@/lib/routes";
import { SectionHead } from "./head";

/** Teaser grid of all industry pages. */
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
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {list.map((i) => (
          <li key={i.key} className="reveal">
            <Link
              href={href(locale, `industry:${i.key}`)}
              className="card card-hover group flex h-full flex-col gap-4 p-5"
            >
              <span className="icon-tile h-10 w-10 transition-colors group-hover:bg-accent group-hover:text-white">
                <Icon name={i.icon} className="h-[18px] w-[18px]" />
              </span>
              <span className="text-[15.5px] font-semibold leading-snug text-ink group-hover:text-accent">{i.content[locale].navLabel}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
