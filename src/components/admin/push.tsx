"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { fmtDate, fmtDateTime } from "@/lib/admin/money";
import { savePushSubscription, sendTestPush, setPushPreference } from "@/lib/admin/push-actions";
import { Spinner, toast } from "./feedback";
import { Icon } from "./icons";
import { btnSm, Card } from "./ui";

/*
 * Push notifications in the admin app: the panel asks once per device (banner), Einstellungen shows the
 * devices with their switches. Browsers only allow notifications after one tap on «Erlauben», so «on by
 * default» means: the banner asks on the first start, and both message types are on once allowed.
 */

const SW_URL = "/admin-sw.js";
const SCOPE = "/admin";
const LATER_KEY = "wn-push-later";
const SYNC_KEY = "wn-push-sync";
const LATER_MS = 3 * 24 * 60 * 60 * 1000;
const CHANGE = "wn-push-change";

type Permission = "unsupported" | NotificationPermission;

function permission(): Permission {
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

function storageGet(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // private mode: the banner simply asks again next time
  }
}

/** Re-read permission and «Später» after enabling, and when the app comes back (settings may have changed). */
function onChange(cb: () => void) {
  window.addEventListener(CHANGE, cb);
  document.addEventListener("visibilitychange", cb);
  return () => {
    window.removeEventListener(CHANGE, cb);
    document.removeEventListener("visibilitychange", cb);
  };
}
const changed = () => window.dispatchEvent(new Event(CHANGE));

const usePermission = () => useSyncExternalStore<Permission | "checking">(onChange, permission, () => "checking");

