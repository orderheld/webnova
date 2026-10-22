import "server-only";
import { randomInt } from "node:crypto";
import { and, asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import type { Preview } from "@/db/schema";
import { currentAdmin } from "@/lib/auth";
import { site } from "@/lib/site";
import { PREVIEW_CHUNK } from "./preview-files";
import { getSettings } from "./settings";

const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";

/** 10 random characters: about 3.6 quadrillion links, so nobody finds a preview by trying. */
export function newPreviewToken() {
  return Array.from({ length: 10 }, () => alphabet[randomInt(alphabet.length)]).join("");
}

export const isPreviewToken = (s: string) => /^[a-z0-9]{10}$/.test(s);

export const previewUrl = (token: string) => `${site.url}/vorschau/${token}/`;

/**
 * Guard for the upload API (route handlers get neither the proxy's login check nor the Origin check of server
 * actions): signed-in admin, request from the admin itself. Returns the error response, or null when allowed.
 */
export async function previewApiGuard(req: Request): Promise<Response | null> {
  if (!(await currentAdmin())) return new Response("Unauthorized", { status: 401 });
  const fetchSite = req.headers.get("sec-fetch-site");
  const origin = req.headers.get("origin");
  if (fetchSite ? fetchSite !== "same-origin" : origin && new URL(origin).host !== req.headers.get("host")) {
    return new Response("Forbidden", { status: 403 });
  }
  return null;
}

/** Bytes start..end (inclusive) of a stored file, read chunk by chunk while the response streams. */
export function previewFileStream(fileId: number, start: number, end: number) {
  let seq = Math.floor(start / PREVIEW_CHUNK);
  const last = Math.floor(end / PREVIEW_CHUNK);
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (seq > last) return controller.close();
      const t = schema.previewChunks;
      const [chunk] = await db()
        .select({ data: t.data })
        .from(t)
        .where(and(eq(t.fileId, fileId), eq(t.seq, seq)));
      if (!chunk) return controller.error(new Error(`preview chunk ${fileId}/${seq} missing`));
      const base = seq * PREVIEW_CHUNK;
      controller.enqueue(new Uint8Array(chunk.data.subarray(Math.max(0, start - base), Math.min(chunk.data.length, end - base + 1))));
      seq++;
    },
  });
}

/** A whole stored file, e.g. the proposal PDF for the e-mail. */
export async function previewFileBuffer(fileId: number) {
  const t = schema.previewChunks;
  const chunks = await db().select({ data: t.data }).from(t).where(eq(t.fileId, fileId)).orderBy(asc(t.seq));
  return Buffer.concat(chunks.map((c) => c.data));
}

/** The proposal PDF of a preview, if one is uploaded completely. */
export async function previewPdf(p: Pick<Preview, "id" | "pdfFileId">) {
  if (!p.pdfFileId) return null;
  const f = schema.previewFiles;
  const [file] = await db()
    .select()
    .from(f)
    .where(and(eq(f.id, p.pdfFileId), eq(f.previewId, p.id), eq(f.kind, "pdf")));
  return file ?? null;
}

/**
 * Link previews of chat apps and mail scanners, crawlers and scripts: they load the page without a person
 * looking at it, so they do not count as an opening.
 */
export const isBot = (ua: string) =>
  !ua ||
  /bot|crawl|spider|slurp|preview|whatsapp|facebookexternalhit|facebot|telegram|slack|discord|skype|linkedin|pinterest|embedly|outlook|microsoft office|curl|wget|python|node-fetch|undici|axios|go-http|java\/|okhttp|headless|lighthouse|pagespeed|google-|bingpreview|yandex|baidu|applebot|petal|semrush|ahrefs/i.test(
    ua,
  );

const texts = {
  de: {
    subject: "Vorschau Ihrer neuen Webseite",
    hello: (name: string) => (name ? `Guten Tag ${name}` : "Guten Tag"),
    chatHello: (name: string) => (name ? `Grüezi ${name}` : "Grüezi"),
    chatPdf: "Das PDF mit Konzept, Aufbau, Ablauf und Preis sende ich Ihnen gleich hier im Chat.",
    bye: "Freundliche Grüsse",
  },
  fr: {
    subject: "Aperçu de votre nouveau site web",
    hello: (name: string) => (name ? `Bonjour ${name},` : "Bonjour,"),
    chatHello: (name: string) => (name ? `Bonjour ${name},` : "Bonjour,"),
    chatPdf: "Je vous envoie tout de suite ici le PDF avec le concept, la structure, le déroulement et le prix.",
    bye: "Meilleures salutations",
  },
};

const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "");

/** Paragraphs that mention the PDF, dropped when no PDF goes along. */
const withoutPdf = (text: string) =>
  text
    .split(/\n{2,}/)
    .filter((p) => !/\bPDF\b/.test(p))
    .join("\n\n");

/** Prefilled e-mail for the send dialog, in the client's language, from the texts in Einstellungen. */
export async function previewMailDraft(p: Preview, hasPdf: boolean) {
  const s = await getSettings();
  const locale = p.language === "fr" ? "fr" : "de";
  const t = texts[locale];
  const tpl = locale === "fr" ? s.previewEmailTextFr : s.previewEmailText;
  const text = fill(tpl, { anrede: t.hello(p.contactName.trim()), link: previewUrl(p.token), absender: `${s.owner}\n${s.companyName}` });
  return { to: p.contactEmail, subject: t.subject, text: hasPdf ? text : withoutPdf(text) };
}

/** Short message for WhatsApp, sent by Ferhat from his phone; the PDF follows in the same chat. */
export async function previewChatText(p: Preview, hasPdf: boolean) {
  const s = await getSettings();
  const locale = p.language === "fr" ? "fr" : "de";
  const t = texts[locale];
  const tpl = locale === "fr" ? s.previewChatTextFr : s.previewChatText;
  const text = fill(tpl, { anrede: t.chatHello(p.contactName.trim()), link: previewUrl(p.token), pdf: hasPdf ? t.chatPdf : "", absender: s.owner });
  return text.replace(/\n{3,}/g, "\n\n");
}
