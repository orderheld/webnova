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

const toProject = { de: "Zum Projekt", fr: "Voir le projet" };

/** Real projects from src/content/references.ts only. Renders nothing while references are hidden. */
export function ReferencesSection({ locale, eyebrow, title, lead }: { locale: Locale; eyebrow?: string; title?: string; lead?: string }) {
  const d = getDict(locale);
  const s = structure[locale];
  const shown = showReferences ? references.filter((r) => hasRoute(`reference:${r.key}`)) : [];
  if (!shown.length) return null;
  return (
    <section className="container-x section-y">
      <SectionHead
        eyebrow={eyebrow ?? s.referencesEyebrow}
        title={title ?? s.referencesTitle}
        lead={lead ?? s.referencesLead}
        action={
          <Link href={href(locale, "references")} className="link-arrow">
            {d.home.referencesAll}
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        }
      />
      <div className={`grid gap-x-8 gap-y-12 md:grid-cols-2 ${shown.length % 3 === 0 ? "lg:grid-cols-3" : ""}`}>
        {shown.map((r) => (
          <Link key={r.key} href={href(locale, `reference:${r.key}`)} className="reveal group flex flex-col">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line shadow-xs transition-shadow duration-500 group-hover:shadow-lift" style={{ background: r.colors.bg }}>
              {r.image && (
                <Image
                  src={r.image}
                  alt={`${r.name}, ${r.content[locale].industry}`}
                  fill
                  sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                  className="object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              )}
            </div>
            <p className="mt-6 text-[13.5px] text-muted">
              {r.content[locale].industry}
              {r.content[locale].place && <> · {r.content[locale].place}</>}
            </p>
            <h3 className="mt-1.5 font-display text-[24px] font-semibold tracking-[-0.02em] transition-colors group-hover:text-accent">{r.name}</h3>
            <p className="mt-3 line-clamp-3 text-[15.5px] leading-relaxed text-ink-soft">{r.content[locale].summary}</p>
            <span className="link-arrow mt-5">
              {toProject[locale]}
              <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
