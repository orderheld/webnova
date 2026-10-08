import "server-only";
import fs from "node:fs";
import path from "node:path";
import { and, asc, eq } from "drizzle-orm";
import PDFDocument from "pdfkit";
import { SwissQRBill } from "swissqrbill/pdf";
import { calculateQRReferenceChecksum, isQRIBAN } from "swissqrbill/utils";
import { db, schema } from "@/db";
import type { Customer, InvoiceReminder, LineItem, Payment } from "@/db/schema";
import { intervalLabels } from "./labels";
import { chf, computeTotals, daysBetween, fmtDate, lineTotal, oneTimeItems, recurringItems, round2 } from "./money";
import { getSettings, type CompanySettings } from "./settings";

/*
 * Document layout modelled on the Bexio standard template (A4, Swiss left window envelope):
 * logo top left, sender line and recipient in the address window, document info on the right,
 * bold title, positions table, totals, closing text, company details in a footer on every page
 * and the QR-bill on its own last page of invoices.
 */

const MM = 72 / 25.4;
const PAGE_W = 210 * MM;
const PAGE_H = 297 * MM;
const LEFT = 22 * MM;
const RIGHT = PAGE_W - 15 * MM;
const WIDTH = RIGHT - LEFT;
/** top of the footer rule */
const FOOTER_Y = PAGE_H - 19 * MM;
/** content must end above this line */
const CONTENT_BOTTOM = FOOTER_Y - 7 * MM;
/** with the QR-bill (105 mm) the footer moves up above the perforation */
const QR_TOP = PAGE_H - SwissQRBill.height;
const QR_FOOTER_Y = QR_TOP - 12 * MM;
const QR_CONTENT_BOTTOM = QR_FOOTER_Y - 2 * MM;

/* Corporate design (globals.css): ink, soft ink, muted grey, hairlines, Schieferblau and its lighter logo blue. */
const INK = "#1c232b";
const TEXT = "#3a434d";
const MUTED = "#646b73";
const RULE = "#d9e0e7";
const ACCENT = "#24405a";
const BRIGHT = "#3b6385";
const TINT = "#e9eff4";

/*
 * Inter (body) and Inter Tight (headings) as on the website: static instances of the site's
 * variable woff2 files in ./fonts. Falls back to Helvetica if the files are not deployed.
 * The QR-bill keeps its own Helvetica, as the Swiss QR-bill style guide requires.
 */
const F = { regular: "Helvetica", bold: "Helvetica-Bold", display: "Helvetica-Bold" };
let fontFiles: { regular: Buffer; bold: Buffer; display: Buffer } | null | undefined;
function loadFonts() {
  if (fontFiles === undefined) {
    try {
      const dir = path.join(process.cwd(), "src/lib/admin/fonts");
      fontFiles = {
        regular: fs.readFileSync(path.join(dir, "Inter-Regular.ttf")),
        bold: fs.readFileSync(path.join(dir, "Inter-SemiBold.ttf")),
        display: fs.readFileSync(path.join(dir, "InterTight-SemiBold.ttf")),
      };
    } catch {
      fontFiles = null;
    }
  }
  return fontFiles;
}
function registerFonts(pdf: Pdf) {
  const f = loadFonts();
  if (!f) return;
  pdf.registerFont("WN-Regular", f.regular);
  pdf.registerFont("WN-Bold", f.bold);
  pdf.registerFont("WN-Display", f.display);
  F.regular = "WN-Regular";
  F.bold = "WN-Bold";
  F.display = "WN-Display";
}

export type PdfKind = "quote" | "invoice" | "reminder";

interface Doc {
  kind: "quote" | "invoice" | "credit" | "reminder";
  number: string;
  title: string;
  intro: string | null;
  outro: string | null;
  items: LineItem[];
  discountPercent: number;
  vatRate: number;
  issueDate: string;
  secondDate: string | null; // valid until / due date
  customer: Customer;
  contactName?: string;
  projectName?: string;
  payments?: Payment[];
  reminder?: InvoiceReminder;
  /** invoice the credit note or reminder refers to */
  refNumber?: string;
  refDate?: string;
  total: number;
  paidAmount: number;
}

