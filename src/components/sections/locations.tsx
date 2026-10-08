import Link from "next/link";
import { Icon } from "@/components/icons";
import { cities } from "@/content/cities";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import { Kicker } from "./head";

const chip = "inline-flex border-b border-line py-1 text-[15px] text-ink-soft transition-colors hover:border-accent hover:text-accent";

/**
 * Office plus every region page. On a city page, `current` marks that city and `groups` adds the
 * page's own link lists (same city, nearby) above the full list.
 */
export function LocationsSection({
  locale,
  current,
  groups = [],
  title,
  id,
}: {
  locale: Locale;
  current?: string;
  groups?: { label: string; links: { href: string; label: string }[] }[];
  title?: string;
  id?: string;
}) {
  const s = structure[locale];
  const label = (name: string) => `${locale === "de" ? "Webdesign" : "Site internet"} ${name}`;
  const sorted = [...cities.filter((c) => c.priority === "A"), ...cities.filter((c) => c.priority !== "A")];
  return (
    <section id={id} className="section-y scroll-mt-20 border-t border-line bg-bg-2">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Kicker className="mb-8">{s.locationsEyebrow}</Kicker>
          <h2 className="h-section">{title ?? s.locationsTitle}</h2>
          <p className="lead mt-6">{s.locationsLead}</p>
          <p className="meta mt-8 border-t border-line pt-4">
            <span className="label mb-1">{s.officeLabel}</span>
            {site.address.street} · {site.address.zip} {site.address.city}
          </p>
        </div>
        <div className="space-y-12 lg:col-span-7 lg:col-start-6">
          {groups
            .filter((g) => g.links.length > 0)
            .map((g) => (
              <div key={g.label}>
                <h3 className="label mb-4">{g.label}</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {g.links.map((l) => (
                    <Link key={l.href} href={l.href} className={chip}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          <div>
            <h3 className="label mb-4">{s.allRegions}</h3>
            <ul className="grid border-t border-ink sm:grid-cols-2 sm:gap-x-8">
              {sorted.map((c, i) => (
                <li key={c.key}>
                  <Link
                    href={href(locale, `city:${c.key}`)}
                    aria-current={c.key === current ? "page" : undefined}
                    className={`group grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-3 border-b border-line py-3.5 text-[15.5px] transition-colors ${
                      c.key === current ? "font-semibold text-accent" : "text-ink-soft hover:text-accent"
                    }`}
                  >
                    <span className="text-[12px] tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      {label(c.content[locale].name)}
                      <span className="ml-2 text-[12px] uppercase tracking-wider text-muted">{c.canton}</span>
                    </span>
                    <Icon name="arrow" className="h-4 w-4 self-center opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
