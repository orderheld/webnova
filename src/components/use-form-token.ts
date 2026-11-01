"use client";

import { useCallback, useRef } from "react";
import { formToken } from "@/lib/leads/form-token";

/**
 * Signed time stamp for the spam filter (src/lib/leads/spam.ts). Fetched on the first interaction with
 * the form instead of on page load, so pages without a visitor touching the form cost no request.
 * `start` goes on the form's onFocus/onPointerDown, `get` is awaited right before submitting.
 */
export function useFormToken() {
  const pending = useRef<Promise<string | undefined> | null>(null);
  const start = useCallback(() => {
    pending.current ??= formToken().catch(() => {
      // retry on the next interaction; the server treats a missing token only as a weak signal
      pending.current = null;
      return undefined;
    });
  }, []);
  const get = useCallback(async () => {
    start();
    return (await pending.current) ?? undefined;
  }, [start]);
  return { start, get };
}
