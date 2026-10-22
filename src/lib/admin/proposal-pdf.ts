import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/content/types";
import { chf } from "@/content/pricing";
import { and, eq, max, ne } from "drizzle-orm";
import { db, schema } from "@/db";
import type { Preview } from "@/db/schema";
import { withBrowser } from "./browser";
import { PREVIEW_CHUNK } from "./preview-files";
import { accentParts, type Proposal, proposalDate, proposalLabels, proposalTotals } from "./proposal";
import { proposalFileName, proposalImages, proposalLocale } from "./proposal-server";
import { getSettings } from "./settings";

/*
 * The PDF proposal of a client preview, A4 landscape, in the look of the first hand-made one: HTML from the
 * proposal's texts, screenshots and price, printed by Chromium. Sections without content are left out and the
 * numbering follows. Fonts, portrait and logo are embedded, so the page loads nothing from outside.
 */

export type ProposalContact = { name: string; phone: string; email: string; web: string; address: string };

export type ProposalDoc = {
  locale: Locale;
  proposal: Proposal;
  /** data URLs of the pictures, by reference ("shot:12", "site:media/poster.jpg") */
  images: Map<string, string>;
  contact: ProposalContact;
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Headline with the words between asterisks in the accent colour. */
const head = (s: string) => accentParts(s).map((p) => (p.accent ? `<em>${esc(p.text)}</em>` : esc(p.text))).join("");

/** Paragraphs separated by an empty line. */
const paras = (s: string, cls = "body") =>
  s
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p class="${cls}">${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");

const list = (items: string[]) => `<ul class="dots">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;

let assetCache: Record<string, string> | null = null;

/** Fonts (Geist, SIL Open Font License), portrait and logo as data URLs. */
function assets() {
  if (assetCache) return assetCache;
  const dir = path.join(process.cwd(), "src/lib/admin/proposal-assets");
  const url = (file: string, type: string) => `data:${type};base64,${fs.readFileSync(path.join(dir, file)).toString("base64")}`;
  assetCache = {
    light: url("Geist-Light.woff2", "font/woff2"),
    regular: url("Geist-Regular.woff2", "font/woff2"),
    medium: url("Geist-Medium.woff2", "font/woff2"),
    semibold: url("Geist-SemiBold.woff2", "font/woff2"),
    mono: url("GeistMono-Regular.woff2", "font/woff2"),
    portrait: url("portrait.jpg", "image/jpeg"),
    logo: url("logo-light.svg", "image/svg+xml"),
  };
  return assetCache;
}

const filled = (s: string) => s.trim().length > 0;

export function proposalHtml({ locale, proposal: p, images, contact }: ProposalDoc) {
  const l = proposalLabels[locale];
  const a = assets();
  const date = proposalDate(locale, p.date);
  const validUntil = proposalDate(locale, p.date, p.validDays);
  const footerLabel = `Webnova · ${l.footer}`;
  const img = (ref: string) => images.get(ref);

  type Page = { cls: string; body: (n: number, header: (title: string, sub: string) => string) => string; numbered: boolean };
  const pages: Page[] = [];
  const section = (key: keyof typeof l.sections, cls: string, body: (header: string) => string, sub?: string) =>
    pages.push({
      cls,
      numbered: true,
      body: (n, header) => body(header(`${String(n).padStart(2, "0")} · ${l.sections[key][0]}`, sub ?? l.sections[key][1])),
    });

  // Cover
  const coverImage = img(p.cover.image);
  const titleSize = p.cover.title.length > 34 ? "small" : p.cover.title.length > 22 ? "mid" : "";
  pages.push({
    cls: `cover${coverImage ? "" : " plain"}`,
    numbered: false,
    body: () => `${coverImage ? `<img class="bg" src="${coverImage}" alt="">` : ""}<div class="shade"></div>
  <header class="hd"><span class="brandrow"><i class="dot"></i>${esc(l.kicker)}</span><span>${esc(date)}</span></header>
  <div class="cover-body">
    ${filled(p.recipient) ? `<span class="pill light">${esc(l.for)} ${esc(p.recipient)}</span>` : ""}
    <h1 class="${titleSize}">${head(p.cover.title)}</h1>
    ${filled(p.cover.text) ? `<p>${esc(p.cover.text)}</p>` : ""}
  </div>
  <footer class="ft"><span>Webnova</span><span>${esc(p.cover.note)}</span></footer>`,
  });

  // Ausgangslage
  // a box counts with its points; the prefilled box titles alone are no content
  const boxes = p.situation.boxes.filter((b) => b.items.some(filled));
  if (filled(p.situation.text) || boxes.length) {
    section("situation", "", (header) => `${header}
  <div class="content two">
    <div class="lead"><h2>${head(p.situation.title)}</h2>${paras(p.situation.text)}</div>
    <div class="grid2">${boxes.map((b) => `<div><h3>${esc(b.title)}</h3>${list(b.items.filter(filled))}</div>`).join("")}</div>
  </div>`);
  }

  // Konzept
  // the concept is its sections; the prefilled sentence alone is no content
  const steps = p.concept.steps.filter((x) => filled(x.title) || filled(x.text));
  if (steps.length) {
    const cols = steps.length <= 3 ? steps.length : steps.length === 6 ? 3 : 4;
    section("concept", "", (header) => `${header}
  <div class="content">
    <h2>${head(p.concept.title)}</h2>
    ${paras(p.concept.text, "body wide")}
    <div class="steps" style="grid-template-columns:repeat(${cols},1fr)">${steps
      .map((s, i) => `<div class="step"><span class="num"><b></b>${i + 1}</span><h4>${esc(s.title)}</h4><p>${esc(s.text)}</p></div>`)
      .join("")}</div>
  </div>`);
  }

  // Screenshots Computer
  const desktop = p.desktop.filter((s) => img(`shot:${s.fileId}`));
  if (desktop.length) {
    const n = desktop.length;
    const cols = n <= 3 ? n : n === 4 ? 2 : 3;
    const width = n === 1 ? "760px" : n === 4 ? "784px" : "100%";
    section("desktop", "", (header) => `${header}
  <div class="content">
    <div class="shots" style="grid-template-columns:repeat(${cols},1fr);max-width:${width}">${desktop
      .map((s) => `<figure><img src="${img(`shot:${s.fileId}`)}" alt="">${filled(s.caption) ? `<figcaption>${esc(s.caption)}</figcaption>` : ""}</figure>`)
      .join("")}</div>
    <p class="note">${esc(l.desktopNote)}</p>
  </div>`);
  }

  // Screenshots Handy
  const mobile = p.mobile.filter((s) => img(`shot:${s.fileId}`));
  if (mobile.length) {
    section("mobile", "cream", (header) => `${header}
  <div class="content">
    <div class="phones${mobile.length < 5 ? " few" : ""}">${mobile
      .map((s) => `<figure><div class="frame"><img src="${img(`shot:${s.fileId}`)}" alt=""></div>${filled(s.caption) ? `<figcaption>${esc(s.caption)}</figcaption>` : ""}</figure>`)
      .join("")}</div>
    <p class="note">${esc(l.mobileNote)}</p>
  </div>`);
  }

  // Bildwelt
  const gallery = p.gallery.images.map(img).filter((x): x is string => !!x);
  if (gallery.length) {
    section("gallery", "dark", (header) => `${header}
  <div class="content">
    <div class="collage n${gallery.length}">${gallery.map((src, i) => `<img class="c${i + 1}" src="${src}" alt="">`).join("")}</div>
    ${paras(p.gallery.text, "collage-note")}
  </div>`);
  }

  // Aufbau
  const groups = p.structure.groups.filter((g) => filled(g.title) || g.pages.some(filled));
  const pageCount = groups.reduce((n, g) => n + g.pages.filter(filled).length, 0);
  if (groups.length || p.structure.features.length) {
    let no = 0;
    section(
      "structure",
      "",
      (header) => `${header}
  <div class="content two">
    <div class="lead">
      <h2>${head(p.structure.title)}</h2>
      ${paras(p.structure.text)}
      ${p.structure.features.length ? `<h3 class="mt">${esc(l.features)}</h3>${list(p.structure.features.filter(filled))}` : ""}
    </div>
    <div class="grid2 sitemap">${groups
      .map(
        (g) =>
          `<div><h3>${esc(g.title)}</h3><ul>${g.pages
            .filter(filled)
            .map((x) => `<li><span class="no">${String(++no).padStart(2, "0")}</span>${esc(x)}</li>`)
            .join("")}</ul></div>`,
      )
      .join("")}</div>
  </div>`,
      pageCount ? l.structurePages(pageCount) : undefined,
    );
  }

  // Vorgehen
  if (p.plan.steps.length) {
    section(
      "plan",
      "",
      (header) => `${header}
  <div class="content">
    <h2>${head(p.plan.title)}</h2>
    <div class="weeks" style="grid-template-columns:repeat(${Math.max(p.plan.steps.length, 3)},1fr)">${p.plan.steps
      .map((s) => `<div class="step"><span class="week">${esc(s.when)}</span><h4>${esc(s.title)}</h4><p>${esc(s.text)}</p></div>`)
      .join("")}</div>
    ${filled(p.plan.need) ? `<p class="need"><strong>${esc(l.need)}</strong> ${esc(p.plan.need)}</p>` : ""}
  </div>`,
      p.plan.note,
    );
  }

  // Nach Ihrer Zusage
  if (p.after.cards.length) {
    section("after", "", (header) => `${header}
  <div class="content two narrow-lead">
    <div class="lead"><h2>${head(p.after.title)}</h2>${paras(p.after.text)}</div>
    <div class="grid2 cards">${p.after.cards.map((c) => `<div><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></div>`).join("")}</div>
  </div>`);
  }

  // Investition
  const { total, pay } = proposalTotals(p.price);
  const row = (label: string, value: string, cls = "") => `<tr class="${cls}"><td>${esc(label)}</td><td>${esc(value)}</td></tr>`;
  const fixed = p.price.fixPrice !== null;
  pages.push({
    cls: "",
    numbered: true,
    body: (n, header) => `${header(`${String(n).padStart(2, "0")} · ${l.sections.price[0]}`, l.sections.price[1])}
  <div class="content two invest">
    <div class="lead">
      <span class="pill">${esc(p.price.fixLabel)}</span>
      <div class="price">${esc(chf(pay))}</div>
      ${paras(p.price.text)}
      ${paras(p.price.payment)}
    </div>
    <div>
      <h3>${esc(l.calculation)}</h3>
      <table>${p.price.rows.map((r) => row(r.label, chf(r.amount))).join("")}${
        fixed ? row(l.totalList, chf(total), "sum") + row(p.price.fixLabel, chf(pay), "sum final") : row(l.total, chf(total), "sum final")
      }</table>
      ${p.price.optional.length ? `<h3 class="mt">${esc(l.optional)}</h3><table>${p.price.optional.map((r) => row(r.label, r.value)).join("")}</table>` : ""}
    </div>
  </div>`,
  });
  const priceFooter = `Webnova · ${l.valid(validUntil)} · ${l.allPrices}`;

  // Nächste Schritte
  pages.push({
    cls: "dark last",
    numbered: true,
    body: (n, header) => `${header(`${String(n).padStart(2, "0")} · ${l.sections.next[0]}`, l.sections.next[1])}
  <div class="content">
    <h2 class="big">${head(p.next.title)}</h2>
    <div class="steps3">${p.next.steps
      .filter(filled)
      .map((x, i) => `<div class="step"><span class="num">${i + 1}</span><p>${esc(x)}</p></div>`)
      .join("")}</div>
    <div class="contact">
      <img class="portrait" src="${a.portrait}" alt="${esc(contact.name)}">
      <div class="who"><div class="name">${esc(contact.name)}</div><div class="role">${esc(l.contact)}</div></div>
      <dl class="lines">
        <dt>${esc(l.phone)}</dt><dd><a href="tel:${esc(contact.phone.replace(/[^\d+]/g, ""))}">${esc(contact.phone)}</a></dd>
        <dt>${esc(l.email)}</dt><dd><a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></dd>
        <dt>${esc(l.web)}</dt><dd><a href="https://${esc(contact.web)}">${esc(contact.web)}</a></dd>
      </dl>
      <div class="brand"><img src="${a.logo}" alt="Webnova"><span>${esc(contact.address)}</span></div>
    </div>
  </div>`,
  });

  let number = 0;
  const html = pages
    .map((page, i) => {
      if (page.numbered) number++;
      const header = (title: string, sub: string) => `<header class="hd"><span>${esc(title)}</span><span>${esc(sub)}</span></header>`;
      const isPrice = i === pages.length - 2;
      const footer = page.numbered ? `<footer class="ft"><span>${esc(isPrice ? priceFooter : footerLabel)}</span><span>${i + 1}</span></footer>` : "";
      return `<section class="page ${page.cls}">${page.body(number, header)}${footer}</section>`;
    })
    .join("\n");

  return `<!doctype html><html lang="${locale === "fr" ? "fr-CH" : "de-CH"}"><head><meta charset="utf-8"><title>${esc(l.footer)}</title><style>${css(a, p.accent)}</style></head><body>${html}</body></html>`;
}

/** The finished PDF. */
export async function proposalPdf(doc: ProposalDoc): Promise<Buffer> {
  const html = proposalHtml(doc);
  return withBrowser(async (browser) => {
    const page = await browser.newPage();
    // Nothing to load from outside: every picture and font is in the HTML.
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (req.isInterceptResolutionHandled()) return;
      const url = req.url();
      if (url.startsWith("data:") || url === "about:blank") void req.continue();
      else void req.abort();
    });
    await page.setContent(html, { waitUntil: "load", timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);
    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true, timeout: 60_000 });
    return Buffer.from(pdf);
  });
}

/** Prints the proposal and stores it as the preview's PDF, replacing the one before (uploaded or made here). */
export async function createProposalPdf(p: Preview & { proposal: Proposal }) {
  const proposal = p.proposal;
  const refs = [proposal.cover.image, ...proposal.gallery.images, ...[...proposal.desktop, ...proposal.mobile].map((s) => `shot:${s.fileId}`)].filter(Boolean);
  const [images, s] = await Promise.all([proposalImages(p, refs), getSettings()]);
  const pdf = await proposalPdf({
    locale: proposalLocale(p),
    proposal,
    images,
    contact: { name: s.owner, phone: s.phone, email: s.email, web: s.website, address: `${s.street}, ${s.zip} ${s.city}` },
  });

  const f = schema.previewFiles;
  await db().transaction(async (tx) => {
    await tx.select({ id: schema.previews.id }).from(schema.previews).where(eq(schema.previews.id, p.id)).for("update");
    const [last] = await tx.select({ v: max(f.version) }).from(f).where(and(eq(f.previewId, p.id), eq(f.kind, "pdf")));
    const [file] = await tx
      .insert(f)
      .values({
        previewId: p.id,
        kind: "pdf",
        version: (last?.v ?? 0) + 1,
        path: proposalFileName(p),
        contentType: "application/pdf",
        size: pdf.length,
        chunkCount: Math.ceil(pdf.length / PREVIEW_CHUNK),
      })
      .returning({ id: f.id });
    for (let seq = 0; seq * PREVIEW_CHUNK < pdf.length; seq++) {
      await tx.insert(schema.previewChunks).values({ fileId: file.id, seq, data: pdf.subarray(seq * PREVIEW_CHUNK, (seq + 1) * PREVIEW_CHUNK) });
    }
    await tx.update(schema.previews).set({ pdfFileId: file.id, updatedAt: new Date() }).where(eq(schema.previews.id, p.id));
    await tx.delete(f).where(and(eq(f.previewId, p.id), eq(f.kind, "pdf"), ne(f.id, file.id)));
  });
  return { size: pdf.length };
}

function css(a: Record<string, string>, accent: string) {
  return `
@font-face{font-family:G;src:url(${a.light}) format("woff2");font-weight:300}
@font-face{font-family:G;src:url(${a.regular}) format("woff2");font-weight:400}
@font-face{font-family:G;src:url(${a.medium}) format("woff2");font-weight:500}
@font-face{font-family:G;src:url(${a.semibold}) format("woff2");font-weight:600}
@font-face{font-family:M;src:url(${a.mono}) format("woff2");font-weight:400}
@page{size:297mm 210mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
:root{--ink:#141312;--muted:#5b5650;--soft:#8e877e;--line:#e4dfd8;--rule:#cfc9c1;--accent:${accent};--light:color-mix(in oklab,${accent} 45%,#fff);--cream:#f6f4f0;--dark:#0c0b0a;--paper:#f2ece2}
html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:G,sans-serif;font-weight:400;font-size:13px;line-height:1.6;color:var(--ink);background:#fff;font-variant-numeric:lining-nums}
.page{width:297mm;height:210mm;position:relative;overflow:hidden;break-after:page;background:#fff}
.page:last-child{break-after:auto}
.hd{position:absolute;top:50px;left:68px;right:68px;display:flex;justify-content:space-between;align-items:center;gap:24px;padding-bottom:16px;border-bottom:1px solid var(--rule);font:400 9.6px/1 M,monospace;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
.ft{position:absolute;bottom:36px;left:68px;right:68px;display:flex;justify-content:space-between;gap:24px;font:400 8.6px/1 M,monospace;letter-spacing:.06em;color:var(--soft)}
.content{position:absolute;top:118px;left:68px;right:68px;bottom:80px}
h1,h2{font-weight:300;letter-spacing:-.025em}
h2{font-size:42px;line-height:1.04}
h2 em,h1 em{font-style:normal;color:var(--accent)}
h3{font-size:17px;font-weight:400;letter-spacing:-.01em;line-height:1.3}
h4{font-size:14.5px;font-weight:400;line-height:1.3;margin:6px 0}
.body{font-size:12.5px;line-height:1.65;color:var(--muted);margin-top:22px}
.body+.body{margin-top:12px}
.body.wide{max-width:900px;margin-top:16px}
.mt{margin-top:26px}
.pill{display:inline-block;font:400 8.8px/1 M,monospace;letter-spacing:.14em;text-transform:uppercase;border:1px solid var(--ink);border-radius:999px;padding:6px 12px}
ul{list-style:none}
.dots li{position:relative;padding-left:14px;font-size:11.6px;line-height:1.5;color:var(--muted);margin-top:7px}
.dots li::before{content:"";position:absolute;left:1px;top:.62em;width:4px;height:4px;border-radius:50%;background:var(--muted)}
.two{display:grid;grid-template-columns:400px 1fr;column-gap:58px}
.two .lead h2{max-width:390px}
.grid2{display:grid;grid-template-columns:1fr 1fr;column-gap:34px;row-gap:26px;align-content:start}
.grid2 h3{margin-bottom:2px}
.steps{display:grid;column-gap:30px;row-gap:30px;margin-top:34px}
.step{border-top:1px solid var(--ink);padding-top:12px}
.step .num{display:flex;align-items:center;gap:9px;font-size:24px;font-weight:300;line-height:1}
.step .num b{width:7px;height:7px;border-radius:50%;display:inline-block;background:var(--accent)}
.step p{font-size:11.3px;line-height:1.55;color:var(--muted)}
.shots{display:grid;column-gap:24px;row-gap:30px;margin:8px auto 0}
.shots img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top;border-radius:6px;border:1px solid var(--line)}
.note{position:absolute;left:0;right:0;bottom:0;font-size:12px;line-height:1.6;color:var(--muted);padding-top:14px;border-top:1px solid var(--line)}
figcaption{font:400 8.6px/1.3 M,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-top:10px}
.cream{background:var(--cream)}
.phones{display:flex;justify-content:space-between;margin-top:12px}
.phones.few{justify-content:center;gap:48px}
.phones figure{width:174px}
.frame{background:#141312;border-radius:26px;padding:7px;box-shadow:0 22px 40px -24px rgba(20,19,18,.55)}
.frame img{display:block;width:100%;height:362px;object-fit:cover;object-position:top;border-radius:20px}
.dark{background:var(--dark);color:var(--paper)}
.dark .hd{color:#cbbfae;border-color:color-mix(in oklab,var(--light) 50%,transparent)}
.dark .ft{color:#8d8374}
.dark h2 em{color:var(--light)}
.collage{display:grid;grid-template-rows:230px 230px;gap:12px}
.collage img{width:100%;height:100%;object-fit:cover;display:block;border-radius:4px}
.collage.n1{grid-template-columns:1fr}.collage.n1 .c1{grid-row:1/3}
.collage.n2{grid-template-columns:1fr 1fr}.collage.n2 img{grid-row:1/3}
.collage.n3{grid-template-columns:2fr 3fr}.collage.n3 .c1{grid-row:1/3}
.collage.n4{grid-template-columns:repeat(3,1fr)}.collage.n4 .c1{grid-row:1/3}.collage.n4 .c2{grid-column:2/4}
.collage.n5{grid-template-columns:repeat(4,1fr)}.collage.n5 .c1{grid-row:1/3}.collage.n5 .c2{grid-column:2/4}.collage.n5 .c5{grid-column:4;grid-row:1/3}
.collage-note{margin-top:20px;font-size:12px;line-height:1.6;color:#d6cdbf;max-width:860px}
.sitemap li{display:flex;gap:10px;font-size:11.8px;color:var(--muted);padding:7px 0;border-bottom:1px solid var(--line)}
.sitemap li .no{font:400 10px/1.7 M,monospace;color:var(--soft);min-width:16px}
.sitemap h3{border-top:1px solid var(--ink);padding-top:10px;margin-bottom:4px}
.weeks{display:grid;column-gap:30px;margin-top:38px}
.week{font-size:20px;font-weight:300;line-height:1.1}
.need{margin-top:40px;font-size:12.5px;color:var(--muted);max-width:860px}
.need strong{color:var(--ink);font-weight:500}
.narrow-lead{grid-template-columns:330px 1fr}
.cards{column-gap:36px;row-gap:28px}
.cards>div{border-top:1px solid var(--ink);padding-top:12px}
.cards p{font-size:11.5px;line-height:1.58;color:var(--muted);margin-top:6px}
.invest{grid-template-columns:360px 1fr;column-gap:70px}
.price{font-size:56px;font-weight:300;letter-spacing:-.03em;line-height:1;margin-top:26px}
.invest .body{margin-top:16px}
.invest .price+.body{margin-top:12px}
table{width:100%;border-collapse:collapse;margin-top:8px}
td{font-size:11.4px;line-height:1.45;padding:8px 0;border-bottom:1px solid var(--line);vertical-align:top}
td:last-child{text-align:right;white-space:nowrap;padding-left:28px}
tr.sum td{font-weight:600}
tr.final td{color:var(--accent);border-bottom-color:var(--ink)}
.big{font-size:54px;line-height:1.04;max-width:820px;margin-top:10px}
.steps3{display:grid;grid-template-columns:repeat(3,1fr);column-gap:34px;margin-top:46px}
.dark .step{border-color:rgba(242,236,226,.35)}
.dark .step p{color:#d6cdbf;font-size:12.2px;margin-top:10px}
.contact{position:absolute;left:0;right:0;bottom:0;display:grid;grid-template-columns:92px 210px 1fr auto;column-gap:26px;align-items:end;border-top:1px solid color-mix(in oklab,var(--light) 50%,transparent);padding-top:22px}
.portrait{width:92px;height:115px;object-fit:cover;object-position:center top;border-radius:10px;display:block}
.name{font-size:24px;font-weight:300;letter-spacing:-.015em;line-height:1.1}
.role{font:400 9px/1 M,monospace;letter-spacing:.16em;text-transform:uppercase;color:var(--light);margin-top:10px}
.lines{display:grid;grid-template-columns:auto 1fr;column-gap:16px;row-gap:5px;font-size:12.2px}
.lines dt{font:400 8.6px/2.1 M,monospace;letter-spacing:.14em;text-transform:uppercase;color:#a99e8e}
.lines a{color:var(--paper);text-decoration:none}
.brand{display:flex;flex-direction:column;align-items:flex-end;gap:9px}
.brand img{height:22px;width:auto;display:block}
.brand span{font:400 8.6px/1 M,monospace;letter-spacing:.08em;color:#a99e8e}
.cover{background:var(--dark);color:var(--paper)}
.cover .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cover .shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,9,8,.8) 0%,rgba(10,9,8,.55) 50%,rgba(10,9,8,.3) 100%),linear-gradient(0deg,rgba(10,9,8,.55) 0%,rgba(10,9,8,0) 45%)}
.cover.plain .shade{background:radial-gradient(120% 90% at 85% 10%,color-mix(in oklab,var(--accent) 55%,transparent) 0%,transparent 60%),radial-gradient(80% 70% at 0% 100%,color-mix(in oklab,var(--accent) 25%,transparent) 0%,transparent 70%)}
.cover .hd{color:#e6dccb;border-color:color-mix(in oklab,var(--light) 60%,transparent)}
.cover .ft{color:#cbbfae;font-size:8.8px;letter-spacing:.14em;text-transform:uppercase}
.brandrow{display:flex;align-items:center;gap:12px}
.brandrow .dot{width:7px;height:7px;border-radius:50%;display:block;background:var(--light)}
.cover-body{position:absolute;left:68px;bottom:118px;max-width:680px}
.pill.light{border-color:var(--light);color:#efe3cc}
.cover h1{font-size:108px;line-height:1;margin-top:26px;letter-spacing:-.035em}
.cover h1.mid{font-size:84px}
.cover h1.small{font-size:64px}
.cover h1 em{color:var(--light)}
.cover p{font-size:15.5px;line-height:1.6;color:#ece4d6;margin-top:26px;max-width:520px}
`;
}
