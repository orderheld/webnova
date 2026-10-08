import Link from "next/link";
import { Icon } from "@/components/icons";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { serviceGroups } from "@/lib/nav";
import { href } from "@/lib/routes";
import { SectionHead } from "./head";

/** All services as a typographic index, grouped like the mega menu (Website / Sichtbarkeit & Marketing / Kasse & Shop). */
export function ServicesGrid({ locale, current, title, lead }: { locale: Locale; current?: string; title?: string; lead?: string }) {
  const d = getDict(locale);
  const s = structure[locale];
  const groups = serviceGroups(locale);
  const starts = groups.map((_, i) => groups.slice(0, i).reduce((sum, g) => sum + g.items.length, 0));
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
      <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
        {groups.map((g, gi) => (
          <div key={g.key}>
            <h3 className="label border-b border-ink pb-3">{g.label}</h3>
            <ul>
              {g.items.map((it, ii) => {
                const here = it.href === current;
                const n = starts[gi] + ii + 1;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      aria-current={here ? "page" : undefined}
                      className="group grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-3 border-b border-line py-4"
                    >
                      <span className="text-[12.5px] tabular-nums text-muted">{String(n).padStart(2, "0")}</span>
                      <span className="min-w-0">
                        <span className={`block text-[16.5px] font-semibold leading-snug transition-colors group-hover:text-accent ${here ? "text-accent" : "text-ink"}`}>{it.label}</span>
                        {it.text && <span className="mt-1 line-clamp-2 block text-[14px] leading-relaxed text-muted">{it.text}</span>}
                      </span>
                      <Icon name="arrow" className="h-4 w-4 self-center text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
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
