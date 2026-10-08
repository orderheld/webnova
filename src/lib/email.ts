import "server-only";
import { Resend } from "resend";
import { site } from "./site";

let _resend: Resend | undefined;
function resend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return undefined;
  _resend ??= new Resend(key);
  return _resend;
}

/** Sender as "Name <mail>". Tolerates env values like "Webnova kontakt@webnova.ch" (missing angle brackets). */
export function fromAddress() {
  const raw = process.env.RESEND_FROM?.trim().replace(/^["']|["']$/g, "");
  if (!raw) return `Webnova <${site.email}>`;
  if (raw.includes("<")) return raw;
  const m = raw.match(/^(.*?)\s*([^\s]+@[^\s]+)$/);
  if (!m) return `Webnova <${site.email}>`;
  return m[1] ? `${m[1]} <${m[2]}>` : m[2];
}
export const adminInbox = () => process.env.LEAD_INBOX ?? site.email;

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Corporate palette for mails, mirrors the site tokens in globals.css. */
export const mailColors = {
  bg: "#f3f6f9",
  surface: "#ffffff",
  ink: "#1c232b",
  inkSoft: "#3a434d",
  muted: "#646b73",
  line: "#e3e8ee",
  accent: "#24405a",
  bright: "#3b6385",
  danger: "#a12a2a",
};
const mailFont = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
/** Headings use Inter Tight like the website, where the mail client has it. */
const mailDisplayFont = "'Inter Tight',Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

/** Simple, robust HTML wrapper for transactional mails. */
export function mailLayout(bodyHtml: string, footer = true) {
  const c = mailColors;
  // Plain links (no own style) in the body get the bright blue of the site.
  const body = bodyHtml.replace(/<a href="([^"]*)">/g, `<a href="$1" style="color:${c.bright};text-decoration:underline">`);
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><style>h1,h2,h3{font-family:${mailDisplayFont};font-weight:600;letter-spacing:-0.01em;color:${c.ink}}</style></head><body style="margin:0;background:${c.bg};font-family:${mailFont};color:${c.ink}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.bg}"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:600px;background:${c.surface};border-radius:16px;border:1px solid ${c.line};overflow:hidden" cellpadding="0" cellspacing="0">
<tr><td style="height:4px;background:${c.accent};font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:28px 32px 0 32px"><img src="${site.url}/logo-email.png" width="150" height="28" alt="Webnova" style="display:block;border:0;height:auto"></td></tr>
<tr><td style="padding:20px 32px 32px 32px;font-size:15px;line-height:1.6;color:${c.inkSoft}">${body}</td></tr>
</table>
${
  footer
    ? `<p style="font-size:12px;line-height:1.6;color:${c.muted};margin:20px 0 0">${site.legalName} · ${site.address.street} · ${site.address.zip} ${site.address.city} · ${site.phone} · <a href="${site.url}" style="color:${c.muted}">${site.url.replace("https://", "")}</a></p>`
    : ""
}
</td></tr></table></body></html>`;
}

export interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer }[];
}

export async function sendMail(args: SendArgs): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  const r = resend();
  if (!r) {
    console.warn("[email] RESEND_API_KEY missing, mail not sent:", args.subject);
    return { ok: false, error: "RESEND_API_KEY ist nicht gesetzt." };
  }
  const { data, error } = await r.emails.send({
    from: fromAddress(),
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
    replyTo: args.replyTo,
    attachments: args.attachments?.map((a) => ({ filename: a.filename, content: a.content })),
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data?.id };
}
