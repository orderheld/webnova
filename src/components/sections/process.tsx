import { ButtonLink } from "@/components/button";
import { structure } from "@/content/structure";
import type { Locale, Point } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";
import { SectionHead } from "./head";

const metaText = {
  de: (n: number) => `${n} Phasen · eine Ansprechperson · Sie entscheiden bei jedem Schritt`,
  fr: (n: number) => `${n} phases · un seul interlocuteur · vous décidez à chaque étape`,
};

/** The phases as a numbered row on hairlines. Pages can pass their own steps; the default is the agency process. */
export function ProcessSection({ locale, steps, title, lead, id }: { locale: Locale; steps?: Point[]; title?: string; lead?: string; id?: string }) {
  const d = getDict(locale);
  const s = structure[locale];
  const list = steps?.length ? steps : d.home.process;
  return (
    <section id={id} className="section-y scroll-mt-20 bg-bg-2">
      <div className="container-x">
        <SectionHead eyebrow={s.processEyebrow} title={title ?? (list.length === 5 ? s.processTitle : d.home.processTitle)} lead={lead ?? s.processLead} />
        <p className="meta mb-8">{metaText[locale](list.length)}</p>
        <ol className={`grid gap-x-6 sm:grid-cols-2 ${list.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5"}`}>
          {list.map((p, n) => (
            <li key={p.title} className="relative border-t border-ink pb-10 pt-6">
              <span className="font-display text-[clamp(2.4rem,4vw,3.25rem)] font-semibold leading-none tracking-[-0.04em] text-accent tabular-nums">
                {String(n + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-display text-[19px] font-semibold tracking-[-0.01em]">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{p.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ButtonLink href={href(locale, "request")}>{s.stepsCta}</ButtonLink>
          <span className="meta">{d.common.free}</span>
        </div>
      </div>
    </section>
  );
}
