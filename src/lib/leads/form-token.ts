"use server";

import { signFormToken } from "./spam";

/**
 * Called by the public forms on the first interaction. The signed time stamp replaces the old
 * client-side `startedAt`, which bots could simply set to any value.
 */
export async function formToken(): Promise<string> {
  return signFormToken();
}
