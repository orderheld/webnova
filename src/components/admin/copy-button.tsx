"use client";

import { toast } from "./feedback";
import { Icon } from "./icons";
import { btnSm } from "./ui";

/** Copies a text (a link, a prepared message) and confirms with a toast. */
export function CopyButton({ text, label = "Kopieren", done = "Kopiert", className = btnSm.ghost }: { text: string; label?: string; done?: string; className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        navigator.clipboard.writeText(text).then(
          () => toast(done),
          () => toast("Kopieren nicht möglich, bitte von Hand markieren.", "error"),
        )
      }
    >
      <Icon name="copy" className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
