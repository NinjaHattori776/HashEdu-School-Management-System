// Minimal service worker — caches the app shell so the login page and static
// assets load instantly on repeat visits, and gives a basic offline fallback.
// This is NOT a full offline-first app (API calls still require network) —
// just enough to make the "Add to Home Screen" install feel like a real app.
const CACHE_NAME = 'hashedu-shell-v1';
const SHELL_URLS = ['/', '/login'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Never cache API calls — always go to network for those.
    if (event.request.url.includes('/api/')) return;

    event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
});
