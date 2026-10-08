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
        <ol className={`grid gap-4 sm:grid-cols-2 ${points.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {points.map((p) => (
            <li key={p.title} className="card-soft reveal p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-bright-soft text-accent">
                <Icon name="bolt" className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-[19px] font-semibold leading-[1.3]">{p.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{p.text}</p>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <li key={p.key}>
              <Link href={href(locale, `problem:${p.key}`)} className="card-soft card-hover group flex h-full flex-col p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-bright-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-[19px] font-semibold leading-[1.3] transition-colors group-hover:text-accent">{p.content[locale].navLabel}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{p.content[locale].h1}</p>
                <span className="mt-auto flex items-center gap-2 pt-5 text-[14px] font-semibold text-bright">
                  {p.content[locale].solutionTitle}
                  <Icon name="arrow" className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
