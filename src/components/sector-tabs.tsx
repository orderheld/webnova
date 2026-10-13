"use client";

import { useId, useRef, useState } from "react";

/**
 * Chips that switch between server-rendered panels (the sector preview). The chips wrap onto several
 * lines instead of scrolling sideways, and only the chosen panel is mounted, so only its videos load.
 * Keyboard: arrow keys, Home and End move between the chips (WAI-ARIA tabs pattern).
 */
export function SectorTabs({ label, tabs, panels }: { label: string; tabs: string[]; panels: React.ReactNode[] }) {
  const [sel, setSel] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = (i: number) => {
    const n = (i + tabs.length) % tabs.length;
    setSel(n);
    refs.current[n]?.focus();
  };
  const onKey = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: sel + 1, ArrowDown: sel + 1, ArrowLeft: sel - 1, ArrowUp: sel - 1, Home: 0, End: tabs.length - 1 };
    if (e.key in keys) {
      e.preventDefault();
      go(keys[e.key]);
    }
  };

  return (
    <div>
      <div role="tablist" aria-label={label} onKeyDown={onKey} className="flex flex-wrap gap-2">
        {tabs.map((t, i) => (
          <button
            key={t}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === sel}
            aria-controls={`${id}-panel`}
            tabIndex={i === sel ? 0 : -1}
            onClick={() => setSel(i)}
            className={`rounded-full px-4 py-2 text-[14.5px] font-medium transition-colors ${
              i === sel ? "bg-accent text-white shadow-xs" : "bg-white text-ink-soft ring-1 ring-inset ring-line hover:text-accent hover:ring-accent/30"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${sel}`} className="mt-8 md:mt-10">
        {panels[sel]}
      </div>
    </div>
  );
}