export async function renderDocumentPdf(kind: PdfKind, id: number) {
  const d = db();
  let doc: Doc | undefined;
  let projectId: number | null = null;
  const [s, reminder] = await Promise.all([
    getSettings(),
    kind === "reminder" ? d.select().from(schema.invoiceReminders).where(eq(schema.invoiceReminders.id, id)).then((r) => r[0]) : Promise.resolve(undefined),
  ]);
  if (kind === "quote") {
    const [row] = await d
      .select({ q: schema.quotes, c: schema.customers })
      .from(schema.quotes)
      .innerJoin(schema.customers, eq(schema.customers.id, schema.quotes.customerId))
      .where(eq(schema.quotes.id, id));
    if (!row) return null;
    doc = { kind, ...row.q, secondDate: row.q.validUntil, customer: row.c, paidAmount: 0 };
    projectId = row.q.projectId;
  } else {
    if (kind === "reminder" && !reminder) return null;
    const invoiceId = reminder ? reminder.invoiceId : id;
    const [row] = await d
      .select({ i: schema.invoices, c: schema.customers })
      .from(schema.invoices)
      .innerJoin(schema.customers, eq(schema.customers.id, schema.invoices.customerId))
      .where(eq(schema.invoices.id, invoiceId));
    if (!row) return null;
    const { i: inv, c } = row;
    projectId = inv.projectId;
    const [payments, orig] = await Promise.all([
      d.select().from(schema.payments).where(eq(schema.payments.invoiceId, inv.id)).orderBy(asc(schema.payments.date)),
      inv.creditForId
        ? d.select({ number: schema.invoices.number, issueDate: schema.invoices.issueDate }).from(schema.invoices).where(eq(schema.invoices.id, inv.creditForId)).then((r) => r[0])
        : Promise.resolve(undefined),
    ]);
    if (reminder) {
      doc = {
        ...inv,
        kind: "reminder",
        reminder,
        refNumber: inv.number,
        refDate: inv.issueDate,
        secondDate: reminder.dueDate,
        issueDate: reminder.date,
        customer: c,
        payments,
        intro: reminder.level >= 2 ? s.reminderText2 : s.reminderText1,
        outro: null,
      };
    } else {
      doc = {
        ...inv,
        kind: inv.kind === "gutschrift" ? "credit" : "invoice",
        secondDate: inv.dueDate,
        customer: c,
        payments,
        refNumber: orig?.number,
        refDate: orig?.issueDate,
      };
    }
  }
  const [contact, project] = await Promise.all([
    d
      .select({ firstName: schema.contacts.firstName, lastName: schema.contacts.lastName })
      .from(schema.contacts)
      .where(and(eq(schema.contacts.customerId, doc.customer.id), eq(schema.contacts.isPrimary, true)))
      .orderBy(asc(schema.contacts.id))
      .limit(1)
      .then((r) => r[0]),
    projectId ? d.select({ name: schema.projects.name }).from(schema.projects).where(eq(schema.projects.id, projectId)).then((r) => r[0]) : Promise.resolve(undefined),
  ]);
  if (contact) doc.contactName = [contact.firstName, contact.lastName].filter(Boolean).join(" ");
  doc.projectName = project?.name;
  const buffer = await buildPdf(doc, s);
  const filename = doc.kind === "reminder" ? `${doc.reminder!.level}-Mahnung-${doc.number}` : doc.number;
  return { buffer, number: doc.number, filename };
}

function splitStreet(street: string | null | undefined) {
  const m = (street ?? "").match(/^(.*?)\s+(\d+\w*)$/);
  return m ? { address: m[1], buildingNumber: m[2] } : { address: street ?? "", buildingNumber: undefined };
}

