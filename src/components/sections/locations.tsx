import Link from "next/link";
import { Icon } from "@/components/icons";
import { cities } from "@/content/cities";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";

const chip =
  "inline-flex rounded-full border border-line bg-surface px-4 py-2 text-[14px] text-ink-soft transition-colors hover:border-accent/40 hover:bg-bright-soft hover:text-accent";

/**
 * Office plus every region page. On a city page, `current` marks that city and `groups` adds the
 * page's own link lists (same city, nearby) above the full list.
 */
export function LocationsSection({
  locale,
  current,
  groups = [],
  title,
}: {
  locale: Locale;
  current?: string;
  groups?: { label: string; links: { href: string; label: string }[] }[];
  title?: string;
}) {
  const s = structure[locale];
  const label = (name: string) => `${locale === "de" ? "Webdesign" : "Site internet"} ${name}`;
  const sorted = [...cities.filter((c) => c.priority === "A"), ...cities.filter((c) => c.priority !== "A")];
  return (
    <section className="section-y border-t border-line bg-bg-2">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="reveal lg:col-span-4">
          <p className="eyebrow mb-4">{s.locationsEyebrow}</p>
          <h2 className="h-section">{title ?? s.locationsTitle}</h2>
          <p className="lead mt-6">{s.locationsLead}</p>
          <div className="card mt-8 flex items-start gap-3.5 p-6">
            <span className="icon-tile h-10 w-10">
              <Icon name="pin" className="h-[18px] w-[18px]" />
            </span>
            <span className="text-[15px] leading-relaxed text-ink-soft">
              <span className="block font-semibold text-ink">{s.officeLabel}</span>
              {site.address.street}, {site.address.zip} {site.address.city}
            </span>
          </div>
        </div>
        <div className="space-y-10 lg:col-span-7 lg:col-start-6">
          {groups
            .filter((g) => g.links.length > 0)
            .map((g) => (
              <div key={g.label} className="reveal">
                <h3 className="mb-4 text-[15px] font-semibold text-ink">{g.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.links.map((l) => (
                    <Link key={l.href} href={l.href} className={chip}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          <div className="reveal">
            <h3 className="mb-4 text-[15px] font-semibold text-ink">{s.allRegions}</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {sorted.map((c) => (
                <li key={c.key}>
                  <Link
                    href={href(locale, `city:${c.key}`)}
                    aria-current={c.key === current ? "page" : undefined}
                    className={`group flex items-center justify-between rounded-xl border px-4 py-3 text-[15px] transition-colors ${
                      c.key === current
                        ? "border-accent bg-accent text-white"
                        : "border-line bg-surface text-ink-soft hover:border-accent/40 hover:text-accent"
                    }`}
                  >
                    <span>
                      {label(c.content[locale].name)}
                      <span className={`ml-2 text-[12.5px] ${c.key === current ? "text-white/70" : "text-muted"}`}>{c.canton}</span>
                    </span>
                    <Icon name="arrow" className="h-4 w-4 opacity-60 transition-transform group-hover:translate-x-0.5" />
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
