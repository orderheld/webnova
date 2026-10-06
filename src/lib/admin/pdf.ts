import "server-only";
import { eq } from "drizzle-orm";
import PDFDocument from "pdfkit";
import { SwissQRBill } from "swissqrbill/pdf";
import { calculateQRReferenceChecksum, isQRIBAN } from "swissqrbill/utils";
import { db, schema } from "@/db";
import type { Customer, LineItem } from "@/db/schema";
import { chf, computeTotals, fmtDate } from "./money";
import { getSettings, type CompanySettings } from "./settings";

const MM = 2.8346456693;
const INK = "#0e0e10";
const MUTED = "#66666d";
const ACCENT = "#3b4cf5";
const LINE = "#e3e1db";

interface Doc {
  kind: "quote" | "invoice";
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
}

export async function renderDocumentPdf(kind: "quote" | "invoice", id: number) {
  const s = await getSettings();
  let doc: Doc | undefined;
  if (kind === "quote") {
    const [q] = await db().select().from(schema.quotes).where(eq(schema.quotes.id, id));
    if (!q) return null;
    const [c] = await db().select().from(schema.customers).where(eq(schema.customers.id, q.customerId));
    doc = { kind, ...q, secondDate: q.validUntil, customer: c };
  } else {
    const [inv] = await db().select().from(schema.invoices).where(eq(schema.invoices.id, id));
    if (!inv) return null;
    const [c] = await db().select().from(schema.customers).where(eq(schema.customers.id, inv.customerId));
    doc = { kind, ...inv, secondDate: inv.dueDate, customer: c };
  }
  const buffer = await buildPdf(doc, s);
  return { buffer, number: doc.number };
}

function splitStreet(street: string | null | undefined) {
  const m = (street ?? "").match(/^(.*?)\s+(\d+\w*)$/);
  return m ? { address: m[1], buildingNumber: m[2] } : { address: street ?? "", buildingNumber: undefined };
}

