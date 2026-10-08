// Builds every app icon from ONE source: public/logo-mark.svg (the bare Webnova mark).
// To swap the mark: replace public/logo-mark.svg (keep a tight viewBox around the mark,
// any fill colour) and run `node scripts/build-icons.mjs`. The OG images read the same file.
//
// Output:
//   src/app/icon2.svg           scalable favicon (Schieferblau tile, white mark)
//   src/app/favicon.ico         48/32/16 px (PNG-in-ICO, 48 first so the <link> says 48x48 for Google)
//   src/app/icon1.png           192 px PNG favicon (a multiple of 48 px, as Google Search asks)
//   src/app/apple-icon.png      180 px, opaque, padded (iOS rounds the corners itself)
//   public/icons/icon-192.png   web app manifest, purpose "any"
//   public/icons/icon-512.png   web app manifest, purpose "any"
//   public/icons/maskable-512.png  web app manifest, purpose "maskable" (mark inside the 80 % safe zone)
//   public/icons/admin-*.png    admin app (iPhone home screen, public/admin.webmanifest): mark plus an
//                               "ADMIN" pill, so it is told apart from the website icon
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
await writeFile(join(root, "src/app/icon2.svg"), faviconSvg);

const icoSizes = [48, 32, 16];
const icoImages = await Promise.all(icoSizes.map((s) => png(faviconSvg, s)));
await writeFile(join(root, "src/app/favicon.ico"), ico(icoSizes, icoImages));
await writeFile(join(root, "src/app/icon1.png"), await png(tile(192, 0.66, 0.22), 192));

// Apple touch icon: opaque square, iOS applies its own mask.
await writeFile(join(root, "src/app/apple-icon.png"), await sharp(await png(tile(180, 0.56, 0), 180)).flatten({ background: SLATE }).png().toBuffer());

await mkdir(join(root, "public/icons"), { recursive: true });
await writeFile(join(root, "public/icons/icon-192.png"), await png(tile(192, 0.6, 0.22), 192));
await writeFile(join(root, "public/icons/icon-512.png"), await png(tile(512, 0.6, 0.22), 512));
// Maskable: full bleed, mark well inside the central 80 % circle.
await writeFile(join(root, "public/icons/maskable-512.png"), await png(tile(512, 0.46, 0), 512));

// Admin app icon: the mark a little higher and an "ADMIN" pill below it. The word is an outline
// (Inter Tight SemiBold, letter-spacing 0.12 em, font units, baseline at y = 0), so no font is needed here.
const ADMIN_WORD = { capHeight: 1490, width: 7398.0, d: "M300 0H11L537 -1490H869L1394 0H1106L708 -1184H696ZM310 -584H1095V-368H310ZM2264.76 0H1886.76V-234H2250.76Q2405.76 -234 2510.26 -290.5Q2614.76 -347 2667.26 -461.0Q2719.76 -575 2719.76 -746Q2719.76 -917 2667.76 -1030.0Q2615.76 -1143 2512.76 -1199.5Q2409.76 -1256 2257.76 -1256H1878.76V-1490H2273.76Q2495.76 -1490 2655.26 -1401.0Q2814.76 -1312 2900.76 -1145.0Q2986.76 -978 2986.76 -746Q2986.76 -514 2900.76 -346.5Q2814.76 -179 2653.26 -89.5Q2491.76 0 2264.76 0ZM2028.76 -1490V0H1758.76V-1490ZM3410.52 -1490H3741.52L4183.52 -411H4200.52L4643.52 -1490H4978.52V0H4713.52V-1024H4701.52L4287.52 -5H4093.52L3684.52 -1026H3670.52V0H3410.52ZM5710.28 -1490V0H5440.28V-1490ZM7398.04 -1490V0H7156.04L6455.04 -1015H6442.04V0H6172.04V-1490H6414.04L7115.04 -475H7128.04V-1490Z" };

/**
 * @param {number} size  output px
 * @param {number} radius  corner radius relative to the tile
 * @param {number} zoom  content scale around the centre (below 1 for the maskable safe zone)
 */
function adminTile(size, radius, zoom = 1) {
  const c = size / 2;
  const at = (v) => c + (v - c) * zoom;
  const mh = size * 0.4 * zoom;
  const ms = mh / vh;
  const mx = (size - vw * ms) / 2 - vx * ms;
  const my = at(size * 0.4) - mh / 2 - vy * ms;
  const th = size * 0.075 * zoom;
  const ts = th / ADMIN_WORD.capHeight;
  const tw = ADMIN_WORD.width * ts;
  const ty = at(size * 0.78);
  const pw = tw + th * 2.2;
  const ph = th * 2.3;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
    `<rect width="${size}" height="${size}" rx="${radius * size}" fill="${SLATE}"/>` +
    `<g transform="translate(${mx.toFixed(2)} ${my.toFixed(2)}) scale(${ms.toFixed(5)})">${inner}</g>` +
    `<rect x="${((size - pw) / 2).toFixed(2)}" y="${(ty - ph / 2).toFixed(2)}" width="${pw.toFixed(2)}" height="${ph.toFixed(2)}" rx="${(ph / 2).toFixed(2)}" fill="${WHITE}"/>` +
    `<path transform="translate(${((size - tw) / 2).toFixed(2)} ${(ty + th / 2).toFixed(2)}) scale(${ts.toFixed(6)})" fill="${SLATE}" d="${ADMIN_WORD.d}"/></svg>`;
}

// iOS: opaque square, the system rounds the corners.
await writeFile(join(root, "public/icons/admin-apple-180.png"), await sharp(await png(adminTile(180, 0), 180)).flatten({ background: SLATE }).png().toBuffer());
await writeFile(join(root, "public/icons/admin-192.png"), await png(adminTile(192, 0.22), 192));
await writeFile(join(root, "public/icons/admin-512.png"), await png(adminTile(512, 0.22), 512));
await writeFile(join(root, "public/icons/admin-maskable-512.png"), await png(adminTile(512, 0, 0.78), 512));

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
