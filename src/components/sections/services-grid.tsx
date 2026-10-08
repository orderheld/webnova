import Link from "next/link";
import { Icon } from "@/components/icons";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { serviceGroups } from "@/lib/nav";
import { href } from "@/lib/routes";
import { SectionHead } from "./head";

/** All services as icon cards, grouped like the mega menu (Website / Sichtbarkeit & Marketing / Kasse & Shop). */
export function ServicesGrid({ locale, current, title, lead }: { locale: Locale; current?: string; title?: string; lead?: string }) {
  const d = getDict(locale);
  const s = structure[locale];
  const groups = serviceGroups(locale);
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
            <ul className="space-y-2">
              {g.items.map((it) => {
                const here = it.href === current;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      aria-current={here ? "page" : undefined}
                      className={`group flex items-start gap-3.5 rounded-2xl p-3.5 transition-[background-color,box-shadow] ${here ? "bg-white shadow-card ring-1 ring-accent/30" : "bg-white/70 hover:bg-white hover:shadow-card"}`}
                    >
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${here ? "bg-accent text-white" : "bg-bright-soft text-accent group-hover:bg-accent group-hover:text-white"}`}>
                        <Icon name={it.icon} className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-[15.5px] font-semibold leading-snug transition-colors group-hover:text-accent ${here ? "text-accent" : "text-ink"}`}>{it.label}</span>
                        {it.text && <span className="mt-1 line-clamp-2 block text-[13.5px] leading-relaxed text-muted">{it.text}</span>}
                      </span>
                      <Icon name="arrow" className="mt-3 h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
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