const docLabel = (d: Doc) =>
  d.kind === "quote"
    ? "Offerte"
    : d.kind === "credit"
      ? "Gutschrift"
      : d.kind === "reminder"
        ? d.reminder!.level >= 2
          ? `${d.reminder!.level}. Mahnung`
          : "Zahlungserinnerung"
        : "Rechnung";

const fmtQty = (n: number) => {
  const x = Number(n) || 0;
  return x.toLocaleString("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
const fmtIban = (iban: string) => iban.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
/** Customer numbers start at 10001 (id 1), so they never read like a first customer. */
export const customerNumber = (id: number) => String(10000 + id);

type Pdf = PDFKit.PDFDocument;

function buildPdf(d: Doc, s: CompanySettings): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const label = docLabel(d);
    const pdf = new PDFDocument({
      size: "A4",
      bufferPages: true,
      margins: { top: 20 * MM, bottom: PAGE_H - CONTENT_BOTTOM, left: LEFT, right: PAGE_W - RIGHT },
      info: { Title: `${label} ${d.number}`, Author: s.companyName, Creator: s.companyName },
    });
    const chunks: Buffer[] = [];
    pdf.on("data", (c: Buffer) => chunks.push(c));
    pdf.on("end", () => resolve(Buffer.concat(chunks)));
    pdf.on("error", reject);
    registerFonts(pdf);

    const headline = d.kind === "reminder" ? label : `${label} ${d.number}`;
    /** starts a continuation page and returns the y to continue at */
    const newPage = () => {
      pdf.addPage();
      pdf.font(F.regular).fontSize(8).fillColor(MUTED).text(`${headline} · ${d.title}`, LEFT, 15 * MM, { width: WIDTH - 35 * MM, lineBreak: false, ellipsis: true });
      return 24 * MM;
    };
    const ensure = (y: number, h: number) => (y + h > CONTENT_BOTTOM ? newPage() : y);

    /* ── Letterhead: logo top left ── */
    const logo = logoImage();
    if (logo) pdf.image(logo, LEFT, 14 * MM, { width: 44 * MM });
    else pdf.font(F.display).fontSize(18).fillColor(INK).text(s.companyName, LEFT, 15 * MM);

    /* ── Address window (left, C5/DL): sender line + recipient ── */
    const winY = 45 * MM;
    const winW = 85 * MM;
    pdf
      .font(F.regular)
      .fontSize(7)
      .fillColor(MUTED)
      .text([s.companyName, s.street, `${s.zip} ${s.city}`].filter((x) => x.trim()).join(", "), LEFT, winY, { width: winW, lineBreak: false, ellipsis: true });
    pdf
      .moveTo(LEFT, winY + 3.6 * MM)
      .lineTo(LEFT + Math.min(winW, pdf.widthOfString([s.companyName, s.street, `${s.zip} ${s.city}`].join(", "))), winY + 3.6 * MM)
      .strokeColor(RULE)
      .lineWidth(0.4)
      .stroke();
    const c = d.customer;
    const person = d.contactName || [c.firstName, c.lastName].filter(Boolean).join(" ");
    const addr = [
      c.company,
      c.company && person ? person : !c.company ? person : "",
      c.street,
      [c.zip, c.city].filter(Boolean).join(" "),
      c.country && c.country !== "CH" ? c.country : "",
    ]
      .filter(Boolean)
      .join("\n");
    pdf.font(F.regular).fontSize(10).fillColor(INK).text(addr, LEFT, winY + 6 * MM, { width: winW, lineGap: 1.5 });

    /* ── Document info block (right of the window) ── */
    const info: [string, string][] = [];
    const nrLabel = d.kind === "quote" ? "Offertnummer" : d.kind === "credit" ? "Gutschriftnummer" : "Rechnungsnummer";
    info.push([nrLabel, d.number]);
    info.push(["Datum", fmtDate(d.issueDate)]);
    if (d.kind === "quote" && d.secondDate) info.push(["Gültig bis", fmtDate(d.secondDate)]);
    if (d.kind === "invoice") info.push(["Zahlbar bis", fmtDate(d.secondDate)]);
    if (d.kind === "reminder") info.push(["Neue Frist", fmtDate(d.secondDate)]);
    if (d.kind === "credit" && d.refNumber) info.push(["Zu Rechnung", d.refNumber]);
    info.push(["Kundennummer", customerNumber(c.id)]);
    if (s.owner) info.push(["Ansprechpartner", s.owner]);
    if (d.projectName) info.push(["Projekt", d.projectName]);
    const infoX = 118 * MM;
    const infoValX = infoX + 30 * MM;
    let iy = winY + 6 * MM;
    for (const [k, v] of info) {
      pdf.font(F.regular).fontSize(8.5).fillColor(MUTED).text(k, infoX, iy, { width: 29 * MM, lineBreak: false });
      pdf.font(F.regular).fontSize(8.5).fillColor(INK).text(v, infoValX, iy, { width: RIGHT - infoValX });
      iy = Math.max(iy + 4.2 * MM, pdf.y + 1);
    }

    /* ── Title ── */
    let y = Math.max(85 * MM, iy + 6 * MM);
    pdf.font(F.display).fontSize(16).fillColor(INK).text(headline, LEFT, y, { width: WIDTH });
    y = pdf.y + 1.2 * MM;
    if (d.title) {
      pdf.font(F.bold).fontSize(10).fillColor(BRIGHT).text(d.title, LEFT, y, { width: WIDTH });
      y = pdf.y;
    }
    if (d.intro) {
      y += 4 * MM;
      pdf.font(F.regular).fontSize(9.5).fillColor(TEXT).text(d.intro, LEFT, y, { width: WIDTH, lineGap: 1.5 });
      y = pdf.y;
    }

    const t = computeTotals(d.items, d.discountPercent, d.vatRate);
    let qrAmount = t.total;

    if (d.kind === "reminder") {
      const paid = round2(d.payments?.reduce((a, p) => a + p.amount, 0) ?? d.paidAmount);
      const fee = d.reminder!.fee;
      const open = round2(d.total - paid + fee);
      qrAmount = open;
      y += 7 * MM;
      const rows: TotalRow[] = [{ k: `Rechnung ${d.refNumber} vom ${fmtDate(d.refDate)}: ${d.title}`, v: chf(d.total) }];
      if (paid > 0) rows.push({ k: "Bereits bezahlt", v: `-${chf(paid)}` });
      if (fee > 0) rows.push({ k: "Mahngebühr", v: chf(fee) });
      rows.push({ k: "Offener Betrag CHF", v: chf(open), strong: true });
      y = totalsBlock(pdf, rows, y, LEFT);
    } else {
      y += 6 * MM;
      y = itemsTable(pdf, oneTimeItems(d.items), y, newPage);

      const rows: TotalRow[] = [];
      const hasDiscount = d.discountPercent > 0;
      if (hasDiscount || d.vatRate > 0) rows.push({ k: "Zwischentotal", v: chf(t.subtotal) });
      if (hasDiscount) rows.push({ k: `Rabatt ${fmtPct(d.discountPercent)}%`, v: `-${chf(t.discount)}` });
      if (hasDiscount && d.vatRate > 0) rows.push({ k: "Total exkl. MWST", v: chf(t.net) });
      if (d.vatRate > 0) rows.push({ k: `MWST ${fmtPct(d.vatRate)}% auf CHF ${chf(t.net)}`, v: chf(t.vat) });
      const rounding = round2(t.total - t.net - t.vat);
      if (Math.abs(rounding) >= 0.01) rows.push({ k: "Rundung", v: chf(rounding) });
      rows.push({ k: d.kind === "credit" ? "Gutschrift CHF" : d.vatRate > 0 ? "Total inkl. MWST CHF" : "Total CHF", v: chf(t.total), strong: true });
      const paid = round2(d.payments?.reduce((a, p) => a + p.amount, 0) ?? 0);
      if (d.kind === "invoice" && paid > 0 && paid < t.total) {
        rows.push({ k: "Bereits bezahlt", v: `-${chf(paid)}` });
        rows.push({ k: "Restbetrag CHF", v: chf(round2(t.total - paid)), strong: true });
        qrAmount = round2(t.total - paid);
      }
      y = ensure(y + 2 * MM, rows.length * 5.5 * MM + 8 * MM);
      y = totalsBlock(pdf, rows, y + 2 * MM, 105 * MM);
      if (!s.vatEnabled && d.vatRate === 0) {
        pdf.font(F.regular).fontSize(7.5).fillColor(MUTED).text("Nicht mehrwertsteuerpflichtig.", 105 * MM, y, { width: RIGHT - 105 * MM, align: "right" });
        y = pdf.y;
      }

      // Recurring fees (quotes only, not part of the total)
      const rec = d.kind === "quote" ? recurringItems(d.items) : [];
      if (rec.length) {
        y = ensure(y + 7 * MM, 32 * MM);
        pdf.font(F.display).fontSize(11).fillColor(INK).text("Wiederkehrende Kosten", LEFT, y);
        y = pdf.y + 0.5 * MM;
        pdf.font(F.regular).fontSize(8).fillColor(MUTED).text("Nicht im Total enthalten. Verrechnung jeweils im Voraus, zuzüglich allfälliger MWST.", LEFT, y, { width: WIDTH });
        y = pdf.y + 4.6 * MM;
        pdf.save().rect(LEFT, y - 1.6 * MM, WIDTH, 6.2 * MM).fill(TINT).restore();
        pdf.font(F.bold).fontSize(7.5).fillColor(ACCENT);
        pdf.text("Beschreibung", LEFT + 1.5 * MM, y, { lineBreak: false });
        pdf.text("Intervall", RIGHT - 60 * MM, y, { width: 28 * MM, lineBreak: false });
        pdf.text("Betrag CHF", RIGHT - 31.5 * MM, y, { width: 30 * MM, align: "right", lineBreak: false });
        y += 6.6 * MM;
        for (const it of rec) {
          const note = it.firstYearIncluded ? "1. Jahr im Projektpreis inbegriffen, Verrechnung ab dem 2. Jahr" : "Verrechnung ab Projektstart";
          const descr = [it.description, note].filter(Boolean).join("\n");
          const w = WIDTH - 62 * MM;
          pdf.font(F.bold).fontSize(9);
          const h = pdf.heightOfString(it.title, { width: w }) + pdf.font(F.regular).fontSize(8).heightOfString(descr, { width: w }) + 3 * MM;
          y = ensure(y, h);
          pdf.font(F.bold).fontSize(9).fillColor(INK).text(it.title, LEFT, y, { width: w });
          const ty = pdf.y;
          pdf.font(F.regular).fontSize(9).fillColor(INK);
          pdf.text(intervalLabels[it.recurring!] ?? "", RIGHT - 60 * MM, y, { width: 28 * MM });
          pdf.text(chf(lineTotal(it)), RIGHT - 30 * MM, y, { width: 30 * MM, align: "right" });
          pdf.font(F.regular).fontSize(8).fillColor(MUTED).text(descr, LEFT, ty + 0.5, { width: w });
          y = pdf.y + 2 * MM;
          pdf.moveTo(LEFT, y).lineTo(RIGHT, y).strokeColor(RULE).lineWidth(0.4).stroke();
          y += 2 * MM;
        }
      }
    }

    /* ── Payment terms, closing text, greeting ── */
    if (d.kind === "invoice" && d.secondDate) {
      const days = daysBetween(d.issueDate, d.secondDate);
      y = ensure(y + 4 * MM, 10 * MM);
      pdf
        .font(F.regular)
        .fontSize(9)
        .fillColor(TEXT)
        .text(`Zahlungsbedingungen: ${days > 0 ? `${days} Tage netto, ` : ""}zahlbar bis ${fmtDate(d.secondDate)}`, LEFT, y, { width: WIDTH });
      y = pdf.y;
    }
    // Quotes and reminders close with a greeting; invoices and credit notes end with the closing text (as in Bexio).
    const greeting = d.kind === "quote" || d.kind === "reminder";
    pdf.font(F.regular).fontSize(9.5);
    const outroH = d.outro ? pdf.heightOfString(d.outro, { width: WIDTH, lineGap: 1.5 }) + 4 * MM : 0;
    y = ensure(y, outroH + (greeting ? 26 * MM : 0));
    if (d.outro) {
      // set the font again: ensure() may have started a new page with the smaller running header
      pdf.font(F.regular).fontSize(9.5).fillColor(TEXT).text(d.outro, LEFT, y + 4 * MM, { width: WIDTH, lineGap: 1.5 });
      y = pdf.y;
    }
    if (greeting) {
      y += 6 * MM;
      pdf.font(F.regular).fontSize(9.5).fillColor(TEXT).text("Freundliche Grüsse", LEFT, y, { width: WIDTH });
      pdf.text(`${s.owner}\n${s.companyName}`, LEFT, pdf.y + 5 * MM, { width: WIDTH, lineGap: 1 });
      y = pdf.y;
    }

    /* ── QR-bill on a separate last page of invoices and reminders ── */
    let qrPage = -1;
    if ((d.kind === "invoice" || d.kind === "reminder") && s.iban && qrAmount > 0) {
      const cr = splitStreet(s.street);
      const dbt = splitStreet(c.street);
      const debtorName = c.company || person;
      const debtorOk = debtorName && c.street && c.zip && c.city;
      const qr = new SwissQRBill(
        {
          currency: "CHF",
          amount: qrAmount,
          message: `${d.kind === "reminder" ? label : "Rechnung"} ${d.number}`,
          // A QR-IBAN requires a QR reference; derive it from the invoice number.
          reference: isQRIBAN(s.iban) ? qrReference(d.number) : undefined,
          creditor: {
            name: s.companyName,
            address: cr.address,
            buildingNumber: cr.buildingNumber,
            zip: s.zip,
            city: s.city,
            country: s.country || "CH",
            account: s.iban,
          },
          debtor: debtorOk
            ? { name: debtorName, address: dbt.address, buildingNumber: dbt.buildingNumber, zip: c.zip!, city: c.city!, country: c.country || "CH" }
            : undefined,
        },
        { language: "DE", scissors: true, separate: false },
      );
      // the QR-bill always gets its own page, so it can be printed and torn off separately
      newPage();
      qrPage = pdf.bufferedPageRange().start + pdf.bufferedPageRange().count - 1;
      pdf.page.margins.bottom = 0;
      pdf.y = QR_TOP;
      qr.attachTo(pdf, 0, QR_TOP);
    }

    /* ── Footer with company details and page numbers on every page ── */
    const range = pdf.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      pdf.switchToPage(i);
      pdf.page.margins.bottom = 0;
      footer(pdf, s, i === qrPage ? QR_FOOTER_Y : FOOTER_Y, i - range.start + 1, range.count);
    }
    pdf.end();
  });
}

