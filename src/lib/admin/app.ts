/**
 * Admin as its own app on the home screen (Ferhat, 2026-10-08): own name, icon and start page /admin
 * (public/admin.webmanifest). Set in (panel)/layout.tsx and login/page.tsx, not in admin/layout.tsx:
 * Next attaches the website manifest (src/app/manifest.ts, start_url /de) to the root layout level,
 * where it would override a manifest set in admin/layout.tsx.
 */
export const ADMIN_MANIFEST = "/admin.webmanifest";
