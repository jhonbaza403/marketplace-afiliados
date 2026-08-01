// Nombre y versión de la caché (Incrementa la versión para forzar actualización)
const CACHE_NAME = 'crediofertas-v1.0.1';

// Recursos estáticos principales
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

// Instalación: Almacena en caché de forma individual para evitar caídas por 404
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[SW] Guardando recursos estáticos en caché...');
      // Usamos Promise.allSettled para que si un recurso secundario falta, no cancele toda la instalación
      await Promise.allSettled(
        STATIC_ASSETS.map((asset) => cache.add(asset).catch((err) => console.warn(`[SW] Omitido: ${asset}`, err)))
      );
    }).then(() => self.skipWaiting())
  );
});

// Activación: Limpia cachés obsoletas y toma control de inmediato
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

// Estrategia Fetch: Network-First con fallback en Caché
self.addEventListener('fetch', (event) => {
  // Ignorar métodos no-GET (POST, PUT, DELETE, etc.)
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // Ignorar esquemas no soportados por el Cache API (ej: extensiones de navegador)
  if (!requestUrl.protocol.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Solo cachear respuestas válidas de origen propio o recursos exitosos (status 200)
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Si no hay red, intenta obtener el recurso guardado en caché
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Si es una navegación de página HTML y falla la red, devuelve index.html
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});