function footer(pdf: Pdf, s: CompanySettings, top: number, page: number, pages: number) {
  pdf.moveTo(LEFT, top).lineTo(RIGHT, top).strokeColor(RULE).lineWidth(0.5).stroke();
  const cols: string[][] = [
    [s.companyName, s.street, `${s.zip} ${s.city}`],
    [s.phone && `Tel. ${s.phone}`, s.email, s.website],
    [s.uid && `UID ${s.uid}`, s.vatEnabled && s.vatNumber ? `MWST-Nr. ${s.vatNumber}` : ""],
    [s.bankName, s.iban && `IBAN ${fmtIban(s.iban)}`],
  ].map((col) => col.filter((x): x is string => !!x && !!x.trim()));
  const widths = [42, 42, 36, 53].map((w) => w * MM);
  let x = LEFT;
  pdf.font(F.regular).fontSize(7).fillColor(MUTED);
  cols.forEach((col, i) => {
    pdf.text(col.join("\n"), x, top + 2.2 * MM, { width: widths[i] - 3 * MM, lineGap: 0.8, lineBreak: true });
    x += widths[i];
  });
  // page number top right, next to the logo (continuation pages: beside the running header)
  pdf.font(F.regular).fontSize(8).fillColor(MUTED).text(`Seite ${page}/${pages}`, RIGHT - 30 * MM, 15 * MM, { width: 30 * MM, align: "right", lineBreak: false });
}

