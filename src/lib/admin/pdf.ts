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
import { customerNumber, projectNumber } from "./doc-numbers";
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
const FOOTER_Y = PAGE_H - 26 * MM;
/** content must end above this line */
const CONTENT_BOTTOM = FOOTER_Y - 7 * MM;
/** the QR-bill (105 mm) sits at the bottom of its own page */
const QR_TOP = PAGE_H - SwissQRBill.height;

/* Corporate design (globals.css): ink, soft ink, muted grey, hairlines, Schieferblau and its soft tint. */
const INK = "#1c232b";
const TEXT = "#3a434d";
const MUTED = "#646b73";
const RULE = "#d9e0e7";
const ACCENT = "#24405a";
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

/*
 * Inter's kerning pulls digits and dots together («27.11.2026» reads as «2711.2026»), so all text is set
 * without kerning; amount columns additionally use tabular figures so the digits line up.
 */
const NO_KERN = { kern: false } as const;
const TNUM = { kern: false, tnum: true } as unknown as PDFKit.Mixins.OpenTypeFeatures[];
function plainSpacing(pdf: Pdf) {
  const p = pdf as unknown as Record<"text" | "widthOfString" | "heightOfString", (...a: unknown[]) => unknown>;
  for (const m of ["text", "widthOfString", "heightOfString"] as const) {
    const orig = p[m].bind(pdf);
    p[m] = (...args: unknown[]) => {
      const last = args[args.length - 1];
      if (last && typeof last === "object") args[args.length - 1] = { features: NO_KERN, ...last };
      else args.push({ features: NO_KERN });
      return orig(...args);
    };
  }
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
  /** invoices and credit notes: date or period of the service */
  servicePeriod?: string | null;
  customer: Customer;
  /** customer number printed on the document: the snapshot of an issued document, else the current one */
  customerNo: string;
  /** documents issued before the number ranges were raised keep their original info block */
  legacy: boolean;
  projectId?: number | null;
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
    doc = { kind, ...row.q, secondDate: row.q.validUntil, customer: row.c, ...docCustomerNo(row.q.customerNumber, row.c.id), paidAmount: 0 };
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
        ...docCustomerNo(inv.customerNumber, c.id),
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
        ...docCustomerNo(inv.customerNumber, c.id),
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
  doc.projectId = projectId;
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
const docCustomerNo = (snapshot: string | null, customerId: number) => ({ customerNo: snapshot || customerNumber(customerId), legacy: !!snapshot });

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
    plainSpacing(pdf);

    const headline = d.kind === "reminder" ? label : `${label} ${d.number}`;
    const logo = logoImage();
    /** starts a continuation page with a slim running header and returns the y to continue at */
    const newPage = () => {
      pdf.addPage();
      if (logo) pdf.image(logo, LEFT, 12 * MM, { width: 27 * MM });
      pdf
        .font(F.regular)
        .fontSize(8)
        .fillColor(MUTED)
        .text(`${headline}${d.title ? ` · ${d.title}` : ""}`, LEFT + 33 * MM, 13.4 * MM, { width: WIDTH - 33 * MM - 32 * MM, lineBreak: false, ellipsis: true });
      pdf.moveTo(LEFT, 20.5 * MM).lineTo(RIGHT, 20.5 * MM).strokeColor(RULE).lineWidth(0.5).stroke();
      return 28 * MM;
    };
    const ensure = (y: number, h: number) => (y + h > CONTENT_BOTTOM ? newPage() : y);

    /* ── Letterhead: logo left, document type and number right, Schieferblau rule ── */
    if (logo) pdf.image(logo, LEFT, 14 * MM, { width: 46 * MM });
    else pdf.font(F.display).fontSize(18).fillColor(INK).text(s.companyName, LEFT, 15 * MM);
    pdf.font(F.display).fontSize(21).fillColor(ACCENT).text(label, LEFT, 13 * MM, { width: WIDTH, align: "right", lineBreak: false });
    pdf
      .font(F.regular)
      .fontSize(8.5)
      .fillColor(MUTED)
      .text(d.kind === "reminder" ? `zu Rechnung ${d.refNumber}` : `Nr. ${d.number}`, LEFT, 22.4 * MM, { width: WIDTH, align: "right", lineBreak: false });
    pdf.moveTo(LEFT, 30 * MM).lineTo(RIGHT, 30 * MM).strokeColor(ACCENT).lineWidth(0.9).stroke();

    /* ── Address window (left, C5/DL): sender line + recipient ── */
    const winY = 45 * MM;
    const winW = 85 * MM;
    const sender = [s.companyName, s.street, `${s.zip} ${s.city}`].filter((x) => x.trim()).join(", ");
    pdf.font(F.regular).fontSize(7).fillColor(MUTED).text(sender, LEFT, winY, { width: winW, lineBreak: false, ellipsis: true });
    pdf
      .moveTo(LEFT, winY + 3.6 * MM)
      .lineTo(LEFT + Math.min(winW, pdf.widthOfString(sender)), winY + 3.6 * MM)
      .strokeColor(RULE)
      .lineWidth(0.4)
      .stroke();
    const c = d.customer;
    const person = d.contactName || [c.firstName, c.lastName].filter(Boolean).join(" ");
    const addr = [
      c.company,
      c.company ? c.addressAddition : "",
      c.company && person ? person : !c.company ? person : "",
      c.street,
      [c.zip, c.city].filter(Boolean).join(" "),
      c.country && c.country !== "CH" ? c.country : "",
    ]
      .filter(Boolean)
      .join("\n");
    pdf.font(F.regular).fontSize(10).fillColor(INK).text(addr, LEFT, winY + 6 * MM, { width: winW, lineGap: 1.5 });
    const addrBottom = pdf.y;

    /* ── Document details in a soft panel right of the window ── */
    const info: [string, string][] = [];
    if (d.kind === "reminder") {
      info.push(["Rechnungsnummer", d.number]);
      if (d.refDate) info.push(["Rechnungsdatum", fmtDate(d.refDate)]);
      info.push(["Datum", fmtDate(d.issueDate)]);
      info.push(["Neue Zahlungsfrist", fmtDate(d.secondDate)]);
    } else {
      const nrLabel = d.kind === "quote" ? "Offertnummer" : d.kind === "credit" ? "Gutschriftnummer" : "Rechnungsnummer";
      info.push([nrLabel, d.number]);
      info.push([d.kind === "quote" ? "Offertdatum" : d.kind === "credit" ? "Datum" : "Rechnungsdatum", fmtDate(d.issueDate)]);
      if (d.kind === "quote" && d.secondDate) info.push(["Gültig bis", fmtDate(d.secondDate)]);
      if (d.kind === "invoice") info.push(["Zahlbar bis", fmtDate(d.secondDate)]);
      if ((d.kind === "invoice" || d.kind === "credit") && d.servicePeriod?.trim()) info.push(["Leistungszeitraum", d.servicePeriod.trim()]);
      if (d.kind === "credit" && d.refNumber) info.push(["Zu Rechnung", d.refNumber]);
    }
    info.push(["Kundennummer", d.customerNo]);
    // Documents issued before the number ranges were raised keep the project line they were printed with.
    if (d.legacy) {
      if (d.projectName) info.push(["Projekt", d.projectName]);
    } else if (d.projectId) info.push(["Projektnummer", projectNumber(d.projectId)]);
    const boxX = 116 * MM;
    const boxW = RIGHT - boxX;
    const pad = 3.6 * MM;
    const labelW = 29 * MM;
    const valW = boxW - 2 * pad - labelW;
    pdf.font(F.regular).fontSize(8.5);
    const rowHs = info.map(([, v]) => Math.max(4.4 * MM, pdf.heightOfString(v, { width: valW }) + 1.4 * MM));
    const boxTop = winY - 1 * MM;
    const boxH = rowHs.reduce((a, h) => a + h, 0) + 2 * pad - 1.4 * MM;
    pdf.save().roundedRect(boxX, boxTop, boxW, boxH, 3).fill(TINT).restore();
    let iy = boxTop + pad;
    info.forEach(([k, v], i) => {
      pdf.font(F.regular).fontSize(8).fillColor(MUTED).text(k, boxX + pad, iy + 0.4, { width: labelW - 1 * MM, lineBreak: false });
      pdf
        .font(i === 0 ? F.bold : F.regular)
        .fontSize(8.5)
        .fillColor(INK)
        .text(v, boxX + pad + labelW, iy, { width: valW });
      iy += rowHs[i];
    });

    /* ── Subject and introduction ── */
    let y = Math.max(92 * MM, boxTop + boxH + 9 * MM, addrBottom + 9 * MM);
    if (d.title) {
      pdf.font(F.display).fontSize(13).fillColor(INK).text(d.title, LEFT, y, { width: WIDTH });
      y = pdf.y;
    }
    if (d.intro) {
      y += 3.5 * MM;
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
      // With MWST the net amount is labelled «Total exkl. MWST»; «Zwischentotal» only appears before a discount.
      if (hasDiscount) rows.push({ k: "Zwischentotal", v: chf(t.subtotal) });
      if (hasDiscount) rows.push({ k: `Rabatt ${fmtPct(d.discountPercent)}%`, v: `-${chf(t.discount)}` });
      if (d.vatRate > 0) rows.push({ k: "Total exkl. MWST", v: chf(t.net) });
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

      // Recurring fees (quotes only, not part of the total)
      const rec = d.kind === "quote" ? recurringItems(d.items) : [];
      if (rec.length) {
        y = ensure(y + 7 * MM, 32 * MM);
        pdf.font(F.display).fontSize(11).fillColor(INK).text("Wiederkehrende Kosten", LEFT, y);
        y = pdf.y + 0.5 * MM;
        pdf.font(F.regular).fontSize(8).fillColor(MUTED).text(d.vatRate > 0 ? `Nicht im Total enthalten. Beträge exkl. MWST ${fmtPct(d.vatRate)}%, Verrechnung jeweils im Voraus.` : "Nicht im Total enthalten. Verrechnung jeweils im Voraus.", LEFT, y, { width: WIDTH });
        y = pdf.y + 4 * MM;
        y = tableHead(pdf, y, [
          { t: "Beschreibung", x: LEFT, w: WIDTH - 62 * MM },
          { t: "Intervall", x: RIGHT - 60 * MM, w: 28 * MM },
          { t: "Betrag CHF", x: RIGHT - 30 * MM, w: 30 * MM, right: true },
        ]);
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
          pdf.text(chf(lineTotal(it)), RIGHT - 30 * MM, y, { width: 30 * MM, align: "right", features: TNUM });
          pdf.font(F.regular).fontSize(8).fillColor(MUTED).text(descr, LEFT, ty + 0.5, { width: w });
          y = pdf.y + 2 * MM;
          pdf.moveTo(LEFT, y).lineTo(RIGHT, y).strokeColor(RULE).lineWidth(0.4).stroke();
          y += 2 * MM;
        }
      }
    }

    /* ── Payment details (invoices and reminders), closing text, greeting ── */
    const hasQr = (d.kind === "invoice" || d.kind === "reminder") && !!s.iban && qrAmount > 0;
    if ((d.kind === "invoice" || d.kind === "reminder") && d.secondDate && qrAmount > 0) {
      const days = daysBetween(d.issueDate, d.secondDate);
      const rows: [string, string][] = [
        ["Zahlungsfrist", d.kind === "invoice" && days > 0 ? `${days} Tage netto, zahlbar bis ${fmtDate(d.secondDate)}` : `zahlbar bis ${fmtDate(d.secondDate)}`],
        ["Zahlungszweck", `Rechnung ${d.number}`],
      ];
      if (s.iban) rows.push(["Konto", [`IBAN ${fmtIban(s.iban)}`, s.bankName].filter(Boolean).join(", ")]);
      if (s.iban) rows.push(["Zugunsten von", [s.companyName, s.street, `${s.zip} ${s.city}`].filter((x) => x.trim()).join(", ")]);
      y = paymentPanel(pdf, rows, hasQr ? "Den QR-Einzahlungsschein finden Sie auf der letzten Seite." : null, ensure(y + 7 * MM, 30 * MM));
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
    if (hasQr) {
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
      const top = newPage();
      qrPage = pdf.bufferedPageRange().start + pdf.bufferedPageRange().count - 1;
      pdf.font(F.display).fontSize(13).fillColor(INK).text("QR-Einzahlungsschein", LEFT, top, { width: WIDTH });
      pdf
        .font(F.regular)
        .fontSize(9)
        .fillColor(TEXT)
        .text(`Bitte verwenden Sie für Ihre Zahlung den untenstehenden QR-Einzahlungsschein. Betrag CHF ${chf(qrAmount)}, Zahlungszweck ${d.kind === "reminder" ? label : "Rechnung"} ${d.number}.`, LEFT, pdf.y + 2 * MM, { width: WIDTH, lineGap: 1.5 });
      pdf.page.margins.bottom = 0;
      pdf.y = QR_TOP;
      qr.attachTo(pdf, 0, QR_TOP);
    }

    /* ── Footer with company details on every page but the QR-bill's (it carries the account itself), page numbers on all ── */
    const range = pdf.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      pdf.switchToPage(i);
      pdf.page.margins.bottom = 0;
      footer(pdf, s, i !== qrPage, i - range.start + 1, range.count);
    }
    pdf.end();
  });
}

