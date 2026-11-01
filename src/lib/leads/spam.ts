import { createHmac, timingSafeEqual } from "node:crypto";
import { and, gt, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { db, hasDb, schema } from "@/db";

/**
 * Spam protection of the public forms (request form and website check), without cookies, without
 * third-party services and invisible for people:
 *
 * 1. Honeypot field: hidden from people, bots fill it in.
 * 2. Signed form token: issued on the first interaction with the form; a submit within 3 seconds or
 *    without a valid token is a bot (the old client time stamp could simply be faked).
 * 3. Rate limit per visitor in the database (works across all Vercel instances): IP addresses are
 *    never stored, only a keyed hash that changes every day.
 * 4. Content score: links, foreign scripts, typical spam phrases (SEO offers, crypto, "dear sir" …),
 *    English text, gibberish names, throwaway mail domains.
 *
 * Blocked submissions are not lost: they land in `lead_spam` (Admin > Leads & Anfragen > Spam-Filter),
 * are kept for 30 days and can be taken over as a normal lead with one click. No push and no mail
 * are sent for them, and the visitor always sees the normal thank-you page, so bots learn nothing.
 */

const MIN_FILL_MS = 3000;
const MAX_TOKEN_AGE_MS = 3 * 24 * 60 * 60_000;
/** from this score a submission counts as spam */
export const SPAM_THRESHOLD = 5;
/** submissions (accepted or blocked) per visitor and hour */
const MAX_PER_HOUR = 5;
export const SPAM_KEEP_DAYS = 30;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET must be set (min. 32 characters)");
  return s;
}

const mac = (s: string) => createHmac("sha256", secret()).update(s).digest("base64url").slice(0, 22);

export function signFormToken(now = Date.now()): string {
  const ts = now.toString(36);
  return `${ts}.${mac(`form:${ts}`)}`;
}

/** Age of a valid token in ms, or null when the token is missing, forged or too old. */
export function formTokenAge(token: string | undefined, now = Date.now()): number | null {
  if (!token || token.length > 60) return null;
  const [ts, sig] = token.split(".");
  if (!ts || !sig) return null;
  const expected = Buffer.from(mac(`form:${ts}`));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  const age = now - parseInt(ts, 36);
  if (!Number.isFinite(age) || age < 0 || age > MAX_TOKEN_AGE_MS) return null;
  return age;
}

/** Keyed daily hash of the IP address: enough to count submissions, useless to identify anyone. */
export function visitorHash(ip: string, now = new Date()) {
  return createHmac("sha256", secret())
    .update(`ip:${now.toISOString().slice(0, 10)}:${ip}`)
    .digest("hex")
    .slice(0, 16);
}

/* ───────────── content score ───────────── */

export interface SpamFields {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message?: string;
}