const fmtPct = (n: number) => String(Number(n)).replace(/\.0+$/, "");

/* ── Positions table ── */

const COL = {
  pos: { x: LEFT, w: 10 * MM },
  descr: { x: LEFT + 10 * MM, w: 0 },
  qty: { w: 14 * MM },
  unit: { w: 17 * MM },
  price: { w: 21 * MM },
  disc: { w: 15 * MM },
  total: { w: 23 * MM },
};
const numCols = () => {
  const total = RIGHT - COL.total.w;
  const disc = total - COL.disc.w;
  const price = disc - COL.price.w;
  const unit = price - COL.unit.w;
  const qty = unit - COL.qty.w;
  return { qty, unit, price, disc, total };
};

function itemsTable(pdf: Pdf, items: LineItem[], y: number, newPage: () => number) {
  const n = numCols();
  const descrW = n.qty - COL.descr.x - 3 * MM;
  const header = () => {
    pdf.save().rect(LEFT, y - 1.6 * MM, WIDTH, 6.2 * MM).fill(TINT).restore();
    pdf.font(F.bold).fontSize(7.5).fillColor(ACCENT);
    pdf.text("Pos.", COL.pos.x + 1.5 * MM, y, { width: COL.pos.w - 1.5 * MM, lineBreak: false });
    pdf.text("Beschreibung", COL.descr.x, y, { width: descrW, lineBreak: false });
    pdf.text("Menge", n.qty, y, { width: COL.qty.w, align: "right", lineBreak: false });
    pdf.text("Einheit", n.unit + 3 * MM, y, { width: COL.unit.w - 3 * MM, lineBreak: false });
    pdf.text("Preis", n.price, y, { width: COL.price.w, align: "right", lineBreak: false });
    pdf.text("Rabatt %", n.disc, y, { width: COL.disc.w, align: "right", lineBreak: false });
    pdf.text("Total CHF", n.total - 1.5 * MM, y, { width: COL.total.w, align: "right", lineBreak: false });
    y += 4.6 * MM;
    y += 2 * MM;
  };
  header();
  let pos = 0;
  for (const it of items) {
    const kind = it.type ?? "item";
    let h: number;
    if (kind === "title") {
      pdf.font(F.bold).fontSize(9.5);
      h = pdf.heightOfString(it.title, { width: WIDTH }) + 4 * MM;
    } else if (kind === "text") {
      pdf.font(F.regular).fontSize(9);
      h = pdf.heightOfString(it.title, { width: n.qty - COL.descr.x - 3 * MM, lineGap: 1 }) + 3 * MM;
    } else {
      pdf.font(F.bold).fontSize(9);
      h = pdf.heightOfString(it.title, { width: descrW });
      if (it.description) h += pdf.font(F.regular).fontSize(8).heightOfString(it.description, { width: descrW, lineGap: 0.5 }) + 0.8 * MM;
      h += 3.4 * MM;
    }
    if (y + h > CONTENT_BOTTOM) {
      y = newPage();
      header();
    }
    if (kind === "title") {
      pdf.font(F.bold).fontSize(9.5).fillColor(ACCENT).text(it.title, LEFT + 1.5 * MM, y + 1.5 * MM, { width: WIDTH - 1.5 * MM });
      y = pdf.y + 1.5 * MM;
      pdf.moveTo(LEFT, y).lineTo(RIGHT, y).strokeColor(RULE).lineWidth(0.4).stroke();
      y += 1.6 * MM;
      continue;
    }
    if (kind === "text") {
      pdf.font(F.regular).fontSize(9).fillColor(TEXT).text(it.title, COL.descr.x, y, { width: n.qty - COL.descr.x - 3 * MM, lineGap: 1 });
      y = pdf.y + 1.4 * MM;
      pdf.moveTo(LEFT, y).lineTo(RIGHT, y).strokeColor(RULE).lineWidth(0.4).stroke();
      y += 1.6 * MM;
      continue;
    }
    pos++;
    pdf.font(F.regular).fontSize(9).fillColor(MUTED).text(String(pos), COL.pos.x + 1.5 * MM, y, { width: COL.pos.w - 1.5 * MM, lineBreak: false });
    pdf.fillColor(INK);
    pdf.text(fmtQty(it.quantity), n.qty, y, { width: COL.qty.w, align: "right", lineBreak: false });
    pdf.text(it.unit || "", n.unit + 3 * MM, y, { width: COL.unit.w - 3 * MM, lineBreak: false, ellipsis: true });
    pdf.text(chf(Number(it.unitPrice) || 0), n.price, y, { width: COL.price.w, align: "right", lineBreak: false });
    pdf.text(it.discount ? fmtPct(it.discount) : "", n.disc, y, { width: COL.disc.w, align: "right", lineBreak: false });
    pdf.text(chf(lineTotal(it)), n.total - 1.5 * MM, y, { width: COL.total.w, align: "right", lineBreak: false });
    pdf.font(F.bold).fontSize(9).fillColor(INK).text(it.title, COL.descr.x, y, { width: descrW });
    if (it.description) pdf.font(F.regular).fontSize(8).fillColor(MUTED).text(it.description, COL.descr.x, pdf.y + 0.8 * MM, { width: descrW, lineGap: 0.5 });
    y = pdf.y + 1.7 * MM;
    pdf.moveTo(LEFT, y).lineTo(RIGHT, y).strokeColor(RULE).lineWidth(0.4).stroke();
    y += 1.7 * MM;
  }
  return y;
}

