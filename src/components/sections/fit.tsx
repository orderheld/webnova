import { Icon } from "@/components/icons";
import { structure } from "@/content/structure";
import type { Locale } from "@/content/types";
import { SectionHead } from "./head";

/** "Passen wir zusammen?": honest fit (Schieferblau card) and no-fit (white card) side by side, no prices. */
export function FitSection({ locale, fit, pos = false }: { locale: Locale; fit?: { yes: string[]; no: string[] }; pos?: boolean }) {
  const s = structure[locale];
  const f = fit ?? (pos ? s.posFit : s.fit);
  return (
    <section className="container-x section-y">
      <SectionHead eyebrow={s.fitEyebrow} title={s.fitTitle} lead={s.fitLead} />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="stage-accent rounded-3xl p-7 text-white sm:p-9">
          <h3 className="flex items-center gap-3 font-display text-[21px] font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-accent">
              <Icon name="check" className="h-4 w-4" strokeWidth={3} />
            </span>
            {s.fitYesTitle}
          </h3>
          <ul className="mt-6 space-y-3">
            {f.yes.map((t) => (
              <li key={t} className="flex gap-3 rounded-xl bg-white/[0.08] px-4 py-3.5 text-[15.5px] leading-relaxed">
                <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-accent-light" strokeWidth={2.6} />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-white p-7 ring-1 ring-line sm:p-9">
          <h3 className="flex items-center gap-3 font-display text-[21px] font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-bg-2 text-muted">
              <Icon name="close" className="h-4 w-4" strokeWidth={2.6} />
            </span>
            {s.fitNoTitle}
          </h3>
          <ul className="mt-6 space-y-3">
            {f.no.map((t) => (
              <li key={t} className="flex gap-3 rounded-xl bg-bg-2 px-4 py-3.5 text-[15.5px] leading-relaxed text-ink-soft">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-muted" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
