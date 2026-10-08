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

/** The phases as a connected timeline on the Schieferblau stage. Pages can pass their own steps. */
export function ProcessSection({ locale, steps, title, lead, id }: { locale: Locale; steps?: Point[]; title?: string; lead?: string; id?: string }) {
  const d = getDict(locale);
  const s = structure[locale];
  const list = steps?.length ? steps : d.home.process;
  const cols = list.length === 4 ? "lg:grid-cols-4" : list.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-5";
  return (
    <section id={id} className="stage-accent section-y scroll-mt-20 text-white">
      <div className="container-x">
        <SectionHead dark eyebrow={s.processEyebrow} title={title ?? (list.length === 5 ? s.processTitle : d.home.processTitle)} lead={lead ?? s.processLead} />
        <p className="mb-8 text-[14px] text-white/60">{metaText[locale](list.length)}</p>
        <ol className={`relative grid gap-4 sm:grid-cols-2 ${cols}`}>
          <span aria-hidden="true" className="absolute left-6 right-6 top-[1.85rem] hidden h-[2px] rounded bg-linear-to-r from-white/70 via-accent-light/50 to-white/10 lg:block" />
          {list.map((p, n) => (
            <li key={p.title} className="relative">
              <span className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-white font-display text-[18px] font-semibold tabular-nums text-accent shadow-[0_12px_24px_-12px_rgb(10_22_34/0.6)]">
                {String(n + 1).padStart(2, "0")}
              </span>
              <div className="card-glass mt-4 p-5">
                <h3 className="font-display text-[18px] font-semibold leading-[1.3]">{p.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/75">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ButtonLink href={href(locale, "request")} variant="accent">
            {d.nav.cta}
          </ButtonLink>
          <span className="text-[14px] text-white/65">{d.common.free}</span>
        </div>
      </div>
    </section>
  );
}
