// -----------------------------------------------------
// Cache Setup (optional)
// -----------------------------------------------------
const CACHE_NAME = "consistency-cache-v1";
const ASSETS = [
  "/habits/",
  "/habits/index.html",
  "/habits/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// -----------------------------------------------------
// HANDLE PUSH EVENTS
// -----------------------------------------------------
self.addEventListener("push", event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "Hinweis", body: "" };
  }

  const title = data.title || "Hinweis";
  const body  = data.body  || "";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      data: {
        url: "/habits/" // Ziel beim Tap
      }
    })
  );
});

// -----------------------------------------------------
// Notification Click → öffne App / fokussiere App
// -----------------------------------------------------
self.addEventListener("notificationclick", event => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/habits/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(wins => {
        for (const win of wins) {
          if (win.url.includes("/habits/")) {
            return win.focus();
          }
        }
        return clients.openWindow(targetUrl);
      })
  );
});

// -----------------------------------------------------
// Simple fetch handler (iOS SW keep-alive fix)
// -----------------------------------------------------
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
