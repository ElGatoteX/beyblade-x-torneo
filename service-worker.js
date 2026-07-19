// Service Worker — estrategia "network-first": siempre intenta traer la
// versión más reciente de internet primero, y solo usa la copia guardada
// si no hay conexión. Así evitamos que el celular se quede pegado en una
// versión vieja de la app cada vez que subimos cambios.
const CACHE_NAME = 'bbx-tracker-v2';
const ASSETS = ['./index.html', './arbitros.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-arbitros-192.png', './icon-arbitros-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
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
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
