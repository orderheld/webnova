import "server-only";
import fs from "node:fs";
import path from "node:path";
import { asc, eq } from "drizzle-orm";
import PDFDocument from "pdfkit";
import { SwissQRBill } from "swissqrbill/pdf";
import { calculateQRReferenceChecksum, isQRIBAN } from "swissqrbill/utils";
import { db, schema } from "@/db";
import type { Customer, LineItem, Payment, InvoiceReminder } from "@/db/schema";
import { intervalLabels } from "./labels";
import { chf, computeTotals, fmtDate, lineTotal, oneTimeItems, recurringItems, round2 } from "./money";
import { getSettings, type CompanySettings } from "./settings";

const MM = 2.8346456693;
const INK = "#1c232b";
const MUTED = "#646b73";
const LINE = "#e2ddd4";
const ACCENT = "#24405a";

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
  payments?: Payment[];
  reminder?: InvoiceReminder;
  /** invoice the credit note or reminder refers to */
  refNumber?: string;
  refDate?: string;
  total: number;
  paidAmount: number;
}

export async function renderDocumentPdf(kind: PdfKind, id: number) {
  const s = await getSettings();
  let doc: Doc | undefined;
  if (kind === "quote") {
    const [q] = await db().select().from(schema.quotes).where(eq(schema.quotes.id, id));
    if (!q) return null;
    const [c] = await db().select().from(schema.customers).where(eq(schema.customers.id, q.customerId));
    doc = { kind, ...q, secondDate: q.validUntil, customer: c, paidAmount: 0 };
  } else {
    let reminder: InvoiceReminder | undefined;
    let invoiceId = id;
    if (kind === "reminder") {
      [reminder] = await db().select().from(schema.invoiceReminders).where(eq(schema.invoiceReminders.id, id));
      if (!reminder) return null;
      invoiceId = reminder.invoiceId;
    }
    const [inv] = await db().select().from(schema.invoices).where(eq(schema.invoices.id, invoiceId));
    if (!inv) return null;
    const [c] = await db().select().from(schema.customers).where(eq(schema.customers.id, inv.customerId));
    const payments = await db().select().from(schema.payments).where(eq(schema.payments.invoiceId, inv.id)).orderBy(asc(schema.payments.date));
    let refNumber: string | undefined;
    let refDate: string | undefined;
    if (inv.creditForId) {
      const [orig] = await db().select().from(schema.invoices).where(eq(schema.invoices.id, inv.creditForId));
      refNumber = orig?.number;
      refDate = orig?.issueDate;
    }
    if (reminder) {
      doc = {
        ...inv,
        kind: "reminder",
        reminder,
        refNumber: inv.number,
        refDate: inv.issueDate,
        number: inv.number,
        secondDate: reminder.dueDate,
        issueDate: reminder.date,
        customer: c,
        payments,
        intro: reminder.level >= 2 ? s.reminderText2 : s.reminderText1,
        outro: null,
      };
    } else {
      doc = { ...inv, kind: inv.kind === "gutschrift" ? "credit" : "invoice", secondDate: inv.dueDate, customer: c, payments, refNumber, refDate };
    }
  }
  const [contact] = await db().select().from(schema.contacts).where(eq(schema.contacts.customerId, doc.customer.id)).orderBy(asc(schema.contacts.id));
  if (contact?.isPrimary) doc.contactName = [contact.firstName, contact.lastName].filter(Boolean).join(" ");
  const buffer = await buildPdf(doc, s);
  const filename = doc.kind === "reminder" ? `${doc.reminder!.level}-Mahnung-${doc.number}` : doc.number;
  return { buffer, number: doc.number, filename };
}

function splitStreet(street: string | null | undefined) {
  const m = (street ?? "").match(/^(.*?)\s+(\d+\w*)$/);
  return m ? { address: m[1], buildingNumber: m[2] } : { address: street ?? "", buildingNumber: undefined };
}

const docLabel = (d: Doc) =>
  d.kind === "quote" ? "Offerte" : d.kind === "credit" ? "Gutschrift" : d.kind === "reminder" ? (d.reminder!.level >= 2 ? `${d.reminder!.level}. Mahnung` : "Zahlungserinnerung") : "Rechnung";

