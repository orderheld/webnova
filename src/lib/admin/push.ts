import "server-only";
import { and, eq, inArray, isNull, lt, or, sql } from "drizzle-orm";
import { generateVAPIDKeys, sendNotification, WebPushError, type Urgency } from "web-push";
import { db, hasDb, schema } from "@/db";
import type { PushSubscriptionRow } from "@/db/schema";
import { site } from "@/lib/site";

/*
 * Push notifications of the admin app (Ferhat, 2026-10-09: new inquiries and live visitors, on by default for
 * every admin device). Devices subscribe in the admin (components/admin/push.tsx, service worker
 * public/admin-sw.js); this module sends to them with Web Push. The payload is end-to-end encrypted for the
 * device, so Apple's or Google's push service only passes it on and cannot read it.
 */

type VapidKeys = { publicKey: string; privateKey: string };
let vapid: Promise<VapidKeys> | undefined;

/** The VAPID key pair that signs our pushes. Created on first use and kept in the settings table, so it needs no setup in Vercel. */
function vapidKeys(): Promise<VapidKeys> {
  vapid ??= (async () => {
    const read = async () => {
      const [row] = await db().select().from(schema.settings).where(eq(schema.settings.key, "push_vapid"));
      return row?.value as VapidKeys | undefined;
    };
    const found = await read();
    if (found) return found;
    // Two instances may race here: whoever inserts first wins, both then use the stored pair.
    await db().insert(schema.settings).values({ key: "push_vapid", value: generateVAPIDKeys() }).onConflictDoNothing();
    return (await read())!;
  })().catch((err) => {
    vapid = undefined;
    throw err;
  });
  return vapid;
}

/** Public key the browsers subscribe with; null when there is no database (local builds). */
export async function pushPublicKey(): Promise<string | null> {
  if (!hasDb()) return null;
  try {
    return (await vapidKeys()).publicKey;
  } catch (err) {
    console.error("[push] keys", err);
    return null;
  }
}

export interface PushMessage {
  title: string;
  body: string;
  /** admin page that opens on tap, e.g. "/admin/anfragen/12" */
  url: string;
  /** same tag = replaces the earlier notification instead of adding one */
  tag?: string;
}

interface SendOptions {
  /** seconds the push service keeps the message while the device is offline */
  ttl: number;
  urgency: Urgency;
}

/** Sends one message to the given devices. Devices the push service no longer knows are removed. */
async function deliver(rows: PushSubscriptionRow[], message: PushMessage, options: SendOptions) {
  if (rows.length === 0) return { sent: 0, failed: 0 };
  const keys = await vapidKeys();
  const payload = JSON.stringify(message);
  const results = await Promise.allSettled(
    rows.map((r) =>
      sendNotification({ endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } }, payload, {
        vapidDetails: { subject: `mailto:${site.email}`, ...keys },
        TTL: options.ttl,
        urgency: options.urgency,
        timeout: 10_000,
      }),
    ),
  );
  const sent: number[] = [];
  const gone: number[] = [];
  results.forEach((res, i) => {
    if (res.status === "fulfilled") sent.push(rows[i].id);
    else if (res.reason instanceof WebPushError && (res.reason.statusCode === 404 || res.reason.statusCode === 410)) gone.push(rows[i].id);
    else console.error("[push]", rows[i].device, res.reason instanceof WebPushError ? `${res.reason.statusCode} ${res.reason.body}` : res.reason);
  });
  if (gone.length) await db().delete(schema.pushSubscriptions).where(inArray(schema.pushSubscriptions.id, gone));
  if (sent.length) await db().update(schema.pushSubscriptions).set({ lastSentAt: new Date() }).where(inArray(schema.pushSubscriptions.id, sent));
  return { sent: sent.length, failed: rows.length - sent.length };
}

/** New inquiry from the website: every device with «Neue Anfragen» switched on. Never throws. */
export async function pushNewLead(message: PushMessage) {
  if (!hasDb()) return;
  try {
    const rows = await db().select().from(schema.pushSubscriptions).where(eq(schema.pushSubscriptions.leads, true));
    // Kept a day while the phone is off; high urgency wakes the device right away.
    await deliver(rows, message, { ttl: 24 * 60 * 60, urgency: "high" });
  } catch (err) {
    console.error("[push] lead", err);
  }
}

/**
 * First page view of a visitor today: every device with «Besucher» switched on, at most one visitor message per
 * device and minute (claimed in one update, so parallel server instances cannot both send). Never throws.
 */
export async function pushNewVisitor(build: () => Promise<PushMessage>) {
  if (!hasDb()) return;
  try {
    const t = schema.pushSubscriptions;
    const rows = await db()
      .update(t)
      .set({ visitorSentAt: sql`now()` })
      .where(and(eq(t.visitors, true), or(isNull(t.visitorSentAt), lt(t.visitorSentAt, sql`now() - interval '1 minute'`))))
      .returning();
    if (rows.length === 0) return;
    // Only "live" for a few minutes: a visitor message older than 10 minutes is dropped instead of delivered late.
    await deliver(rows, await build(), { ttl: 10 * 60, urgency: "normal" });
  } catch (err) {
    console.error("[push] visitor", err);
  }
}

/** Test message from Einstellungen, to one device or (without endpoint) to all. */
export async function pushTest(endpoint?: string) {
  const t = schema.pushSubscriptions;
  const rows = await db().select().from(t).where(endpoint ? eq(t.endpoint, endpoint) : undefined);
  return deliver(rows, { title: "Webnova Admin", body: "Test: Mitteilungen kommen auf diesem Gerät an.", url: "/admin/einstellungen#mitteilungen", tag: "test" }, { ttl: 60 * 60, urgency: "high" });
}

/** Devices with notifications for Einstellungen, newest first. */
export async function pushDevices() {
  const t = schema.pushSubscriptions;
  return db()
    .select({ id: t.id, endpoint: t.endpoint, device: t.device, createdAt: t.createdAt, lastSentAt: t.lastSentAt, leads: t.leads, visitors: t.visitors })
    .from(t)
    .orderBy(sql`${t.createdAt} desc`);
}
