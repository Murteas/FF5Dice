const CACHE_NAME = "ff5dice-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache
        .addAll([
          "./",
          "./index.html",
          "./assets/css/styles.css",
          "./assets/js/script.js",
          "./assets/icon.png", // Add icon.png to cache
        ])
        .catch((error) => {
          console.error("Service Worker: Failed to cache resources:", error);
          throw error; // Re-throw to fail the install if caching fails
        });
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch((error) => {
          console.error("Service Worker: Fetch failed:", error);
        })
      );
    })
  );
});
