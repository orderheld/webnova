/**
 * Editorial section heading used by all shared sections: a numbered label (the number comes from
 * the page's section counter), a large H2 and an optional lead or action next to it.
 * `numbered={false}` renders a plain label for sections that should not take a number.
 */
export function SectionHead({
  eyebrow,
  title,
  lead,
  dark = false,
  action,
  numbered = true,
  id,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  dark?: boolean;
  action?: React.ReactNode;
  numbered?: boolean;
  /** id on the H2, for aria-labelledby or anchors. */
  id?: string;
}) {
  const label = numbered ? (dark ? "kicker-light" : "kicker") : dark ? "eyebrow-light" : "eyebrow";
  return (
    <div className="mb-12 md:mb-16">
      <p className={`${label} mb-6 md:mb-8`}>{eyebrow}</p>
      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <h2 id={id} className={`h-section md:col-span-8 ${lead || action ? "" : "md:col-span-10"}`}>
          {title}
        </h2>
        {(lead || action) && (
          <div className="md:col-span-4 md:pb-1">
            {lead && <p className={dark ? "text-[16.5px] leading-relaxed text-white/75" : "text-[16.5px] leading-relaxed text-ink-soft"}>{lead}</p>}
            {action && <div className={lead ? "mt-5" : ""}>{action}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

/** Plain numbered label for sections that build their own heading layout. */
export function Kicker({ children, dark = false, className = "" }: { children: React.ReactNode; dark?: boolean; className?: string }) {
  return <p className={`${dark ? "kicker-light" : "kicker"} ${className}`}>{children}</p>;
}
