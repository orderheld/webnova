import Link from "next/link";
import { Icon } from "@/components/icons";
import { problems } from "@/content/problems";
import { structure } from "@/content/structure";
import type { Locale, Point } from "@/content/types";
import { hasRoute, href } from "@/lib/routes";
import { SectionHead } from "./head";

/**
 * "Kennen Sie diese Probleme?": either the page's own problems (points) or links to the problem pages
 * (all of them, or the keys given). Problem pages that do not exist are skipped.
 */
export function ProblemsSection({
  locale,
  keys,
  points,
  title,
  lead,
}: {
  locale: Locale;
  keys?: string[];
  points?: Point[];
  title?: string;
  lead?: string;
}) {
  const s = structure[locale];
  const list = (keys ? keys.map((k) => problems.find((p) => p.key === k)) : problems)
    .filter((p) => p !== undefined)
    .filter((p) => hasRoute(`problem:${p.key}`));
  if (!points?.length && !list.length) return null;
  return (
    <section className="container-x section-y">
      <SectionHead
        eyebrow={s.problemsEyebrow}
        title={title ?? s.problemsTitle}
        lead={lead ?? s.problemsLead}
        action={
          !points?.length && hasRoute("problems") ? (
            <Link href={href(locale, "problems")} className="link-arrow">
              {s.problemsMore}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          ) : undefined
        }
      />
      {points?.length ? (
        <ol className={`grid gap-x-8 sm:grid-cols-2 ${points.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {points.map((p, i) => (
            <li key={p.title} className="border-t border-ink pb-8 pt-6">
              <span className="font-display text-[14px] font-semibold tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-display text-[20px] font-semibold leading-snug tracking-[-0.015em]">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{p.text}</p>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="border-t border-ink">
          {list.map((p, i) => (
            <li key={p.key}>
              <Link
                href={href(locale, `problem:${p.key}`)}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 border-b border-line py-6 md:grid-cols-[3.5rem_5fr_6fr_auto] md:py-7"
              >
                <span className="font-display text-[14px] font-semibold tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-[clamp(1.25rem,2vw,1.6rem)] font-semibold leading-snug tracking-[-0.02em] transition-colors group-hover:text-accent">
                  {p.content[locale].navLabel}
                </h3>
                <p className="col-start-2 mt-2 text-[15px] leading-relaxed text-ink-soft md:col-start-3 md:mt-0">
                  {p.content[locale].h1}
                  <span className="mt-2 block text-[14px] font-medium text-bright">{p.content[locale].solutionTitle}</span>
                </p>
                <Icon name="arrow" className="col-start-3 row-start-1 h-5 w-5 self-center text-ink-soft transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent md:col-start-4" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
