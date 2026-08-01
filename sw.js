// Nombre de la caché
const CACHE_NAME = 'crediofertas-v1';

// Recursos estáticos con la nueva estructura de carpetas
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/script.js',
  './js/supabase-client.js',
  './manifest.json',
  './products.json',
  './assets/brand/logo.png',
  './assets/brand/favicon.ico',
  './assets/brand/favicon.svg',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-192x192-maskable.png',
  './assets/icons/icon-512x512.png',
  './assets/icons/icon-512x512-maskable.png',
  './assets/icons/apple-touch-icon.png'
];

// Instalación: Almacena en caché los archivos principales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Guardando recursos estáticos en caché...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activación: Limpia cachés obsoletas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Eliminando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia Fetch: Red primero, respaldo en Caché si falla la conexión
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET (como envíos de formularios a Supabase)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
