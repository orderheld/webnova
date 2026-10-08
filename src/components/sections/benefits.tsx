import type { Locale, Point } from "@/content/types";
import { structure } from "@/content/structure";
import { Kicker } from "./head";

/** Why Webnova: numbered list next to the heading, optionally with a lead and a short quote. */
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
    <section className="container-x section-y">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Kicker className="mb-8">{eyebrow ?? s.benefitsEyebrow}</Kicker>
          <h2 className="h-section">{title ?? s.benefitsTitle}</h2>
          {lead && <p className="lead mt-6">{lead}</p>}
          {quote && (
            <figure className="mt-10 border-l-2 border-accent pl-6">
              <blockquote className="font-display text-[clamp(1.25rem,2vw,1.5rem)] font-medium leading-snug tracking-[-0.01em] text-ink">«{quote.text}»</blockquote>
              <figcaption className="meta mt-4">{quote.by}</figcaption>
            </figure>
          )}
        </div>
        <ol className="border-t border-ink lg:col-span-6 lg:col-start-7">
          {items.map((w, n) => (
            <li key={w.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-7">
              <span className="font-display text-[15px] font-semibold tabular-nums text-accent">{String(n + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-[21px] font-semibold tracking-[-0.015em]">{w.title}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">{w.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