const linkRe = /(https?:\/\/|www\.|\[url|<a\s|\[link)/i;
const linkReAll = new RegExp(linkRe.source, "gi");
const domainInTextRe = /\b[a-z0-9-]{2,}\.(com|net|org|info|biz|io|co|ru|cn|xyz|top|online|site|shop|store)\b/i;
const foreignScriptRe = /[Ѐ-ӿ؀-ۿ֐-׿฀-๿ऀ-ॿ぀-ヿ㐀-鿿가-힯]/;

/** Phrases that real Swiss customers practically never write, but spam mails always do. */
const spamPhrases: RegExp[] = [
  /\bback ?links?\b/i,
  /\bguest ?posts?\b/i,
  /\blink ?building\b/i,
  /\bseo (services?|experts?|agency|company|team|packages?|audit)\b/i,
  /\b(first|1st|top) (page|position|rank(ing)?s?) (of|on|in) google\b/i,
  /\brank(ing)? (your|ur) (website|site|business)\b/i,
  /\b(increase|boost|drive|grow) (your |more )?(organic |website |web )?(traffic|sales|leads|rankings?|revenue)\b/i,
  /\bdomain authority\b/i,
  /\b(crypto|bitcoin|btc|forex|binary options?|nft|casino|betting|viagra|cialis|porn|escort|dating|adult)\b/i,
  /\b(loans?|investment opportunit(y|ies)|passive income|make money)\b/i,
  /\bdear (sir|madam|business owner|website owner|webmaster|team)\b/i,
  /\bhello (sir|dear|team|there)\b/i,
  /\bi (came across|found|visited|was (looking|checking) at) your (website|site|company|business)\b/i,
  /\bi am (reaching out|writing to)\b/i,
  /\bwould you be interested\b/i,
  /\b(we are|i am) an? (leading|professional|expert|experienced|top[- ]rated)\b/i,
  /\b(outsourc\w*|offshore|white[- ]label|virtual assistants?|lead generation|cold (email|calling)|data ?entry)\b/i,
  /\b(web|app|software|mobile app) development (services?|company|agency|team)\b/i,
  /\b(unsubscribe|opt[- ]out|reply (with )?["'«]?(stop|no|remove)["'»]?)\b/i,
  /\b(telegram|fiverr|upwork|skype id)\b/i,
  /(\busd\b|us\$|\$ ?\d)/i,
  /\b(free|special) (quote|trial|offer|consultation) (for|to) you\b/i,
];

const enWords = new Set("the and you your we our is are to for with this that have can will would of on in it be i am at from about please".split(" "));
const deFrWords = new Set(
  "und der die das ich sie wir ist mit für eine einen ein nicht wie bitte gerne hallo grüezi webseite unsere unser mein meine le la les et je nous vous est avec pour une un pas bonjour site notre mon ma des du".split(" "),
);

const throwawayDomains =
  /@(mailinator|guerrillamail|sharklasers|10minutemail|yopmail|temp-?mail|trashmail|getnada|dispostable|maildrop|throwawaymail|fakeinbox|mailnesia|tempail|emailondeck|mohmal|spamgourmet)\./i;
const spamTlds = /\.(ru|cn|xyz|top|click|icu|buzz|work|loan|win|bid|monster|cyou|rest|sbs)$/i;

/** Words like "JhbGtRfD" or "xqzvbn": typical bot names. */
function gibberish(word: string) {
  if (word.length < 6 || !/^[a-z]+$/i.test(word)) return false;
  const switches = (word.slice(1).match(/[a-z][A-Z]|[A-Z][a-z]/g) ?? []).length;
  if (switches >= 3) return true;
  return !/[aeiouyäöü]/i.test(word);
}

export function contentScore(f: SpamFields): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  const add = (n: number, why: string) => {
    score += n;
    reasons.push(why);
  };
  const msg = f.message ?? "";
  const person = `${f.name} ${f.company ?? ""}`;

  if (linkRe.test(person)) add(6, "Link im Namen oder in der Firma");
  else if (domainInTextRe.test(person)) add(3, "Domain im Namen oder in der Firma");

  const links = msg.match(linkReAll)?.length ?? 0;
  if (links >= 2) add(4, `${links} Links in der Nachricht`);
  else if (links === 1) add(2, "Link in der Nachricht");
  if (/<\/?[a-z][^>]*>|\[\/?(url|b|link)\]/i.test(msg)) add(3, "HTML- oder BBCode in der Nachricht");

  if (foreignScriptRe.test(person + msg)) add(6, "fremde Schrift (z. B. kyrillisch, chinesisch)");

  const phrases = spamPhrases.filter((re) => re.test(`${person} ${msg}`)).length;
  if (phrases) add(Math.min(phrases * 3, 9), `${phrases} typische Spam-Formulierung${phrases > 1 ? "en" : ""}`);

  const words = msg.toLowerCase().match(/[a-zäöüéèàç']+/g) ?? [];
  if (words.length >= 8) {
    const en = words.filter((w) => enWords.has(w)).length;
    const local = words.filter((w) => deFrWords.has(w)).length;
    if (en >= 4 && en > local * 3) add(2, "Nachricht auf Englisch");
  }

  if (!/\p{L}/u.test(f.name) || f.name.split(/\s+/).some(gibberish)) add(5, "Name sieht zufällig aus");

  if (throwawayDomains.test(f.email)) add(4, "Wegwerf-E-Mail-Adresse");
  else if (spamTlds.test(f.email.trim())) add(2, "E-Mail-Endung oft Spam");

  // Swiss and neighbouring countries are fine, far-away numbers are a weak signal.
  const phone = (f.phone ?? "").replace(/[\s().-]/g, "");
  if (/^(\+|00)/.test(phone) && !/^(\+|00)(41|49|33|43|39|423|352|32|31)/.test(phone)) add(2, "ausländische Telefonnummer");

  return { score, reasons };
}

/* ───────────── screening ───────────── */

export type ScreenResult = { spam: false; visitor: string | null } | { spam: true };

/**
 * Decides whether a submission is accepted. Blocked submissions are stored in `lead_spam` with the
 * prepared lead row, so Ferhat can take them over if the filter was wrong.
 */
export async function screenSubmission(args: {
  form: "anfrage" | "website-check";
  token?: string;
  honeypot?: string;
  fields: SpamFields;
  /** the lead row that would be inserted, kept for "keine Spam" in the admin */
  row: Record<string, unknown>;
}): Promise<ScreenResult> {
  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const visitor = ip ? visitorHash(ip) : null;

  const reasons: string[] = [];
  let score = 0;

  if (args.honeypot) {
    reasons.push("verstecktes Feld ausgefüllt (Bot)");
    score += 10;
  }
  const age = formTokenAge(args.token);
  if (age === null) {
    reasons.push("ohne gültiges Formular-Token");
    score += 4;
  } else if (age < MIN_FILL_MS) {
    reasons.push(`in ${(age / 1000).toFixed(1)} s ausgefüllt (Bot)`);
    score += 10;
  }

  const content = contentScore(args.fields);
  score += content.score;
  reasons.push(...content.reasons);

  let recentFromVisitor = 0;
  if (hasDb()) {
    try {
      const since = sql`now() - interval '1 hour'`;
      const email = args.fields.email.trim().toLowerCase();
      const [dup, fromVisitor] = await Promise.all([
        // The same person sending the form twice within 10 minutes (double click, back button).
        db()
          .select({ n: sql<number>`count(*)::int` })
          .from(schema.leads)
          .where(and(sql`lower(${schema.leads.email}) = ${email}`, gt(schema.leads.createdAt, sql`now() - interval '10 minutes'`))),
        visitor
          ? db()
              .select({
                n: sql<number>`(select count(*) from ${schema.leads} where ${schema.leads.ipHash} = ${visitor} and ${schema.leads.createdAt} > ${since})::int
                  + (select count(*) from ${schema.leadSpam} where ${schema.leadSpam.visitor} = ${visitor} and ${schema.leadSpam.createdAt} > ${since})::int`,
              })
              .from(sql`(select 1) as one`)
          : Promise.resolve([{ n: 0 }]),
      ]);
      if ((dup[0]?.n ?? 0) > 0 && score < SPAM_THRESHOLD) {
        console.log(`[spam] ${args.form}: duplicate within 10 minutes, ignored`);
        return { spam: true };
      }
      recentFromVisitor = fromVisitor[0]?.n ?? 0;
      if (recentFromVisitor >= MAX_PER_HOUR) {
        reasons.push(`${recentFromVisitor + 1}. Absendung innert einer Stunde`);
        score += 10;
      }
    } catch (e) {
      // A database hiccup must never block a real inquiry.
      console.error("[spam] rate check failed", e);
    }
  } else if (memoryLimited(visitor ?? "unknown")) {
    reasons.push("zu viele Absendungen");
    score += 10;
  }

  if (score < SPAM_THRESHOLD) return { spam: false, visitor };

  console.log(`[spam] ${args.form} blocked (score ${score}): ${reasons.join("; ")}`);
  // A flooding bot fills the list only up to a point; everything above is dropped without a trace.
  if (hasDb() && recentFromVisitor < 30) {
    try {
      await db().insert(schema.leadSpam).values({
        form: args.form,
        score,
        reasons,
        visitor,
        name: args.fields.name.slice(0, 200),
        email: args.fields.email.slice(0, 200),
        message: (args.fields.message ?? "").slice(0, 4000) || null,
        row: args.row,
      });
      await db().delete(schema.leadSpam).where(sql`${schema.leadSpam.createdAt} < now() - make_interval(days => ${SPAM_KEEP_DAYS})`);
    } catch (e) {
      console.error("[spam] could not store blocked submission", e);
    }
  }
  return { spam: true };
}

// Fallback without database (local development): per-instance memory.
const hits = new Map<string, number[]>();
function memoryLimited(key: string) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < 60 * 60_000);
  arr.push(now);
  hits.set(key, arr);
  return arr.length > MAX_PER_HOUR;
}
