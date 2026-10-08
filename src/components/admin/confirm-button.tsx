"use client";

import { PendingButton } from "./feedback";

/** Submit button that asks before it runs (deletes) and shows a spinner while the action runs. */
export function ConfirmButton({ message, className, children }: { message: string; className?: string; children: React.ReactNode }) {
  return (
    <PendingButton confirm={message} className={className}>
      {children}
    </PendingButton>
  );
}