function buildPdf(d: Doc, s: CompanySettings): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const label = docLabel(d);
    const pdf = new PDFDocument({
      size: "A4",
      margins: { top: 20 * MM, bottom: 20 * MM, left: 22 * MM, right: 18 * MM },
      info: { Title: `${label} ${d.number}`, Author: s.companyName },
    });
    const chunks: Buffer[] = [];
    pdf.on("data", (c: Buffer) => chunks.push(c));
    pdf.on("end", () => resolve(Buffer.concat(chunks)));
    pdf.on("error", reject);

    const left = 22 * MM;
    const right = pdf.page.width - 18 * MM;
    const width = right - left;
    const bottomLimit = pdf.page.height - 30 * MM;
    const ensure = (y: number, h: number) => {
      if (y + h > bottomLimit) {
        pdf.addPage();
        return 25 * MM;
      }
      return y;
    };

    // Letterhead
    const logo = logoImage();
    if (logo) pdf.image(logo, left, 18 * MM, { width: 46 * MM });
    else pdf.font("Helvetica-Bold").fontSize(18).fillColor(ACCENT).text("Webnova", left, 18 * MM);
    pdf
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(MUTED)
      .text([s.companyName, s.street, `${s.zip} ${s.city}`, s.phone, s.email, s.website].filter(Boolean).join("\n"), right - 60 * MM, 18 * MM, {
        width: 60 * MM,
        align: "right",
        lineGap: 1.5,
      });

    // Sender line + address window (Swiss right window, C5)
    const winX = 118 * MM;
    const winY = 52 * MM;
    pdf.fontSize(7).fillColor(MUTED).text(`${s.companyName} · ${s.street} · ${s.zip} ${s.city}`, winX, winY - 6 * MM, { width: 85 * MM });
    const c = d.customer;
    const person = d.contactName || [c.firstName, c.lastName].filter(Boolean).join(" ");
    const addr = [c.company, person, c.street, [c.zip, c.city].filter(Boolean).join(" "), c.country && c.country !== "CH" ? c.country : ""]
      .filter(Boolean)
      .join("\n");
    pdf.font("Helvetica").fontSize(10.5).fillColor(INK).text(addr, winX, winY, { width: 85 * MM, lineGap: 2 });

    // Meta
    let y = 95 * MM;
    pdf.font("Helvetica-Bold").fontSize(20).fillColor(INK).text(d.kind === "reminder" ? label : `${label} ${d.number}`, left, y);
    y = pdf.y + 2;
    pdf.font("Helvetica").fontSize(11).fillColor(INK).text(d.title, left, y, { width });
    y = pdf.y + 8;
    const metaRows: [string, string][] = [["Datum", fmtDate(d.issueDate)]];
    if (d.kind === "quote") metaRows.push(["Gültig bis", fmtDate(d.secondDate)]);
    if (d.kind === "invoice") metaRows.push(["Zahlbar bis", fmtDate(d.secondDate)]);
    if (d.kind === "credit" && d.refNumber) metaRows.push(["Zu Rechnung", `${d.refNumber} vom ${fmtDate(d.refDate)}`]);
    if (d.kind === "reminder") {
      metaRows.push(["Rechnung", `${d.refNumber} vom ${fmtDate(d.refDate)}`]);
      metaRows.push(["Neue Frist", fmtDate(d.secondDate)]);
    }
    if (s.vatEnabled && s.vatNumber) metaRows.push(["MWST-Nr.", s.vatNumber]);
    pdf.fontSize(9).fillColor(MUTED);
    for (const [k, v] of metaRows) {
      pdf.text(k, left, y, { width: 30 * MM });
      pdf.fillColor(INK).text(v, left + 30 * MM, y);
      pdf.fillColor(MUTED);
      y += 13;
    }

    if (d.intro) {
      y += 10;
      pdf.font("Helvetica").fontSize(10).fillColor(INK).text(d.intro, left, y, { width, lineGap: 2 });
      y = pdf.y;
    }

    const t = computeTotals(d.items, d.discountPercent, d.vatRate);
    let qrAmount = t.total;

    if (d.kind === "reminder") {
      // Reminder: summary of the open amount instead of the line items
      const paid = round2(d.payments?.reduce((a, p) => a + p.amount, 0) ?? d.paidAmount);
      const fee = d.reminder!.fee;
      const open = round2(d.total - paid + fee);
      qrAmount = open;
      y += 18;
      const rows: [string, string, boolean?][] = [[`Rechnung ${d.refNumber} vom ${fmtDate(d.refDate)}: ${d.title}`, chf(d.total)]];
      if (paid > 0) rows.push(["Bereits bezahlt", `– ${chf(paid)}`]);
      if (fee > 0) rows.push(["Mahngebühr", chf(fee)]);
      rows.push(["Offener Betrag CHF", chf(open), true]);
      y = totalsBlock(pdf, rows, left, right, y, true);
    } else {
      // Items table
      y += 16;
      y = itemsTable(pdf, oneTimeItems(d.items), left, right, y, ensure);

      // Totals
      const rows: [string, string, boolean?][] = [["Zwischentotal", chf(t.subtotal)]];
      if (d.discountPercent > 0) rows.push([`Rabatt ${d.discountPercent}%`, `– ${chf(t.discount)}`]);
      if (d.vatRate > 0) rows.push([`MWST ${d.vatRate}%`, chf(t.vat)]);
      rows.push([d.kind === "credit" ? "Gutschrift CHF" : "Total CHF", chf(t.total), true]);
      const paid = round2(d.payments?.reduce((a, p) => a + p.amount, 0) ?? 0);
      if (d.kind === "invoice" && paid > 0 && paid < t.total) {
        rows.push(["Bereits bezahlt", `– ${chf(paid)}`]);
        rows.push(["Restbetrag CHF", chf(round2(t.total - paid)), true]);
        qrAmount = round2(t.total - paid);
      }
      y = ensure(y, rows.length * 16 + 20);
      y = totalsBlock(pdf, rows, left, right, y + 6, false);
      if (!s.vatEnabled && d.vatRate === 0) {
        pdf.font("Helvetica").fontSize(8).fillColor(MUTED).text("Nicht mehrwertsteuerpflichtig.", right - 75 * MM, y, { width: 75 * MM });
        y = pdf.y;
      }

      // Recurring fees (quotes)
      const rec = d.kind === "quote" ? recurringItems(d.items) : [];
      if (rec.length) {
        y = ensure(y + 18, 60);
        pdf.font("Helvetica-Bold").fontSize(11).fillColor(INK).text("Wiederkehrende Kosten", left, y);
        y = pdf.y + 2;
        pdf.font("Helvetica").fontSize(8.5).fillColor(MUTED).text("Nicht im Total enthalten. Verrechnung jeweils im Voraus.", left, y, { width });
        y = pdf.y + 8;
        for (const it of rec) {
          y = ensure(y, 30);
          const amount = lineTotal(it);
          const note = it.firstYearIncluded ? "1. Jahr im Projektpreis inbegriffen, Verrechnung ab dem 2. Jahr" : "ab Projektstart";
          pdf.font("Helvetica-Bold").fontSize(9.5).fillColor(INK).text(it.title, left, y, { width: width - 50 * MM });
          const h = pdf.y;
          pdf.font("Helvetica").fontSize(9.5).text(`CHF ${chf(amount)} ${intervalLabels[it.recurring!] ?? ""}`, right - 50 * MM, y, { width: 50 * MM, align: "right" });
          pdf.font("Helvetica").fontSize(8.5).fillColor(MUTED).text([it.description, note].filter(Boolean).join(" · "), left, h + 1, { width: width - 50 * MM });
          y = pdf.y + 6;
          pdf.moveTo(left, y - 3).lineTo(right, y - 3).strokeColor(LINE).lineWidth(0.5).stroke();
          y += 3;
        }
      }
    }

    if (d.outro) {
      y = ensure(y + 16, 40);
      pdf.font("Helvetica").fontSize(10).fillColor(INK).text(d.outro, left, y, { width, lineGap: 2 });
      y = pdf.y;
    }
    y = ensure(y + 18, 50);
    pdf.font("Helvetica").fontSize(10).fillColor(INK).text(`Freundliche Grüsse\n\n${s.owner}\n${s.companyName}`, left, y, { width });

    // QR bill on invoices and reminders (not on credit notes or paid invoices)
    if ((d.kind === "invoice" || d.kind === "reminder") && s.iban && qrAmount > 0) {
      const cr = splitStreet(s.street);
      const db_ = splitStreet(c.street);
      const debtorName = c.company || person;
      const debtorOk = debtorName && c.street && c.zip && c.city;
      const qr = new SwissQRBill(
        {
          currency: "CHF",
          amount: qrAmount,
          message: `Rechnung ${d.number}`,
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
            ? {
                name: debtorName,
                address: db_.address,
                buildingNumber: db_.buildingNumber,
                zip: c.zip!,
                city: c.city!,
                country: c.country || "CH",
              }
            : undefined,
        },
        { language: "DE" },
      );
      if (!SwissQRBill.isSpaceSufficient(pdf)) pdf.addPage();
      qr.attachTo(pdf);
    }

    pdf.end();
  });
}

