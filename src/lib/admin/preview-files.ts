/*
 * Client previews (Admin > Vorschauen): rules for the files of an uploaded ZIP, shared by the upload form in the
 * browser and the API that stores them, so both check the same limits and paths.
 */

/** Size of one stored chunk and of one upload request (Vercel accepts at most 4.5 MB per request body). */
export const PREVIEW_CHUNK = 1024 * 1024;
export const PREVIEW_MAX_FILES = 600;
export const PREVIEW_MAX_BYTES = 80 * 1024 * 1024;
export const PREVIEW_MAX_PDF = 15 * 1024 * 1024;
/**
 * Largest part of a file in one answer to a Range request, and the first part of a video or audio file asked for
 * without one: players fetch the rest in further requests, so a long film never holds one function call for minutes.
 */
export const PREVIEW_PART = 4 * 1024 * 1024;

/**
 * Headers of every preview response (next.config.ts for /vorschau/*, and the route itself for URLs those path rules
 * miss): never in search engines, and the sandbox runs the preview as an opaque origin, so its scripts cannot read
 * webnova.ch cookies or call the admin. Fonts and modules it loads from its own folder therefore need CORS.
 */
export const previewSecurityHeaders: Record<string, string> = {
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Content-Security-Policy": "sandbox allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-presentation",
  "Access-Control-Allow-Origin": "*",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

const types: Record<string, string> = {
  html: "text/html; charset=utf-8",
  htm: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  mjs: "text/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  map: "application/json; charset=utf-8",
  webmanifest: "application/manifest+json; charset=utf-8",
  txt: "text/plain; charset=utf-8",
  csv: "text/csv; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  vtt: "text/vtt; charset=utf-8",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  ico: "image/x-icon",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf",
  mp4: "video/mp4",
  m4v: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  ogv: "video/ogg",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  ogg: "audio/ogg",
  wav: "audio/wav",
  pdf: "application/pdf",
  glb: "model/gltf-binary",
  gltf: "model/gltf+json",
  wasm: "application/wasm",
};

export function previewContentType(path: string) {
  const ext = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
  return types[ext] ?? "application/octet-stream";
}

/** Videos and audio load in parts by themselves, so their size does not matter. */
export const isMedia = (path: string) => /^(video|audio)\//.test(previewContentType(path));

/**
 * A clean relative path ("media/film.webm"), or null for paths that must never be stored: "..", absolute paths,
 * control characters, hidden files and folders (.git, .DS_Store) and system junk from Mac and Windows ZIPs.
 */
export function cleanPreviewPath(raw: string): string | null {
  // NFC: macOS writes "ä" as "a" plus a combining mark, browsers request the composed form.
  const path = raw.normalize("NFC").replace(/\\/g, "/").replace(/^\.?\/+/, "");
  if (!path || path.length > 300 || path.endsWith("/") || /[\u0000-\u001f\u007f]/.test(path)) return null;
  const parts = path.split("/");
  if (parts.some((p) => p === "" || p === "." || p === ".." || p.startsWith("."))) return null;
  if (parts[0] === "__MACOSX" || /^(thumbs\.db|desktop\.ini)$/i.test(parts[parts.length - 1])) return null;
  return path;
}

/** Upper half of code page 850, which Windows uses for ZIP entry names in Western Europe. */
const cp850 =
  "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´\u00ad±‗¾¶§÷¸°¨·¹³²■\u00a0";

/**
 * fflate reads an entry name as Latin-1 unless the ZIP marks it as UTF-8, which macOS and Windows often leave out:
 * "Bäckerei.jpg" would arrive as "BaÌ\u0088ckerei.jpg" and never match the page's link. The bytes are read again as
 * UTF-8; failing that, control characters (0x80-0x9F, where code page 850 keeps ä, ö, ü, é, è, à) show a Windows name.
 */
function zipEntryName(name: string): string {
  if (!/[\u0080-\u00ff]/.test(name) || /[^\u0000-\u00ff]/.test(name)) return name;
  const bytes = Uint8Array.from(name, (c) => c.charCodeAt(0));
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    if (!/[\u0080-\u009f]/.test(name)) return name;
    return Array.from(bytes, (b) => (b < 0x80 ? String.fromCharCode(b) : cp850[b - 0x80])).join("");
  }
}

export interface PreviewUploadFile {
  path: string;
  data: Uint8Array;
}

/**
 * The files of an unpacked ZIP that make up the preview: junk dropped and the folder of the start page as the root,
 * so a ZIP of the folder "kunde-vorschau/" serves "kunde-vorschau/index.html" at the link itself.
 */
export function previewFilesFromZip(entries: Record<string, Uint8Array>): { files: PreviewUploadFile[]; skipped: number } | { error: string } {
  const files: PreviewUploadFile[] = [];
  let skipped = 0;
  for (const [name, data] of Object.entries(entries)) {
    if (name.endsWith("/")) continue;
    const path = cleanPreviewPath(zipEntryName(name));
    if (path) files.push({ path, data });
    else skipped++;
  }
  const starts = files.filter((f) => f.path === "index.html" || f.path.endsWith("/index.html"));
  if (starts.length === 0) return { error: "Im ZIP fehlt die Startseite index.html." };
  const start = starts.reduce((a, b) => (b.path.split("/").length < a.path.split("/").length ? b : a));
  const root = start.path.slice(0, -"index.html".length);
  const inRoot = files.filter((f) => f.path.startsWith(root)).map((f) => ({ path: f.path.slice(root.length), data: f.data }));
  skipped += files.length - inRoot.length;
  const total = inRoot.reduce((n, f) => n + f.data.length, 0);
  if (inRoot.length > PREVIEW_MAX_FILES) return { error: `Das ZIP hat ${inRoot.length} Dateien, erlaubt sind ${PREVIEW_MAX_FILES}.` };
  if (total > PREVIEW_MAX_BYTES) return { error: `Das ZIP ist entpackt ${mb(total)} gross, erlaubt sind ${mb(PREVIEW_MAX_BYTES)}.` };
  return { files: inRoot, skipped };
}

export const mb = (bytes: number) => `${(bytes / 1024 / 1024).toLocaleString("de-CH", { maximumFractionDigits: 1 })} MB`;
