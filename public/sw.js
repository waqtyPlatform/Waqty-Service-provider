/// <reference lib="webworker" />

const CACHE_NAME = 'hagzy-v1';
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
];

// Install — cache app shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Fetch — Network first, fallback to cache (for navigation)
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip API requests — always go to network
    if (request.url.includes('/api/')) return;

    // Skip chrome-extension and other non-http protocols
    if (!request.url.startsWith('http')) return;

    // For navigation requests (HTML pages) — network first, fallback to cache
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache successful navigation responses
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                })
                .catch(() => {
                    // Offline — serve from cache
                    return caches.match(request).then((cached) => {
                        return cached || caches.match('/');
                    });
                })
        );
        return;
    }

    // For static assets — cache first, fallback to network
    if (
        request.url.includes('/_next/static/') ||
        request.url.includes('/icons/') ||
        request.url.endsWith('.css') ||
        request.url.endsWith('.js') ||
        request.url.endsWith('.woff2')
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                });
            })
        );
        return;
    }
});
