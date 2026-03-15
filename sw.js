const CACHE = 'geoloc-prf-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Requisições externas (GPS APIs) sempre vai na rede
  if (!e.request.url.startsWith(self.location.origin)) {
    e.respondWith(fetch(e.request));
    return;
  }

  // HTML sempre busca fresh (network-first)
  if (e.request.url.endsWith('.html') || e.request.url.endsWith('/')) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) return res;
        return caches.match(e.request) || res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Assets usa cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