function footer(pdf: Pdf, s: CompanySettings, details: boolean, page: number, pages: number) {
  const pageLabel = `Seite ${page} von ${pages}`;
  if (!details) {
    // QR-bill page: the bill fills the bottom, so the page number sits in the running header
    pdf.font(F.regular).fontSize(7.5).fillColor(MUTED).text(pageLabel, RIGHT - 30 * MM, 13.6 * MM, { width: 30 * MM, align: "right", lineBreak: false });
    return;
  }
  const top = FOOTER_Y;
  pdf.moveTo(LEFT, top).lineTo(RIGHT, top).strokeColor(ACCENT).lineWidth(0.6).stroke();
  const cols: [string, string[]][] = (
    [
      ["Anschrift", [s.companyName, s.street, `${s.zip} ${s.city}`]],
      // The printed documents name no website, phone number or contact person, only the accounting address (Ferhat 2026-11-27).
      ["Kontakt", [s.billingEmail || s.email]],
      // The MWST number contains the UID (CHE-… MWST), so the UID line is only shown without MWST.
      ["Mehrwertsteuer", s.vatEnabled && s.vatNumber ? [s.vatNumber] : [s.uid && `UID ${s.uid}`]],
      ["Bankverbindung", [s.bankName, s.iban && `IBAN ${fmtIban(s.iban)}`, s.bic && `BIC ${s.bic}`]],
    ] as [string, (string | false | undefined)[]][]
  )
    .map(([h, col]): [string, string[]] => [h, col.filter((x): x is string => !!x && !!x.trim())])
    .filter(([, col]) => col.length > 0);
  const widths = [40, 44, 39, 50].map((w) => w * MM);
  let x = LEFT;
  cols.forEach(([h, col], i) => {
    pdf.font(F.bold).fontSize(6.5).fillColor(ACCENT).text(h.toUpperCase(), x, top + 2.6 * MM, { width: widths[i] - 2 * MM, characterSpacing: 0.4, lineBreak: false });
    pdf.font(F.regular).fontSize(7.5).fillColor(TEXT).text(col.join("\n"), x, top + 6 * MM, { width: widths[i] - 2 * MM, lineGap: 1 });
    x += widths[i];
  });
  pdf.font(F.regular).fontSize(7).fillColor(MUTED).text(pageLabel, LEFT, PAGE_H - 7 * MM, { width: WIDTH, align: "right", lineBreak: false });
}

