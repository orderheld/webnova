import "server-only";
import { and, asc, between, desc, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";
import type { Preview } from "@/db/schema";
import type { Locale } from "@/content/types";
import { previewFileBuffer } from "./previews";
import { captionMax, defaultProposal, fitCaption, type Proposal } from "./proposal";
import { customerName } from "./queries";

/* Data of the PDF proposal (Admin > Vorschauen > PDF-Vorschlag) that needs the database. */

/** Pictures of the preview offered for the cover and the collage (larger ones would bloat the PDF). */
export const MAX_PICTURE = 3 * 1024 * 1024;

export type ShotKind = "desktop" | "mobile";

/** Stored screenshots are named "desktop/03 Kollektion.jpg"; the caption is the part after the number. */
export const shotPath = (kind: ShotKind, i: number, caption: string) =>
  `${kind}/${String(i + 1).padStart(2, "0")}${caption ? ` ${caption.replace(/[/\\\u0000-\u001f]/g, " ").slice(0, 60).trim()}` : ""}.jpg`;
export const shotInfo = (path: string) => {
  const m = path.match(/^(desktop|mobile)\/(\d+) ?(.*)\.jpg$/);
  return m ? { kind: m[1] as ShotKind, n: Number(m[2]), caption: m[3] } : null;
};

/** At most `n` items, spread evenly from the first to the last (screenshot stops, preselected screenshots). */
export function spread<T>(items: T[], n: number): T[] {
  if (items.length <= n) return items;
  return Array.from({ length: n }, (_, i) => items[Math.round((i * (items.length - 1)) / (n - 1))]);
}


export const proposalLocale = (p: Pick<Preview, "language">): Locale => (p.language === "fr" ? "fr" : "de");

const pictureTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** Photos of the preview for the cover and the collage: pictures from 40 KB (no icons or logos), largest first. */
export async function previewPictures(p: Pick<Preview, "id" | "version">) {
  const f = schema.previewFiles;
  return db()
    .select({ id: f.id, path: f.path, size: f.size })
    .from(f)
    .where(and(eq(f.previewId, p.id), eq(f.kind, "site"), eq(f.version, p.version), inArray(f.contentType, pictureTypes), between(f.size, 40_000, MAX_PICTURE)))
    .orderBy(desc(f.size));
}

/** The stored screenshots, computer first, in page order. */
export async function previewShots(previewId: number) {
  const f = schema.previewFiles;
  const rows = await db()
    .select({ id: f.id, path: f.path })
    .from(f)
    .where(and(eq(f.previewId, previewId), eq(f.kind, "shot")))
    .orderBy(asc(f.path));
  return rows.flatMap((r) => {
    const info = shotInfo(r.path);
    return info ? [{ id: r.id, ...info }] : [];
  });
}

/** Screenshots preselected for the PDF: six of the computer, five of the phone, spread over the page. */
export function shotSelection(shots: { id: number; kind: "desktop" | "mobile"; caption: string }[]) {
  const of = (kind: "desktop" | "mobile", n: number) =>
    spread(shots.filter((s) => s.kind === kind), n).map((s) => ({ fileId: s.id, caption: fitCaption(s.caption, captionMax[kind]) }));
  return { desktop: of("desktop", 6), mobile: of("mobile", 5) };
}

/** "Herr Muster" is greeted, the cover says "Für Herrn Muster". */
const forName = (name: string, locale: Locale) => (locale === "de" ? name.trim().replace(/^Herr\s/, "Herrn ") : name.trim());

/**
 * A first proposal for a preview: the standard texts, the client's name, the preview's screenshots, a photo as cover
 * (one named like a poster or hero, else the largest) and up to five more photos for the collage.
 */
export async function initialProposal(p: Preview): Promise<Proposal> {
  const locale = proposalLocale(p);
  const [customer] = p.customerId ? await db().select().from(schema.customers).where(eq(schema.customers.id, p.customerId)) : [];
  const recipient = customer ? customerName(customer) : forName(p.contactName, locale);
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" });
  const proposal = defaultProposal(locale, { recipient, today });
  const [pictures, shots] = await Promise.all([previewPictures(p), previewShots(p.id)]);
  const landscape = pictures.filter((x) => !/portrait|mobile|hoch|vertical|story/i.test(x.path));
  const cover = landscape.find((x) => /poster|hero|cover|titel|header|banner/i.test(x.path)) ?? landscape[0];
  const selection = shotSelection(shots);
  proposal.desktop = selection.desktop;
  proposal.mobile = selection.mobile;
  proposal.cover.image = cover ? `site:${cover.path}` : selection.desktop[0] ? `shot:${selection.desktop[0].fileId}` : "";
  proposal.gallery.images = pictures
    .filter((x) => x !== cover && !/poster/i.test(x.path))
    .slice(0, 5)
    .map((x) => `site:${x.path}`);
  return proposal;
}

/** File name of the PDF, e.g. "MusterUhren_Vorschlag_Webauftritt.pdf" (it goes to the client only, never into a link). */
export function proposalFileName(p: Pick<Preview, "title" | "language">) {
  const name = p.title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "")
    .slice(0, 40);
  const suffix = proposalLocale(p) === "fr" ? "Proposition_site_web.pdf" : "Vorschlag_Webauftritt.pdf";
  return name ? `${name}_${suffix}` : suffix;
}

/** Screenshots and pictures the PDF uses, as data URLs by reference ("shot:12", "site:media/poster.jpg"). */
export async function proposalImages(preview: Pick<Preview, "id" | "version">, refs: string[]) {
  const f = schema.previewFiles;
  const shotIds = refs.filter((r) => r.startsWith("shot:")).map((r) => Number(r.slice(5)));
  const paths = refs.filter((r) => r.startsWith("site:")).map((r) => r.slice(5));
  const [shots, pictures] = await Promise.all([
    shotIds.length
      ? db()
          .select({ id: f.id, path: f.path, size: f.size, contentType: f.contentType })
          .from(f)
          .where(and(eq(f.previewId, preview.id), eq(f.kind, "shot"), inArray(f.id, shotIds)))
      : [],
    paths.length
      ? db()
          .select({ id: f.id, path: f.path, size: f.size, contentType: f.contentType })
          .from(f)
          .where(and(eq(f.previewId, preview.id), eq(f.kind, "site"), eq(f.version, preview.version), inArray(f.path, paths)))
      : [],
  ]);
  const images = new Map<string, string>();
  const add = async (ref: string, file: { id: number; size: number; contentType: string }) => {
    if (!file.contentType.startsWith("image/") || file.size > MAX_PICTURE) return;
    images.set(ref, `data:${file.contentType};base64,${(await previewFileBuffer(file.id)).toString("base64")}`);
  };
  await Promise.all([...shots.map((s) => add(`shot:${s.id}`, s)), ...pictures.map((p) => add(`site:${p.path}`, p))]);
  return images;
}
