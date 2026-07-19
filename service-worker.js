// Service Worker mínimo — cachea la app para que abra rápido y funcione
// aunque no haya conexión momentánea (los datos en vivo siguen necesitando
// internet, ya que se sincronizan por Firebase).
const CACHE_NAME = 'bbx-tracker-v1';
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
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
