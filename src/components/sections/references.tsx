import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { references } from "@/content/references";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { hasRoute, href } from "@/lib/routes";
import { showReferences } from "@/lib/site";
import { SectionHead } from "./head";

const t = {
  de: { toProject: "Projekt ansehen", hint: "Seitlich scrollen", all: "Gesamte Übersicht", list: "Projekte" },
  fr: { toProject: "Voir le projet", hint: "Faire défiler", all: "Vue d'ensemble", list: "Projets" },
};

/** True when the projects carousel would render (references switched on and pages exist). */
export function hasProjects() {
  return showReferences && references.some((r) => hasRoute(`reference:${r.key}`));
}

/**
 * Real projects from src/content/references.ts as a horizontal row (CSS scroll snap, no JS).
 * Renders nothing while references are hidden (showReferences in src/lib/site.ts).
 */
export function ReferencesSection({ locale, eyebrow, title, lead, id }: { locale: Locale; eyebrow?: string; title?: string; lead?: string; id?: string }) {
  const d = getDict(locale);
  const s = structure[locale];
  const tt = t[locale];
  const shown = showReferences ? references.filter((r) => hasRoute(`reference:${r.key}`)) : [];
  if (!shown.length) return null;
  return (
    <section id={id} className="section-y scroll-mt-20 overflow-hidden">
      <div className="container-x">
        <SectionHead eyebrow={eyebrow ?? s.referencesEyebrow} title={title ?? s.referencesTitle} lead={lead ?? s.referencesLead} />
        <p className="meta mb-6 flex items-center gap-2">
          {shown.length} {tt.list} · {tt.hint}
          <Icon name="arrow" className="h-3.5 w-3.5" />
        </p>
      </div>
      <ul
        tabIndex={0}
        aria-label={tt.list}
        className="container-x flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [scrollbar-width:thin]"
      >
        {shown.map((r) => {
          const c = r.content[locale];
          return (
            <li key={r.key} className="w-[82%] shrink-0 snap-start sm:w-[420px]">
              <Link href={href(locale, `reference:${r.key}`)} className="group flex h-full flex-col">
                <div className="relative aspect-[4/3] overflow-hidden border border-line" style={{ background: r.colors.bg }}>
                  {r.image && (
                    <Image
                      src={r.image}
                      alt={`${r.name}, ${c.industry}`}
                      fill
                      sizes="420px"
                      className="object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <p className="caption">{c.industry}{c.place && <> · {c.place}</>}</p>
                <h3 className="mt-2 font-display text-[24px] font-semibold tracking-[-0.02em] transition-colors group-hover:text-accent">{r.name}</h3>
                <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-ink-soft">{c.summary}</p>
                <span className="link-arrow mt-4">
                  {tt.toProject}
                  <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          );
        })}
        <li className="w-[70%] shrink-0 snap-start sm:w-[300px]">
          <Link href={href(locale, "references")} className="group flex aspect-[4/3] flex-col justify-between bg-night p-7 text-white">
            <span className="eyebrow-light">{d.nav.references}</span>
            <span className="flex items-center gap-2 font-display text-[24px] font-semibold tracking-[-0.02em]">
              {tt.all}
              <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
