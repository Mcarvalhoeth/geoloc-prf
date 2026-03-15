const CACHE = 'geoloc-prf-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  console.log('[SW] Installing cache v3');
  e.waitUntil(
    caches.open(CACHE).then(c => {
      console.log('[SW] Cache opened, adding assets');
      return c.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log('[SW] Activating - cleaning old caches');
  e.waitUntil(
    caches.keys().then(keys => {
      console.log('[SW] Found caches:', keys);
      return Promise.all(
        keys.filter(k => {
          const isOld = k !== CACHE;
          if (isOld) console.log('[SW] Deleting old cache:', k);
          return isOld;
        }).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Requisições externas (GPS APIs) sempre vai na rede
  if (!e.request.url.startsWith(self.location.origin)) {
    e.respondWith(fetch(e.request));
    return;
  }

  // HTML sempre busca fresh (network-first para evitar dados cacheados)
  if (e.request.url.endsWith('.html') || e.request.url.endsWith('/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // Assets usa cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