/** Payment details panel: thin Schieferblau bar on the left, label/value rows, optional note. */
function paymentPanel(pdf: Pdf, rows: [string, string][], note: string | null, y: number) {
  const x = LEFT + 4 * MM;
  const labelW = 30 * MM;
  const valW = WIDTH - 4 * MM - labelW;
  const start = y;
  pdf.font(F.bold).fontSize(9).fillColor(INK).text("Zahlungsinformationen", x, y, { width: WIDTH - 4 * MM });
  y = pdf.y + 1.6 * MM;
  for (const [k, v] of rows) {
    pdf.font(F.regular).fontSize(8).fillColor(MUTED).text(k, x, y + 0.5, { width: labelW - 2 * MM, lineBreak: false });
    pdf.font(F.regular).fontSize(8.5).fillColor(INK).text(v, x + labelW, y, { width: valW });
    y = Math.max(pdf.y, y + 4 * MM) + 0.6 * MM;
  }
  if (note) {
    pdf.font(F.regular).fontSize(8).fillColor(MUTED).text(note, x, y + 0.8 * MM, { width: WIDTH - 4 * MM });
    y = pdf.y;
  }
  pdf.save().rect(LEFT, start - 0.5 * MM, 1.1 * MM, y - start + 1 * MM).fill(ACCENT).restore();
  return y;
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
/** The «Rabatt %» column only takes space when at least one position has a discount. */
const numCols = (showDisc = true) => {
  const total = RIGHT - COL.total.w;
  const disc = total - (showDisc ? COL.disc.w : 0);
  const price = disc - COL.price.w;
  const unit = price - COL.unit.w;
  const qty = unit - COL.qty.w;
  return { qty, unit, price, disc, total };
};

function itemsTable(pdf: Pdf, items: LineItem[], y: number, newPage: () => number) {
  const showDisc = items.some((it) => (it.type ?? "item") === "item" && Number(it.discount) > 0);
  const n = numCols(showDisc);
  const descrW = n.qty - COL.descr.x - 3 * MM;
  const header = () => {
    y = tableHead(pdf, y, [
      { t: "Pos.", x: COL.pos.x, w: COL.pos.w },
      { t: "Beschreibung", x: COL.descr.x, w: descrW },
      { t: "Menge", x: n.qty, w: COL.qty.w, right: true },
      { t: "Einheit", x: n.unit + 3 * MM, w: COL.unit.w - 3 * MM },
      { t: "Preis", x: n.price, w: COL.price.w, right: true },
      ...(showDisc ? [{ t: "Rabatt %", x: n.disc, w: COL.disc.w, right: true }] : []),
      { t: "Betrag CHF", x: n.total, w: COL.total.w, right: true },
    ]);
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
      if (it.description) h += pdf.font(F.regular).fontSize(8.5).heightOfString(it.description, { width: descrW, lineGap: 0.5 }) + 0.8 * MM;
      h += 3.4 * MM;
    }
    if (y + h > CONTENT_BOTTOM) {
      y = newPage();
      header();
    }
    if (kind === "title") {
      pdf.font(F.bold).fontSize(9.5).fillColor(ACCENT).text(it.title, LEFT, y + 1.5 * MM, { width: WIDTH });
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
    pdf.font(F.regular).fontSize(9).fillColor(MUTED).text(String(pos), COL.pos.x, y, { width: COL.pos.w, lineBreak: false });
    pdf.fillColor(INK);
    pdf.text(fmtQty(it.quantity), n.qty, y, { width: COL.qty.w, align: "right", lineBreak: false, features: TNUM });
    pdf.text(it.unit || "", n.unit + 3 * MM, y, { width: COL.unit.w - 3 * MM, lineBreak: false, ellipsis: true });
    pdf.text(chf(Number(it.unitPrice) || 0), n.price, y, { width: COL.price.w, align: "right", lineBreak: false, features: TNUM });
    if (showDisc) pdf.text(it.discount ? fmtPct(it.discount) : "", n.disc, y, { width: COL.disc.w, align: "right", lineBreak: false, features: TNUM });
    pdf.text(chf(lineTotal(it)), n.total, y, { width: COL.total.w, align: "right", lineBreak: false, features: TNUM });
    pdf.font(F.bold).fontSize(9).fillColor(INK).text(it.title, COL.descr.x, y, { width: descrW });
    if (it.description) pdf.font(F.regular).fontSize(8.5).fillColor(MUTED).text(it.description, COL.descr.x, pdf.y + 0.8 * MM, { width: descrW, lineGap: 0.5 });
    y = pdf.y + 1.7 * MM;
    pdf.moveTo(LEFT, y).lineTo(RIGHT, y).strokeColor(RULE).lineWidth(0.4).stroke();
    y += 1.7 * MM;
  }
  return y;
}

interface HeadCol {
  t: string;
  x: number;
  w: number;
  right?: boolean;
}

/** Table heading: small spaced capitals in Schieferblau over a solid rule; returns the y of the first row. */
function tableHead(pdf: Pdf, y: number, cols: HeadCol[]) {
  pdf.font(F.bold).fontSize(6.8).fillColor(ACCENT);
  for (const c of cols) pdf.text(c.t.toUpperCase(), c.x, y, { width: c.w, align: c.right ? "right" : "left", characterSpacing: c.right ? 0 : 0.4, lineBreak: false });
  y += 3.6 * MM;
  pdf.moveTo(LEFT, y).lineTo(RIGHT, y).strokeColor(ACCENT).lineWidth(0.8).stroke();
  return y + 2.6 * MM;
}

interface TotalRow {
  k: string;
  v: string;
  strong?: boolean;
}

function totalsBlock(pdf: Pdf, rows: TotalRow[], y: number, x: number) {
  for (const r of rows) {
    if (r.strong) {
      // Grand total on a solid Schieferblau band, the strongest accent on the page.
      y += 1.4 * MM;
      pdf.font(F.bold).fontSize(10);
      const h = Math.max(pdf.heightOfString(r.k, { width: RIGHT - x - 36 * MM }), 4 * MM) + 4 * MM;
      pdf.save().roundedRect(x, y, RIGHT - x, h, 2).fill(ACCENT).restore();
      pdf.font(F.bold).fontSize(10).fillColor("#ffffff");
      pdf.text(r.k, x + 3 * MM, y + 2.1 * MM, { width: RIGHT - x - 36 * MM });
      pdf.text(r.v, RIGHT - 33 * MM, y + 2.1 * MM, { width: 30 * MM, align: "right", lineBreak: false, features: TNUM });
      y += h + 2 * MM;
      continue;
    }
    pdf.font(F.regular).fontSize(9).fillColor(TEXT);
    pdf.text(r.k, x, y, { width: RIGHT - x - 32 * MM });
    const ky = pdf.y;
    pdf.fillColor(INK).text(r.v, RIGHT - 30 * MM, y, { width: 30 * MM, align: "right", lineBreak: false, features: TNUM });
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

