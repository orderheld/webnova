import Link from "next/link";
import { Icon } from "@/components/icons";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { serviceGroups } from "@/lib/nav";
import { href } from "@/lib/routes";
import { SectionHead } from "./head";

/**
 * All services as icon cards, grouped like the mega menu (Website / Sichtbarkeit & Marketing / Kasse & Shop).
 * `compact` drops the descriptions: used as "related services" at the end of service and city pages.
 */
export function ServicesGrid({
  locale,
  current,
  title,
  lead,
  compact,
}: {
  locale: Locale;
  current?: string;
  title?: string;
  lead?: string;
  compact?: boolean;
}) {
  const d = getDict(locale);
  const s = structure[locale];
  const groups = serviceGroups(locale, current);
  return (
    <section className="container-x section-y">
      <SectionHead
        eyebrow={s.servicesEyebrow}
        title={title ?? s.servicesTitle}
        lead={lead}
        action={
          <Link href={href(locale, "services")} className="link-arrow">
            {d.nav.allServices}
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        }
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {groups.map((g) => (
          <div key={g.key} className="rounded-3xl bg-bg-2 p-3 ring-1 ring-line">
            <h3 className="px-3 pb-3 pt-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-accent">{g.label}</h3>
            <ul className={compact ? "space-y-1.5" : "space-y-2"}>
              {g.items.map((it) => {
                const here = it.href === current;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      aria-current={here ? "page" : undefined}
                      className={`group flex gap-3.5 rounded-2xl transition-[background-color,box-shadow] ${compact ? "items-center p-2.5" : "items-start p-3.5"} ${here ? "bg-white shadow-card ring-1 ring-accent/30" : "bg-white/70 hover:bg-white hover:shadow-card"}`}
                    >
                      <span
                        className={`grid shrink-0 place-items-center transition-colors ${compact ? "h-9 w-9 rounded-lg" : "h-10 w-10 rounded-xl"} ${here ? "bg-accent text-white" : "bg-bright-soft text-accent group-hover:bg-accent group-hover:text-white"}`}
                      >
                        <Icon name={it.icon} className={compact ? "h-[18px] w-[18px]" : "h-5 w-5"} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-[15.5px] font-semibold leading-snug transition-colors group-hover:text-accent ${here ? "text-accent" : "text-ink"}`}>{it.label}</span>
                        {!compact && it.text && <span className="mt-1 line-clamp-2 block text-[13.5px] leading-relaxed text-muted">{it.text}</span>}
                      </span>
                      <Icon
                        name="arrow"
                        className={`h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent ${compact ? "" : "mt-3"}`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
