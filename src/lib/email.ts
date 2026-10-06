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

export const fromAddress = () => process.env.RESEND_FROM ?? `Webnova <${site.email}>`;
export const adminInbox = () => process.env.LEAD_INBOX ?? site.email;

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Simple, robust HTML wrapper for transactional mails. */
export function mailLayout(bodyHtml: string, footer = true) {
  return `<!doctype html><html><body style="margin:0;background:#f4f5f0;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0e0e10">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:600px;background:#ffffff;border-radius:20px;border:1px solid #e3e1db" cellpadding="0" cellspacing="0">
<tr><td style="padding:28px 32px 0 32px"><img src="${site.url}/logo-email.png" width="150" height="28" alt="Webnova" style="display:block;border:0;height:auto"></td></tr>
<tr><td style="padding:20px 32px 32px 32px;font-size:15px;line-height:1.6">${bodyHtml}</td></tr>
</table>
${
  footer
    ? `<p style="font-size:12px;color:#66666d;margin:20px 0 0">${site.legalName} · ${site.address.street} · ${site.address.zip} ${site.address.city} · ${site.phone} · <a href="${site.url}" style="color:#66666d">${site.url.replace("https://", "")}</a></p>`
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
