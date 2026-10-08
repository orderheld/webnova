import type { Locale, Point } from "@/content/types";
import { structure } from "@/content/structure";

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
        <div className="reveal lg:col-span-5">
          <p className="eyebrow mb-4">{eyebrow ?? s.benefitsEyebrow}</p>
          <h2 className="h-section">{title ?? s.benefitsTitle}</h2>
          {lead && <p className="lead mt-6">{lead}</p>}
          {quote && (
            <figure className="mt-10 border-l-2 border-bright pl-6">
              <blockquote className="font-display text-[clamp(1.25rem,2vw,1.5rem)] font-medium leading-snug tracking-[-0.01em] text-ink">«{quote.text}»</blockquote>
              <figcaption className="mt-4 text-[14px] text-muted">{quote.by}</figcaption>
            </figure>
          )}
        </div>
        <ol className="lg:col-span-6 lg:col-start-7">
          {items.map((w, n) => (
            <li key={w.title} className="reveal grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-7 last:border-b">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-bright-soft font-display text-[14px] font-semibold text-bright">{n + 1}</span>
              <div>
                <h3 className="font-display text-[20px] font-semibold tracking-[-0.01em]">{w.title}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">{w.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
