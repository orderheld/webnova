import { ButtonLink } from "@/components/button";
import { structure } from "@/content/structure";
import type { Locale, Point } from "@/content/types";
import { getDict } from "@/i18n/dict";
import { href } from "@/lib/routes";

/** The five phases on the grey band. Pages can pass their own steps; the default is the agency process. */
export function ProcessSection({ locale, steps, title, lead }: { locale: Locale; steps?: Point[]; title?: string; lead?: string }) {
  const d = getDict(locale);
  const s = structure[locale];
  const list = steps?.length ? steps : d.home.process;
  return (
    <section className="section-y bg-bg-2">
      <div className="container-x">
        <div className="reveal grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow mb-4">{s.processEyebrow}</p>
            <h2 className="h-section">{title ?? (list.length === 5 ? s.processTitle : d.home.processTitle)}</h2>
          </div>
          <p className="lead md:col-span-5">{lead ?? s.processLead}</p>
        </div>
        <ol className={`mt-14 grid gap-4 sm:grid-cols-2 ${list.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5"}`}>
          {list.map((p, n) => (
            <li key={p.title} className="card reveal relative p-7">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent font-display text-[14px] font-semibold text-white">{n + 1}</span>
              <h3 className="mt-8 font-display text-[18px] font-semibold tracking-[-0.01em]">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{p.text}</p>
            </li>
          ))}
        </ol>
        <div className="reveal mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ButtonLink href={href(locale, "request")}>{s.stepsCta}</ButtonLink>
          <span className="text-[14px] text-muted">{d.common.free}</span>
        </div>
      </div>
    </section>
  );
}
