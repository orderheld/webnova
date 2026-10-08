import Link from "next/link";
import { Icon } from "@/components/icons";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { serviceGroups } from "@/lib/nav";
import { href } from "@/lib/routes";
import { SectionHead } from "./head";

/** All services, grouped like the mega menu (Website / Sichtbarkeit & Marketing / Kasse & Shop). */
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
      <div className="grid gap-10 lg:grid-cols-3 lg:gap-6">
        {groups.map((g) => (
          <div key={g.key} className="reveal">
            <h3 className="mb-4 border-b border-line pb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">{g.label}</h3>
            <ul className="space-y-2">
              {g.items.map((it) => {
                const here = it.href === current;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      aria-current={here ? "page" : undefined}
                      className={`group flex items-start gap-3.5 rounded-xl border p-4 transition-colors ${
                        here ? "border-accent/40 bg-bright-soft" : "border-line bg-surface hover:border-accent/30 hover:bg-bg-2"
                      }`}
                    >
                      <span className="icon-tile h-10 w-10 transition-colors group-hover:bg-accent group-hover:text-white">
                        <Icon name={it.icon} className="h-[18px] w-[18px]" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[16px] font-semibold leading-snug text-ink group-hover:text-accent">{it.label}</span>
                        {it.text && <span className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-muted">{it.text}</span>}
                      </span>
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
