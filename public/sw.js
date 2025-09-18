/* eslint-disable no-restricted-globals */
// Ultra-fast service worker for image caching
const CACHE_NAME = "lisse-beauty-images-v1";
const IMAGE_CACHE_NAME = "lisse-beauty-api-images-v1";

// URLs to cache immediately
const CRITICAL_URLS = ["/", "/static/css/", "/static/js/"];

// Install event - cache critical resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Critical files cached");
        return cache.addAll(CRITICAL_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
            return Promise.resolve();
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - ultra-fast image caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API images with stale-while-revalidate strategy
  if (
    url.hostname === "files.baserow.io" ||
    url.hostname === "api.baserow.io" ||
    request.destination === "image"
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          // Return cached version immediately if available
          if (cachedResponse) {
            // Update cache in background
            fetch(request)
              .then((fetchResponse) => {
                if (fetchResponse.ok) {
                  cache.put(request, fetchResponse.clone());
                }
              })
              .catch(() => {
                // Silent fail for background updates
              });

            return cachedResponse;
          }

          // If not in cache, fetch and cache
          return fetch(request)
            .then((fetchResponse) => {
              if (fetchResponse.ok) {
                cache.put(request, fetchResponse.clone());
              }
              return fetchResponse;
            })
            .catch(() => {
              // Return offline fallback if available
              return caches.match("/offline-image.svg");
            });
        });
      })
    );
    return;
  }

  // Handle other requests with network-first strategy
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response for caching
        const responseToCache = response.clone();

        // Cache successful responses
        if (response.ok) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }

        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(request);
      })
  );
});

// Background sync for failed image loads
self.addEventListener("sync", (event) => {
  if (event.tag === "image-retry") {
    event.waitUntil(
      // Retry failed image loads
      retryFailedImages()
    );
  }
});

async function retryFailedImages() {
  const failedImages = await self.registration.sync.getTags();

  for (const tag of failedImages) {
    if (tag.startsWith("image-retry-")) {
      const url = tag.replace("image-retry-", "");
      try {
        const response = await fetch(url);
        if (response.ok) {
          const cache = await caches.open(IMAGE_CACHE_NAME);
          await cache.put(url, response);

          // Notify clients of successful retry
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: "IMAGE_RETRY_SUCCESS",
                url: url,
              });
            });
          });
        }
      } catch (error) {
        console.log("Failed to retry image:", url);
      }
    }
  }
}

// Performance monitoring
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "PERFORMANCE_LOG") {
    console.log("Image Performance:", event.data.data);
  }
});
