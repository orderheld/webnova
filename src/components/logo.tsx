import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

/**
 * Uses /public/logo.png (the current Webnova logo) when present,
 * otherwise falls back to a typographic wordmark.
 */
const hasLogoFile = fs.existsSync(path.join(process.cwd(), "public", "logo.png"));

export function Logo({ invert = false, className = "" }: { invert?: boolean; className?: string }) {
  if (hasLogoFile) {
    return (
      <Image
        src="/logo.png"
        alt="Webnova"
        width={200}
        height={66}
        priority
        className={`h-8 w-auto ${invert ? "brightness-0 invert" : ""} ${className}`}
      />
    );
  }
  return (
    <span className={`inline-flex items-center gap-2 text-[22px] font-semibold tracking-[-0.04em] ${className}`}>
      <span
        aria-hidden="true"
        className={`grid h-7 w-7 place-items-center rounded-lg ${invert ? "bg-white text-ink" : "bg-ink text-white"}`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7l4 10 4-8 4 8 4-10" />
        </svg>
      </span>
      <span>
        webnova<span className="text-accent">.</span>
      </span>
    </span>
  );
}