interface TotalRow {
  k: string;
  v: string;
  strong?: boolean;
}

function totalsBlock(pdf: Pdf, rows: TotalRow[], y: number, x: number) {
  for (const r of rows) {
    if (r.strong) {
      // Grand total on a soft Schieferblau band, the one accent on the page.
      y += 1.2 * MM;
      pdf.font(F.bold).fontSize(10);
      const h = Math.max(pdf.heightOfString(r.k, { width: RIGHT - x - 36 * MM }), 4 * MM) + 3.6 * MM;
      pdf.save().roundedRect(x, y, RIGHT - x, h, 2.5).fill(TINT).restore();
      pdf.font(F.bold).fontSize(10).fillColor(ACCENT);
      pdf.text(r.k, x + 2.5 * MM, y + 1.9 * MM, { width: RIGHT - x - 36 * MM });
      pdf.text(r.v, RIGHT - 32.5 * MM, y + 1.9 * MM, { width: 30 * MM, align: "right", lineBreak: false });
      y += h + 2 * MM;
      continue;
    }
    pdf.font(F.regular).fontSize(9).fillColor(TEXT);
    pdf.text(r.k, x, y, { width: RIGHT - x - 32 * MM });
    const ky = pdf.y;
    pdf.fillColor(INK).text(r.v, RIGHT - 30 * MM, y, { width: 30 * MM, align: "right", lineBreak: false });
    y = Math.max(ky, y + 4.6 * MM) + 0.6 * MM;
  }
  return y;
}

let logoCache: Buffer | null | undefined;
function logoImage() {
  if (logoCache === undefined) {
    try {
      logoCache = fs.readFileSync(path.join(process.cwd(), "src/lib/admin/logo-print.png"));
    } catch {
      logoCache = null;
    }
  }
  return logoCache;
}

function qrReference(number: string) {
  const base = number.replace(/\D/g, "").slice(-26).padStart(26, "0");
  return base + calculateQRReferenceChecksum(base);
}

