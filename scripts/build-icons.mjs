// Builds every app icon from ONE source: public/logo-mark.svg (the bare Webnova mark).
// To swap the mark: replace public/logo-mark.svg (keep a tight viewBox around the mark,
// any fill colour) and run `node scripts/build-icons.mjs`. The OG images read the same file.
//
// Output:
//   src/app/icon.svg            scalable favicon (Schieferblau tile, white mark)
//   src/app/favicon.ico         16/32/48 px (PNG-in-ICO)
//   src/app/apple-icon.png      180 px, opaque, padded (iOS rounds the corners itself)
//   public/icons/icon-192.png   web app manifest, purpose "any"
//   public/icons/icon-512.png   web app manifest, purpose "any"
//   public/icons/maskable-512.png  web app manifest, purpose "maskable" (mark inside the 80 % safe zone)
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SLATE = "#24405A"; // Schieferblau
const WHITE = "#FFFFFF";

const src = await readFile(join(root, "public/logo-mark.svg"), "utf8");
const viewBox = src.match(/viewBox="([^"]+)"/)?.[1];
if (!viewBox) throw new Error("public/logo-mark.svg needs a viewBox");
const [vx, vy, vw, vh] = viewBox.split(/[\s,]+/).map(Number);
// Inner markup of the mark, recoloured white.
const inner = src
  .replace(/^[\s\S]*?<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "")
  .replace(/fill="(?!none)[^"]*"/g, `fill="${WHITE}"`);

/**
 * A square tile with the mark centred.
 * @param {number} size  output px (also the SVG coordinate space)
 * @param {number} markRatio  mark height relative to the tile
 * @param {number} radius  corner radius relative to the tile (0 = square, opaque edge to edge)
 */
function tile(size, markRatio, radius) {
  const h = size * markRatio;
  const scale = h / vh;
  const w = vw * scale;
  const x = (size - w) / 2 - vx * scale;
  const y = (size - h) / 2 - vy * scale;
  const r = radius * size;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
    `<rect width="${size}" height="${size}" rx="${r}" fill="${SLATE}"/>` +
    `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(5)})">${inner}</g></svg>`;
}

const png = (svg, size) => sharp(Buffer.from(svg), { density: 72 * Math.max(1, 512 / size) }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

// Favicons: bigger mark, so it stays legible at 16 px.
const faviconSvg = tile(64, 0.66, 0.22);
await writeFile(join(root, "src/app/icon.svg"), faviconSvg);

const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(icoSizes.map((s) => png(faviconSvg, s)));
await writeFile(join(root, "src/app/favicon.ico"), ico(icoSizes, icoImages));

// Apple touch icon: opaque square, iOS applies its own mask.
await writeFile(join(root, "src/app/apple-icon.png"), await sharp(await png(tile(180, 0.56, 0), 180)).flatten({ background: SLATE }).png().toBuffer());

await mkdir(join(root, "public/icons"), { recursive: true });
await writeFile(join(root, "public/icons/icon-192.png"), await png(tile(192, 0.6, 0.22), 192));
await writeFile(join(root, "public/icons/icon-512.png"), await png(tile(512, 0.6, 0.22), 512));
// Maskable: full bleed, mark well inside the central 80 % circle.
await writeFile(join(root, "public/icons/maskable-512.png"), await png(tile(512, 0.46, 0), 512));

console.log("Icons written from public/logo-mark.svg");

/** Minimal ICO container with embedded PNGs. */
function ico(sizes, images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const dir = Buffer.alloc(16 * images.length);
  let offset = 6 + dir.length;
  images.forEach((img, i) => {
    const s = sizes[i];
    const o = i * 16;
    dir.writeUInt8(s >= 256 ? 0 : s, o);
    dir.writeUInt8(s >= 256 ? 0 : s, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(img.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += img.length;
  });
  return Buffer.concat([header, dir, ...images]);
}