function itemsTable(pdf: PDFKit.PDFDocument, items: LineItem[], left: number, right: number, y: number, ensure: (y: number, h: number) => number) {
  const cols = { pos: left, title: left + 9 * MM, qty: right - 70 * MM, price: right - 45 * MM, total: right - 22 * MM };
  const header = () => {
    pdf.font("Helvetica-Bold").fontSize(8.5).fillColor(MUTED);
    pdf.text("Pos.", cols.pos, y);
    pdf.text("Leistung", cols.title, y);
    pdf.text("Menge", cols.qty, y, { width: 22 * MM, align: "right" });
    pdf.text("Preis", cols.price, y, { width: 22 * MM, align: "right" });
    pdf.text("Total CHF", cols.total, y, { width: 22 * MM, align: "right" });
    y += 14;
    pdf.moveTo(left, y).lineTo(right, y).strokeColor(ACCENT).lineWidth(0.8).stroke();
    y += 8;
  };
  header();
  items.forEach((it, i) => {
    const titleW = cols.qty - cols.title - 4 * MM;
    pdf.font("Helvetica-Bold").fontSize(9.5);
    const h1 = pdf.heightOfString(it.title, { width: titleW });
    pdf.font("Helvetica").fontSize(8.5);
    const h2 = it.description ? pdf.heightOfString(it.description, { width: titleW }) + 2 : 0;
    const ny = ensure(y, h1 + h2 + 10);
    if (ny !== y) {
      y = ny;
      header();
    }
    pdf.font("Helvetica").fontSize(9.5).fillColor(MUTED).text(String(i + 1), cols.pos, y);
    pdf.font("Helvetica-Bold").fillColor(INK).text(it.title, cols.title, y, { width: titleW });
    if (it.description) pdf.font("Helvetica").fontSize(8.5).fillColor(MUTED).text(it.description, cols.title, y + h1 + 2, { width: titleW });
    pdf.font("Helvetica").fontSize(9.5).fillColor(INK);
    pdf.text(`${fmtQty(it.quantity)} ${it.unit}`, cols.qty, y, { width: 22 * MM, align: "right" });
    pdf.text(chf(Number(it.unitPrice) || 0), cols.price, y, { width: 22 * MM, align: "right" });
    pdf.text(chf(lineTotal(it)), cols.total, y, { width: 22 * MM, align: "right" });
    y += h1 + h2 + 8;
    pdf.moveTo(left, y - 3).lineTo(right, y - 3).strokeColor(LINE).lineWidth(0.5).stroke();
    y += 3;
  });
  return y;
}

function totalsBlock(pdf: PDFKit.PDFDocument, rows: [string, string, boolean?][], left: number, right: number, y: number, wide: boolean) {
  const x = wide ? left : right - 75 * MM;
  const w = right - x;
  for (const [k, v, bold] of rows) {
    if (bold) {
      pdf.moveTo(x, y - 3).lineTo(right, y - 3).strokeColor(ACCENT).lineWidth(0.8).stroke();
      y += 3;
    }
    pdf.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(bold ? 11 : 9.5).fillColor(INK);
    pdf.text(k, x, y, { width: w - 32 * MM });
    pdf.text(v, right - 30 * MM, y, { width: 30 * MM, align: "right" });
    y += bold ? 18 : 14;
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

const fmtQty = (n: number) => (Number.isInteger(Number(n)) ? String(n) : Number(n).toFixed(2).replace(/0$/, ""));

function qrReference(number: string) {
  const base = number.replace(/\D/g, "").slice(-26).padStart(26, "0");
  return base + calculateQRReferenceChecksum(base);
}
