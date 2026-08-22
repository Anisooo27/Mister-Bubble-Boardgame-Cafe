// Service Worker for Mister Bubble PWA with Auto-Update & Network-First Strategy
const BUILD_VERSION = 'v2026.08.22-build3';
const CACHE_NAME = `mister-bubble-${BUILD_VERSION}`;
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json'];

// 1. Install Event: Skip waiting immediately to activate fresh worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Force active state without waiting for previous tabs to close
  self.skipWaiting();
});

// 2. Activate Event: Claim clients immediately and purge all outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      // Take control of all open pages immediately
      return self.clients.claim();
    })
  );
});

// 3. Fetch Event: Network-First for HTML/App-Shell & Core bundles; Stale-While-Revalidate/Cache-First for immutable media
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isHtmlOrNavigation = request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html');
  const isScriptOrStyle = request.destination === 'script' || request.destination === 'style' || url.pathname.endsWith('.js') || url.pathname.endsWith('.css');

  // NETWORK-FIRST Strategy for Navigation, HTML, and core JS/CSS bundles
  if (isHtmlOrNavigation || isScriptOrStyle) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If valid response from network, cache a clone for offline fallback
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline fallback
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            if (isHtmlOrNavigation) {
              return caches.match('/index.html') || caches.match('/');
            }
          });
        })
    );
    return;
  }

  // CACHE-FIRST / STALE-WHILE-REVALIDATE for Static Assets (Images, fonts, audio, etc.)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
