import "server-only";
import { sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { addDaysIso, todayIso } from "./money";

/*
 * Postcard campaign to newly registered companies (Ferhat, 2026-10-12, after nordpixel.ch): every Monday the
 * admin reads last week's new entries in the commercial register from the Swiss Official Gazette of Commerce
 * (SHAB, rubric HR01, public API, no key), keeps the companies that plausibly need a website and stores up to
 * 100 of them. Ferhat prints their address labels (api/admin/postkarten/etiketten), sticks them on the A6 cards
 * and marks them as sent in Admin > Postkarten.
 */

const API = "https://www.shab.ch/api/v1/publications";
export const WEEKLY_LIMIT = 100;

/** eCH-0097 legal forms that get a card: sole proprietorship, partnerships, AG, GmbH, cooperative. */
export const legalForms: Record<string, string> = {
  "0101": "Einzelunternehmen",
  "0103": "Kollektivgesellschaft",
  "0104": "Kommanditgesellschaft",
  "0106": "AG",
  "0107": "GmbH",
  "0108": "Genossenschaft",
};

/** Companies that rarely need a website of their own: holdings, investment and property vehicles, branches. */
const SKIP_NAME =
  /holding|invest|capital|kapital|beteiligung|participation|vermögen|patrimoine|asset|immobili|immo\b|propert|real estate|realestate|trust|family office|fund|fonds|finanz|finance|leasing|succursale|zweigniederlassung|filiale|in liquidation|en liquidation/i;

/** Webdesign, IT and marketing agencies are competitors, not customers. */
const COMPETITOR = /web|digital|software|informatik|informatique|\bIT\b|marketing|media|médias|grafik|graphi|werbe|agentur|agency|\bseo\b|\bapps?\b/i;

/** Local trades and services that live from being found online. Matched against name and purpose. */
const LOCAL_TRADE = new RegExp(
  [
    "coiffeu|coiffure|friseur|barber|kosmetik|cosmétique|esthéti|beauty|beauté|nagel|ongl|massage|wellness|spa\\b",
    "physio|therap|praxis|cabinet|osteopath|ostéopath|ernährung|nutrition|zahn|dentaire|hebamme|pflege|soins",
    "restaurant|gastro|café|cafe|bistro|bar\\b|pizzeria|kebab|take.?away|bäckerei|boulangerie|konditorei|pâtisserie|metzgerei|boucherie|catering|traiteur|hotel|hôtel",
    "garage|carrosserie|autohandel|occasion|reifen|pneu|fahrschule|auto-école|taxi|transport|umzug|déménagement|kurier|logisti",
    "maler|gipser|peinture|plâtr|bau\\b|bauunternehm|construction|maçonn|schreiner|menuiser|zimmerei|charpent|elektro|électri|sanitär|sanitaire|heizung|chauffage|haustechnik|dachdeck|toiture|fenster|boden|carrelage|plattenleg|küchen|cuisine",
    "garten|jardin|paysag|reinigung|nettoyage|hauswart|conciergerie|facility|schlüssel|serrur",
    "fitness|yoga|pilates|sport|tanz|danse|coaching|nachhilfe|schule|école|kita|crèche|hunde|chien|tierarzt|vétérin",
    "fotogra|photogra|event|hochzeit|mariage|blumen|fleur|boutique|laden|shop|épicerie|mode\\b|bijou|schmuck|optik|optique",
    "treuhand|fiduciaire|buchhaltung|comptab|versicherung|assurance|anwalt|avocat|notar|architekt|architect|ingenieur|ingénieur|immobilienmakler|courtage",
  ].join("|"),
  "i",
);

export interface Candidate {
  shabId: string;
  uid: string;
  name: string;
  legalForm: string;
  street: string;
  zip: string;
  town: string;
  canton: string;
  language: "de" | "fr";
  purpose: string;
  publishedOn: string;
  score: number;
}

/** Monday to Sunday of the last complete week (Zurich time) and its ISO week label, e.g. "2026-W41". */
export function lastWeek(today = todayIso()) {
  const dow = (new Date(`${today}T12:00:00Z`).getUTCDay() + 6) % 7; // Monday = 0
  const start = addDaysIso(today, -dow - 7);
  return { start, end: addDaysIso(start, 6), week: isoWeek(start) };
}

export function isoWeek(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7)); // Thursday of this week decides the year
  const n = Math.ceil(((d.getTime() - Date.UTC(d.getUTCFullYear(), 0, 1)) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(n).padStart(2, "0")}`;
}

/** "2026-W41" -> "KW 41 · 05.10.–11.10.2026" */
export function weekLabel(week: string) {
  const [y, w] = week.split("-W").map(Number);
  const jan4 = new Date(Date.UTC(y, 0, 4, 12));
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() + 6) % 7) + (w - 1) * 7);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  const f = (d: Date, year = false) =>
    `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${year ? d.getUTCFullYear() : ""}`;
  return `KW ${w} · ${f(monday)}–${f(sunday, true)}`;
}

async function getJson<T>(url: string): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(20_000) });
      if (!res.ok) throw new Error(`SHAB ${res.status}`);
      return (await res.json()) as T;
    } catch (err) {
      if (attempt >= 2) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
}

async function getText(url: string): Promise<string | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
      if (res.ok) return await res.text();
      if (res.status === 404) return null;
    } catch {
      /* retried below */
    }
    await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
  }
  return null;
}

interface ListItem {
  meta: { id: string; language: string; cantons: string[]; publicationDate: string; title: { de: string } };
}

/** All HR01 publications of the period. The API does not sort stably, so pages are merged by id. */
async function listNewEntries(start: string, end: string) {
  const size = 200;
  const byId = new Map<string, ListItem>();
  let total = Infinity;
  for (let page = 0; page * size < total && page < 30; page++) {
    const q = new URLSearchParams({
      publicationStates: "PUBLISHED",
      subRubrics: "HR01",
      "pageRequest.page": String(page),
      "pageRequest.size": String(size),
      "publicationDate.start": start,
      "publicationDate.end": end,
    });
    const data = await getJson<{ content: ListItem[]; total: number }>(`${API}?${q}`);
    total = data.total;
    for (const item of data.content) byId.set(item.meta.id, item);
  }
  return [...byId.values()];
}

const tag = (xml: string, name: string) => {
  const m = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1].trim()) : "";
};
const decode = (s: string) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");

/** Reads one HR01 export and scores the company; null when it does not get a card. */
export function parseEntry(xml: string, item: ListItem): Candidate | null {
  const company = tag(xml, "company");
  const address = tag(company, "address");
  const legalForm = tag(company, "legalForm");
  const name = tag(company, "name");
  const uid = tag(company, "uid");
  const text = tag(xml, "publicationText");
  const purpose = tag(xml, "purpose");
  if (!name || !uid || !address || tag(company, "noAddress") === "true") return null;
  if (!legalForms[legalForm]) return null;
  if (SKIP_NAME.test(name)) return null;
  // Domicile addresses (c/o a trust company or lawyer): the card would not reach the founders.
  if (/\bc\/o\b/i.test(text.split(uid)[1]?.slice(0, 150) ?? "")) return null;

  const zip = tag(address, "swissZipCode");
  const town = tag(address, "town");
  const box = tag(address, "postOfficeBox") ? tag(address, "postOfficeBoxText") || `Postfach ${tag(address, "postOfficeBoxNumber")}`.trim() : "";
  const street = [tag(address, "street"), tag(address, "houseNumber")].filter(Boolean).join(" ") || box;
  if (!zip || !town || !street) return null;

  let score = 0;
  if (legalForm === "0101") score += 3; // the owner reads the mail himself and usually has no website yet
  else if (legalForm === "0107" || legalForm === "0103" || legalForm === "0104") score += 2;
  if (LOCAL_TRADE.test(name)) score += 4;
  else if (LOCAL_TRADE.test(purpose)) score += 2;
  if (COMPETITOR.test(name)) score -= 6;
  else if (COMPETITOR.test(purpose.slice(0, 160))) score -= 2;
  if (/consult|beratung|conseil|management|solutions|services|trading|handel|commerce|import|export/i.test(name)) score -= 1;

  return {
    shabId: item.meta.id,
    uid,
    name,
    legalForm,
    street,
    zip,
    town,
    canton: item.meta.cantons[0] ?? "",
    language: item.meta.language === "fr" ? "fr" : "de",
    purpose: purpose.slice(0, 600),
    publishedOn: item.meta.publicationDate.slice(0, 10),
    score,
  };
}

/** Runs `fn` over the items with at most `limit` in flight. */
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    }),
  );
  return out;
}

/** Quick pre-filter on the list title ("Neueintragung Kägi Reinigungen AG, Baar") before the details are loaded. */
function plausible(item: ListItem) {
  if (item.meta.language !== "de" && item.meta.language !== "fr") return false;
  const title = item.meta.title.de.replace(/^Neueintragung\s+/, "");
  return !SKIP_NAME.test(title);
}

/** The best companies of the period, already-known UIDs excluded. */
export async function findCandidates(start: string, end: string, known: Set<string>, limit = WEEKLY_LIMIT) {
  const list = (await listNewEntries(start, end)).filter(plausible);
  const parsed = await mapLimit(list, 16, async (item) => {
    const xml = await getText(`${API}/${item.meta.id}/xml`);
    return xml ? parseEntry(xml, item) : null;
  });
  const seen = new Set(known);
  const picked = parsed
    .filter((c): c is Candidate => !!c && c.score > -2)
    .sort((a, b) => b.score - a.score || b.publishedOn.localeCompare(a.publishedOn) || a.name.localeCompare(b.name))
    .filter((c) => (seen.has(c.uid) ? false : (seen.add(c.uid), true)))
    .slice(0, limit);
  return { published: list.length, picked };
}

export type ImportResult = { week: string; added: number; existing: number; published: number };

/**
 * Stores the list for the last complete week. Runs again harmlessly: a week that already has its list is left
 * alone, and the unique UID keeps every company on one list only.
 */
export async function importLastWeek(today = todayIso()): Promise<ImportResult> {
  const { start, end, week } = lastWeek(today);
  const t = schema.postcardRecipients;
  const [{ n }] = await db()
    .select({ n: sql<number>`count(*)::int` })
    .from(t)
    .where(sql`${t.week} = ${week}`);
  if (n > 0) return { week, added: 0, existing: n, published: 0 };
  const known = new Set((await db().select({ uid: t.uid }).from(t)).map((r) => r.uid));
  const { published, picked } = await findCandidates(start, end, known);
  if (picked.length) {
    await db()
      .insert(t)
      .values(picked.map((c) => ({ ...c, week })))
      .onConflictDoNothing();
  }
  return { week, added: picked.length, existing: 0, published };
}