function buildPdf(d: Doc, s: CompanySettings): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const pdf = new PDFDocument({ size: "A4", margins: { top: 20 * MM, bottom: 20 * MM, left: 22 * MM, right: 18 * MM }, info: { Title: `${d.kind === "quote" ? "Offerte" : "Rechnung"} ${d.number}`, Author: s.companyName } });
    const chunks: Buffer[] = [];
    pdf.on("data", (c: Buffer) => chunks.push(c));
    pdf.on("end", () => resolve(Buffer.concat(chunks)));
    pdf.on("error", reject);

    const left = 22 * MM;
    const right = pdf.page.width - 18 * MM;
    const width = right - left;

    // Letterhead
    pdf.font("Helvetica-Bold").fontSize(18).fillColor(INK).text("webnova", left, 18 * MM, { continued: true }).fillColor(ACCENT).text(".");
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
    const person = [c.firstName, c.lastName].filter(Boolean).join(" ");
    const addr = [c.company, person, c.street, [c.zip, c.city].filter(Boolean).join(" "), c.country && c.country !== "CH" ? c.country : ""]
      .filter(Boolean)
      .join("\n");
    pdf.font("Helvetica").fontSize(10.5).fillColor(INK).text(addr, winX, winY, { width: 85 * MM, lineGap: 2 });

    // Meta
    let y = 95 * MM;
    const label = d.kind === "quote" ? "Offerte" : "Rechnung";
    pdf.font("Helvetica-Bold").fontSize(20).fillColor(INK).text(`${label} ${d.number}`, left, y);
    y = pdf.y + 2;
    pdf.font("Helvetica").fontSize(11).fillColor(INK).text(d.title, left, y, { width });
    y = pdf.y + 8;
    const metaRows: [string, string][] = [
      ["Datum", fmtDate(d.issueDate)],
      [d.kind === "quote" ? "Gültig bis" : "Zahlbar bis", fmtDate(d.secondDate)],
    ];
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

    // Items table
    y += 16;
    const cols = { pos: left, title: left + 9 * MM, qty: right - 70 * MM, price: right - 45 * MM, total: right - 22 * MM };
    const header = () => {
      pdf.font("Helvetica-Bold").fontSize(8.5).fillColor(MUTED);
      pdf.text("Pos.", cols.pos, y);
      pdf.text("Leistung", cols.title, y);
      pdf.text("Menge", cols.qty, y, { width: 22 * MM, align: "right" });
      pdf.text("Preis", cols.price, y, { width: 22 * MM, align: "right" });
      pdf.text("Total CHF", cols.total, y, { width: 22 * MM, align: "right" });
      y += 14;
      pdf.moveTo(left, y).lineTo(right, y).strokeColor(INK).lineWidth(0.8).stroke();
      y += 8;
    };
    header();
    const bottomLimit = pdf.page.height - 30 * MM;
    d.items.forEach((it, i) => {
      const lineTotal = (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0);
      const titleW = cols.qty - cols.title - 4 * MM;
      pdf.font("Helvetica-Bold").fontSize(9.5);
      const h1 = pdf.heightOfString(it.title, { width: titleW });
      pdf.font("Helvetica").fontSize(8.5);
      const h2 = it.description ? pdf.heightOfString(it.description, { width: titleW }) + 2 : 0;
      if (y + h1 + h2 + 10 > bottomLimit) {
        pdf.addPage();
        y = 25 * MM;
        header();
      }
      pdf.font("Helvetica").fontSize(9.5).fillColor(MUTED).text(String(i + 1), cols.pos, y);
      pdf.font("Helvetica-Bold").fillColor(INK).text(it.title, cols.title, y, { width: titleW });
      if (it.description) pdf.font("Helvetica").fontSize(8.5).fillColor(MUTED).text(it.description, cols.title, y + h1 + 2, { width: titleW });
      pdf.font("Helvetica").fontSize(9.5).fillColor(INK);
      pdf.text(`${fmtQty(it.quantity)} ${it.unit}`, cols.qty, y, { width: 22 * MM, align: "right" });
      pdf.text(chf(Number(it.unitPrice) || 0), cols.price, y, { width: 22 * MM, align: "right" });
      pdf.text(chf(lineTotal), cols.total, y, { width: 22 * MM, align: "right" });
      y += h1 + h2 + 8;
      pdf.moveTo(left, y - 3).lineTo(right, y - 3).strokeColor(LINE).lineWidth(0.5).stroke();
      y += 3;
    });

    // Totals
    const t = computeTotals(d.items, d.discountPercent, d.vatRate);
    const rows: [string, string, boolean?][] = [["Zwischentotal", chf(t.subtotal)]];
    if (d.discountPercent > 0) rows.push([`Rabatt ${d.discountPercent}%`, `– ${chf(t.discount)}`]);
    if (d.vatRate > 0) rows.push([`MWST ${d.vatRate}%`, chf(t.vat)]);
    rows.push(["Total CHF", chf(t.total), true]);
    if (y + rows.length * 16 + 20 > bottomLimit) {
      pdf.addPage();
      y = 25 * MM;
    }
    y += 6;
    for (const [k, v, bold] of rows) {
      if (bold) {
        pdf.moveTo(right - 75 * MM, y - 3).lineTo(right, y - 3).strokeColor(INK).lineWidth(0.8).stroke();
        y += 3;
      }
      pdf.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(bold ? 11 : 9.5).fillColor(INK);
      pdf.text(k, right - 75 * MM, y, { width: 45 * MM });
      pdf.text(v, right - 30 * MM, y, { width: 30 * MM, align: "right" });
      y += bold ? 18 : 14;
    }
    if (!s.vatEnabled && d.vatRate === 0) {
      pdf.font("Helvetica").fontSize(8).fillColor(MUTED).text("Nicht mehrwertsteuerpflichtig.", right - 75 * MM, y, { width: 75 * MM });
      y = pdf.y;
    }

    if (d.outro) {
      y += 16;
      if (y + 40 > bottomLimit) {
        pdf.addPage();
        y = 25 * MM;
      }
      pdf.font("Helvetica").fontSize(10).fillColor(INK).text(d.outro, left, y, { width, lineGap: 2 });
      y = pdf.y;
    }
    y += 18;
    pdf.font("Helvetica").fontSize(10).fillColor(INK).text(`Freundliche Grüsse\n\n${s.owner}\n${s.companyName}`, left, y, { width });

    // QR bill on invoices
    if (d.kind === "invoice" && s.iban) {
      const cr = splitStreet(s.street);
      const db_ = splitStreet(c.street);
      const debtorOk = (c.company || person) && c.street && c.zip && c.city;
      const qr = new SwissQRBill(
        {
          currency: "CHF",
          amount: t.total,
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
                name: c.company || person,
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

const fmtQty = (n: number) => (Number.isInteger(Number(n)) ? String(n) : Number(n).toFixed(2).replace(/0$/, ""));

function qrReference(number: string) {
  const base = number.replace(/\D/g, "").slice(-26).padStart(26, "0");
  return base + calculateQRReferenceChecksum(base);
}
