/*
 * Service worker of the Webnova Admin app (scope /admin): shows push notifications (new inquiries, live
 * visitors, see src/lib/admin/push.ts) and opens the matching admin page on tap. No fetch handler, so the
 * admin loads exactly as without it.
 */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }
  // Every push must show a notification: browsers (Safari above all) end subscriptions that push silently.
  event.waitUntil(
    self.registration.showNotification(data.title || "Webnova Admin", {
      body: data.body || "",
      icon: "/icons/admin-192.png",
      tag: data.tag || undefined,
      data: { url: data.url || "/admin" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL((event.notification.data && event.notification.data.url) || "/admin", self.location.origin).href;
  event.waitUntil(
    (async () => {
      // Reuse an open admin window when there is one, otherwise open the app.
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const admin = windows.find((w) => new URL(w.url).pathname.startsWith("/admin"));
      if (admin) {
        try {
          await admin.focus();
          await admin.navigate(url);
          return;
        } catch {
          // not controlled by this worker yet: fall through and open a new window
        }
      }
      await self.clients.openWindow(url);
    })(),
  );
});
