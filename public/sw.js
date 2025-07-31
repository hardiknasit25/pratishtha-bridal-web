// App configuration - this should match your src/config/app.ts
const APP_CONFIG = {
  name: "Velleta Heritage",
  shortName: "Velleta",
  cacheName: "velleta-heritage-v1",
};

const CACHE_NAME = APP_CONFIG.cacheName;
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - serve from cache if available
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Return offline page if both cache and network fail
        if (event.request.destination === "document") {
          return caches.match("/offline.html");
        }
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle background sync tasks
  console.log("Background sync triggered");
  return Promise.resolve();
}

// Push notification handling
self.addEventListener("push", (event) => {
  const options = {
    body: event.data
      ? event.data.text()
      : `New notification from ${APP_CONFIG.name}`,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View Products",
        icon: "/icons/product-icon-96x96.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icons/close-icon.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(APP_CONFIG.name, options));
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/products"));
  } else if (event.action === "close") {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("/"));
  }
});
