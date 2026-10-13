import "server-only";
import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import type { PostcardRecipient } from "@/db/schema";

/*
 * Address labels for the postcards. Two layouts:
 * - "rolle": Brother label printer (QL-700/QL-800 and alike) with DK-11209 rolls, 62 x 29 mm, one label per page.
 *   The driver cuts after every label, so the PDF prints 1:1 when the paper size is set to 29 x 62 mm.
 * - "a4": A4 sheets with 24 labels of 70 x 36 mm (Avery Zweckform 3475 and compatible) for any office printer.
 */

export type LabelFormat = "rolle" | "a4";

const MM = 72 / 25.4;
const INK = "#1c232b";

function fonts(pdf: PDFKit.PDFDocument) {
  try {
    const dir = path.join(process.cwd(), "src/lib/admin/fonts");
    pdf.registerFont("L-Regular", fs.readFileSync(path.join(dir, "Inter-Regular.ttf")));
    pdf.registerFont("L-Bold", fs.readFileSync(path.join(dir, "Inter-SemiBold.ttf")));
    return { regular: "L-Regular", bold: "L-Bold" };
  } catch {
    return { regular: "Helvetica", bold: "Helvetica-Bold" };
  }
}

/** Address block as the Post wants it: company, street, postcode and town. */
export function addressLines(r: Pick<PostcardRecipient, "name" | "street" | "zip" | "town">) {
  return [r.name, r.street, `${r.zip} ${r.town}`];
}

/** Writes the address into the box, shrinking the font until it fits (company names can be long). */
function drawAddress(pdf: PDFKit.PDFDocument, f: { regular: string; bold: string }, lines: string[], x: number, y: number, w: number, h: number) {
  const [name, ...rest] = lines;
  for (let size = 10; size >= 6; size -= 0.5) {
    const gap = size * 0.25;
    pdf.font(f.bold).fontSize(size);
    const nameH = pdf.heightOfString(name, { width: w, lineGap: 0 });
    if (nameH > size * 2.6 && size > 6) continue; // at most two lines for the company
    pdf.font(f.regular).fontSize(size);
    const restH = rest.reduce((s, l) => s + pdf.heightOfString(l, { width: w }), 0);
    const total = nameH + gap + restH;
    if (total > h && size > 6) continue;
    let cy = y + Math.max(0, (h - total) / 2);
    pdf.font(f.bold).fontSize(size).fillColor(INK).text(name, x, cy, { width: w, height: size * 2.7, ellipsis: true });
    cy += Math.min(nameH, size * 2.7) + gap;
    pdf.font(f.regular).fontSize(size);
    for (const l of rest) {
      pdf.text(l, x, cy, { width: w, lineBreak: false, ellipsis: true });
      cy += pdf.heightOfString(l, { width: w });
    }
    return;
  }
}

export function renderLabels(rows: Pick<PostcardRecipient, "name" | "street" | "zip" | "town">[], format: LabelFormat): Promise<Buffer> {
  const rolle = format === "rolle";
  const size: [number, number] = rolle ? [62 * MM, 29 * MM] : [210 * MM, 297 * MM];
  const pdf = new PDFDocument({ size, margin: 0, autoFirstPage: false, info: { Title: "Etiketten Postkarten", Author: "webnova" } });
  const chunks: Buffer[] = [];
  pdf.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => pdf.on("end", () => resolve(Buffer.concat(chunks))));
  const f = fonts(pdf);

  if (rolle) {
    for (const r of rows) {
      pdf.addPage({ size, margin: 0 });
      // 3 mm printer margin on the long sides, 4 mm at the ends
      drawAddress(pdf, f, addressLines(r), 4 * MM, 2.5 * MM, 54 * MM, 24 * MM);
    }
  } else {
    const cols = 3;
    const perPage = 24;
    const w = 70 * MM;
    const h = 36 * MM;
    const top = 4.5 * MM;
    rows.forEach((r, i) => {
      if (i % perPage === 0) pdf.addPage({ size, margin: 0 });
      const k = i % perPage;
      const x = (k % cols) * w;
      const y = top + Math.floor(k / cols) * h;
      drawAddress(pdf, f, addressLines(r), x + 6 * MM, y + 4 * MM, w - 12 * MM, h - 8 * MM);
    });
  }
  if (rows.length === 0) pdf.addPage({ size, margin: 0 });
  pdf.end();
  return done;
}
