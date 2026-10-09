"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { userAgent } from "next/server";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { pushTest } from "./push";

const base64url = (min: number, max: number) => z.string().min(min).max(max).regex(/^[A-Za-z0-9_-]+=*$/);

const subscriptionInput = z.object({
  endpoint: z.url({ protocol: /^https$/ }).max(1000),
  p256dh: base64url(80, 100),
  auth: base64url(16, 32),
  /** iPad with a desktop user agent (iPadOS reports itself as a Mac) */
  touch: z.boolean().optional(),
});

/** "iPhone", "iPad", "Mac · Safari", "Windows · Edge", "Android · Chrome" */
async function deviceLabel(touch?: boolean) {
  const ua = userAgent({ headers: await headers() });
  const os = ua.os.name ?? "";
  const browser = (ua.browser.name ?? "Browser").replace(/^Mobile /, "");
  if (/iPhone|iPad/.test(ua.device.model ?? "")) return ua.device.model!;
  if (/Mac/.test(os)) return touch ? "iPad" : `Mac · ${browser}`;
  return os ? `${os.replace(/ OS$/, "")} · ${browser}` : browser;
}

/**
 * Stores this device's push subscription (on every app start, so a renewed subscription replaces the old one).
 * An existing device keeps its switches: whoever switched messages off does not get them back by opening the app.
 */
export async function savePushSubscription(input: z.input<typeof subscriptionInput>): Promise<{ ok: boolean }> {
  await requireAdmin();
  const parsed = subscriptionInput.safeParse(input);
  if (!parsed.success) return { ok: false };
  const { endpoint, p256dh, auth, touch } = parsed.data;
  const device = await deviceLabel(touch);
  await db()
    .insert(schema.pushSubscriptions)
    .values({ endpoint, p256dh, auth, device })
    .onConflictDoUpdate({ target: schema.pushSubscriptions.endpoint, set: { p256dh, auth, device } });
  return { ok: true };
}

/** Switches «Neue Anfragen» or «Besucher» on or off for one device. */
export async function setPushPreference(id: number, kind: "leads" | "visitors", on: boolean): Promise<{ ok: boolean }> {
  await requireAdmin();
  if (!Number.isInteger(id) || (kind !== "leads" && kind !== "visitors") || typeof on !== "boolean") return { ok: false };
  const updated = await db()
    .update(schema.pushSubscriptions)
    .set(kind === "leads" ? { leads: on } : { visitors: on })
    .where(eq(schema.pushSubscriptions.id, id))
    .returning({ id: schema.pushSubscriptions.id });
  return { ok: updated.length > 0 };
}

/** Sends a test message to this device (its endpoint) or, without one, to every device. */
export async function sendTestPush(endpoint?: string): Promise<{ sent: number; failed: number }> {
  await requireAdmin();
  if (endpoint !== undefined && (typeof endpoint !== "string" || endpoint.length > 1000)) return { sent: 0, failed: 0 };
  return pushTest(endpoint);
}
