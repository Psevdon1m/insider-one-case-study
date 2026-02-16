/**
 * Service worker: caches critical HTML, CSS, and JS for offline use.
 * - Precaches the app shell (index.html) on install
 * - Caches same-origin HTML, CSS, JS, and fonts on first request
 * - Serves from cache when offline, falls back to network when online
 */

const CACHE_NAME = "horse-racing-v1";

function getBasePath() {
  const path = self.location.pathname;
  if (path.endsWith("sw.js")) {
    const base = path.replace(/sw\.js$/, "");
    return base.endsWith("/") ? base : base + "/";
  }
  return "/";
}

const basePath = getBasePath();

function isSameOrigin(url) {
  try {
    const u = new URL(url, self.location.origin);
    return u.origin === self.location.origin;
  } catch {
    return false;
  }
}

function shouldCache(url) {
  if (!isSameOrigin(url)) return false;
  const path = new URL(url, self.location.origin).pathname;
  return (
    path.endsWith(".html") ||
    path.endsWith(".webmanifest") ||
    path.endsWith(".js") ||
    path.endsWith(".css") ||
    path.endsWith(".svg") ||
    path.endsWith(".png") ||
    path.endsWith(".woff2") ||
    path.endsWith(".woff") ||
    path.endsWith(".ico") ||
    path.includes("/assets/") ||
    path.includes("/icons/") ||
    path === basePath ||
    path === basePath.replace(/\/$/, "")
  );
}

const url = new URL("index.html", self.location.origin + basePath).href;
const FILES_TO_CACHE = shouldCache(url) ? [url] : [];

// Install: precache the app shell (index.html)
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing Service Worker... ", event);
  event.waitUntil(
    // waits until cache is not open, otherwise it would go to activation phase
    caches.open(CACHE_NAME).then(function (cache) {
      //update static version on new releases
      console.log("[Service Worker] Precaching App Shell");
      cache.addAll(FILES_TO_CACHE);
    }),
  );
});

// Activate: take control and remove old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating Service Worker... ", event);
  event.waitUntil(
    caches.keys().then((keysList) => {
      return Promise.all(
        keysList.map((key) => {
          if (key !== CACHE_NAME) {
            //keep latest version here
            console.log("[Service Worker] Removing old cache ", key);
            return caches.delete(key);
          }
        }),
      );
    }),
  );
  return self.clients.claim();
});

// Fetch: serve from cache when offline, cache successful responses for same-origin assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = request.url;

  if (request.mode !== "navigate" && !shouldCache(url)) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      if (request.mode === "navigate") {
        // SPA: always try network first for HTML, fallback to cache then index.html for offline
        try {
          const netResponse = await fetch(request);
          if (netResponse.ok) cache.put(request, netResponse.clone());
          return netResponse;
        } catch {
          const cached = await cache.match(request);
          if (cached) return cached;
          const indexUrl = new URL(
            "index.html",
            self.location.origin + basePath,
          ).href;
          return cache.match(indexUrl) || (await fetch(request));
        }
      }

      // For assets: try cache first (fast), then network and cache for next time
      const cached = await cache.match(request);
      if (cached) return cached;

      try {
        const netResponse = await fetch(request);
        if (netResponse.ok) cache.put(request, netResponse.clone());
        return netResponse;
      } catch {
        return (
          cache.match(request) ||
          new Response("", { status: 503, statusText: "Service Unavailable" })
        );
      }
    })(),
  );
});
