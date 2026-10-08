import type { Locale, Point } from "@/content/types";
import { structure } from "@/content/structure";
import { Kicker } from "./head";

/** Why Webnova: the heading on the left, the reasons as glass cards on a dark Schieferblau stage. */
export function BenefitsSection({
  locale,
  items,
  eyebrow,
  title,
  lead,
  quote,
}: {
  locale: Locale;
  items: Point[];
  eyebrow?: string;
  title?: string;
  lead?: string;
  quote?: { text: string; by: string };
}) {
  const s = structure[locale];
  if (!items.length) return null;
  return (
    <section className="stage-night section-y text-white">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Kicker dark className="mb-5">
              {eyebrow ?? s.benefitsEyebrow}
            </Kicker>
            <h2 className="h-section">{title ?? s.benefitsTitle}</h2>
            {lead && <p className="mt-6 text-[17px] leading-relaxed text-white/75">{lead}</p>}
            {quote && (
              <figure className="mt-10 border-l-2 border-accent-light pl-6">
                <blockquote className="font-display text-[clamp(1.2rem,1.9vw,1.45rem)] font-medium leading-[1.4]">«{quote.text}»</blockquote>
                <figcaption className="mt-4 text-[14px] text-white/60">{quote.by}</figcaption>
              </figure>
            )}
          </div>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {items.map((w, n) => (
            <li key={w.title} className="card-glass reveal p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white font-display text-[14px] font-semibold tabular-nums text-accent">{String(n + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 font-display text-[19px] font-semibold leading-[1.3]">{w.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-white/70">{w.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