function keyBytes(base64: string) {
  const raw = atob((base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

const register = () => navigator.serviceWorker.register(SW_URL, { scope: SCOPE, updateViaCache: "none" });

/**
 * Subscribes this device (if not yet) and tells the server. Without `force` the server only hears about it once
 * a day or when the subscription changed. Returns the endpoint.
 */
async function subscribe(publicKey: string, force: boolean) {
  await register();
  const reg = await navigator.serviceWorker.ready;
  const key = keyBytes(publicKey);
  let sub = await reg.pushManager.getSubscription();
  // A subscription made with an older server key would never receive anything: renew it.
  const used = sub?.options?.applicationServerKey ? new Uint8Array(sub.options.applicationServerKey) : null;
  if (sub && used && (used.length !== key.length || used.some((b, i) => b !== key[i]))) {
    await sub.unsubscribe();
    sub = null;
  }
  if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
  let last: { endpoint?: string; at?: number } = {};
  try {
    last = JSON.parse(storageGet(SYNC_KEY) ?? "{}");
  } catch {}
  if (force || last.endpoint !== sub.endpoint || Date.now() - (last.at ?? 0) > 24 * 60 * 60 * 1000) {
    const keys = sub.toJSON().keys ?? {};
    const touch = /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
    const res = await savePushSubscription({ endpoint: sub.endpoint, p256dh: keys.p256dh ?? "", auth: keys.auth ?? "", touch });
    if (!res.ok) throw new Error("subscription not saved");
    storageSet(SYNC_KEY, JSON.stringify({ endpoint: sub.endpoint, at: Date.now() }));
  }
  return sub.endpoint;
}

// Banner and Einstellungen both keep the device subscribed on start: one run per page load is enough.
let synced: Promise<string> | undefined;
function keepSubscribed(publicKey: string) {
  synced ??= subscribe(publicKey, false).catch((err) => {
    synced = undefined;
    throw err;
  });
  return synced;
}

/** Asks for permission (must come first in the tap handler, iOS insists) and subscribes. */
async function enable(publicKey: string): Promise<{ permission: NotificationPermission; endpoint?: string }> {
  const result = await Notification.requestPermission();
  if (result !== "granted") return { permission: result };
  const endpoint = await subscribe(publicKey, true);
  synced = Promise.resolve(endpoint);
  return { permission: result, endpoint };
}

/** Runs `enable` from a button and reports the outcome as a toast. */
async function enableWithFeedback(publicKey: string) {
  try {
    const res = await enable(publicKey);
    if (res.endpoint) toast("Mitteilungen aktiviert");
    else if (res.permission === "denied") toast("Mitteilungen sind blockiert. In den Einstellungen des Geräts erlauben.", "error");
    return res.endpoint ?? null;
  } catch (err) {
    console.warn("[push]", err);
    toast("Mitteilungen konnten nicht aktiviert werden", "error");
    return null;
  } finally {
    changed();
  }
}

/**
 * Panel banner: registers the service worker on every start, keeps an allowed device subscribed, and asks
 * devices that were never asked. «Später» hides it for a few days.
 */
export function PushPrompt({ publicKey }: { publicKey: string | null }) {
  const router = useRouter();
  const perm = usePermission();
  const later = useSyncExternalStore(onChange, () => Date.now() - Number(storageGet(LATER_KEY) ?? 0) < LATER_MS, () => true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!publicKey || perm === "checking" || perm === "unsupported") return;
    if (perm === "granted") keepSubscribed(publicKey).catch((err) => console.warn("[push]", err));
    else register().catch((err) => console.warn("[push]", err));
  }, [publicKey, perm]);

  if (!publicKey || perm !== "default" || later) return null;

  const allow = async () => {
    setBusy(true);
    if (await enableWithFeedback(publicKey)) router.refresh();
    setBusy(false);
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-line bg-surface p-4 shadow-xs sm:px-5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bright-soft text-accent">
        <Icon name="bell" className="h-5 w-5" />
      </span>
      <div className="min-w-[12rem] flex-1">
        <p className="text-[15px] font-semibold text-ink">Mitteilungen aktivieren</p>
        <p className="mt-0.5 text-[13.5px] leading-snug text-muted">Neue Anfragen und Besucher auf webnova.ch sofort auf diesem Gerät sehen.</p>
      </div>
      <div className="flex w-full gap-2 sm:w-auto">
        <button
          type="button"
          className={`${btnSm.ghost} flex-1 sm:flex-none`}
          onClick={() => {
            storageSet(LATER_KEY, String(Date.now()));
            changed();
          }}
        >
          Später
        </button>
        <button type="button" className={`${btnSm.dark} flex-1 sm:flex-none`} onClick={allow} disabled={busy}>
          {busy && <Spinner className="h-3.5 w-3.5" />}
          Aktivieren
        </button>
      </div>
    </div>
  );
}

export interface PushDevice {
  id: number;
  endpoint: string;
  device: string;
  createdAt: string;
  lastSentAt: string | null;
  leads: boolean;
  visitors: boolean;
}

type Kind = "leads" | "visitors";

/** Einstellungen > Mitteilungen: this device's state, every device with its two switches, and a test. */
export function PushSettings({ devices, publicKey }: { devices: PushDevice[]; publicKey: string | null }) {
  const router = useRouter();
  const perm = usePermission();
  const [mine, setMine] = useState<string | null>(null);
  // switches flipped here, until the server data catches up
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState<"enable" | "test" | null>(null);

  useEffect(() => {
    if (perm !== "granted" || !publicKey) return;
    let live = true;
    keepSubscribed(publicKey)
      .then((endpoint) => live && setMine(endpoint))
      .catch((err) => console.warn("[push]", err));
    return () => {
      live = false;
    };
  }, [perm, publicKey]);

  const value = (d: PushDevice, kind: Kind) => flipped[`${d.id}:${kind}`] ?? d[kind];

  const activate = async () => {
    if (!publicKey) return;
    setBusy("enable");
    const endpoint = await enableWithFeedback(publicKey);
    if (endpoint) {
      setMine(endpoint);
      router.refresh();
    }
    setBusy(null);
  };

  const test = async () => {
    setBusy("test");
    try {
      const res = await sendTestPush(mine ?? undefined);
      if (res.sent > 0) toast(mine ? "Test gesendet" : `Test an ${res.sent} ${res.sent === 1 ? "Gerät" : "Geräte"} gesendet`);
      else toast("Test konnte nicht zugestellt werden", "error");
    } catch {
      toast("Test konnte nicht gesendet werden", "error");
    } finally {
      setBusy(null);
    }
  };

  const toggle = async (id: number, kind: Kind, on: boolean) => {
    const key = `${id}:${kind}`;
    setFlipped((f) => ({ ...f, [key]: on }));
    try {
      const res = await setPushPreference(id, kind, on);
      if (!res.ok) throw new Error("not saved");
      toast("Gespeichert");
    } catch {
      setFlipped((f) => ({ ...f, [key]: !on }));
      toast("Konnte nicht gespeichert werden", "error");
    }
  };

  const subscribed = perm === "granted" && mine !== null && devices.some((d) => d.endpoint === mine);

  return (
    <Card title="Mitteilungen" id="mitteilungen" className="mt-6 scroll-mt-24">
      <p className="text-[14px] leading-relaxed text-muted">
        Neue Anfragen und neue Besucher auf webnova.ch kommen als Mitteilung auf jedes Gerät, das Mitteilungen erlaubt hat. Beide sind eingeschaltet
        und lassen sich pro Gerät abschalten. Besucher-Mitteilungen kommen einmal pro Besucher und Tag, höchstens eine pro Minute.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-bg px-4 py-3 text-[14px]">
        <Icon name="bell" className="h-4 w-4 shrink-0 text-accent" />
        <span className="min-w-[12rem] flex-1 text-ink-soft">
          {perm === "checking" && "Dieses Gerät wird geprüft ..."}
          {perm === "unsupported" && "Dieses Gerät kann hier keine Mitteilungen empfangen. Auf dem iPhone die Admin-App vom Home-Bildschirm öffnen (ab iOS 16.4)."}
          {perm === "denied" &&
            "Mitteilungen sind auf diesem Gerät blockiert. Auf dem iPhone unter Einstellungen > Mitteilungen > Webnova Admin erlauben, im Browser in den Website-Einstellungen."}
          {perm === "default" && "Auf diesem Gerät noch nicht aktiviert."}
          {perm === "granted" && (subscribed ? "Auf diesem Gerät aktiv." : "Erlaubt, das Gerät wird angemeldet ...")}
        </span>
        {perm === "default" && publicKey && (
          <button type="button" className={btnSm.dark} onClick={activate} disabled={busy !== null}>
            {busy === "enable" && <Spinner className="h-3.5 w-3.5" />}
            Aktivieren
          </button>
        )}
        {devices.length > 0 && (subscribed || perm === "unsupported" || perm === "denied") && (
          <button type="button" className={btnSm.ghost} onClick={test} disabled={busy !== null}>
            {busy === "test" ? <Spinner className="h-3.5 w-3.5" /> : <Icon name="send" className="h-3.5 w-3.5" />}
            {subscribed ? "Test senden" : "Test an alle Geräte"}
          </button>
        )}
      </div>

      {devices.length > 0 ? (
        <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
          {devices.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2.5">
              <div className="min-w-[10rem] flex-1 py-1">
                <p className="flex flex-wrap items-center gap-2 text-[14.5px] font-medium text-ink">
                  {d.device}
                  {d.endpoint === mine && <span className="rounded-full bg-bright-soft px-2 py-0.5 text-[11.5px] font-semibold text-accent">Dieses Gerät</span>}
                </p>
                <p className="mt-0.5 text-[12.5px] text-muted">
                  Seit {fmtDate(d.createdAt)}
                  {d.lastSentAt && ` · zuletzt zugestellt ${fmtDateTime(d.lastSentAt)}`}
                </p>
              </div>
              <label className="inline-flex min-h-11 items-center gap-2 text-[14px] text-ink-soft">
                <input type="checkbox" className="h-[18px] w-[18px]" checked={value(d, "leads")} onChange={(e) => toggle(d.id, "leads", e.target.checked)} />
                Neue Anfragen
              </label>
              <label className="inline-flex min-h-11 items-center gap-2 text-[14px] text-ink-soft">
                <input type="checkbox" className="h-[18px] w-[18px]" checked={value(d, "visitors")} onChange={(e) => toggle(d.id, "visitors", e.target.checked)} />
                Besucher
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-[14px] text-muted">Noch kein Gerät angemeldet.</p>
      )}
    </Card>
  );
}
