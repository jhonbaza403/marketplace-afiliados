const CACHE_NAME = 'crediofertas-v2';

// Archivos requeridos para que la App funcione 100% Offline
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/products.json',
  '/logo.png',
  '/manifest.json'
];

// 1. Instalación: Guarda todos los archivos iniciales en caché
self.addEventListener('install', event => {
  self.skipWaiting(); // Fuerza la activación inmediata del SW recién instalado
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error('Error al guardar en caché durante install:', err))
  );
});

// 2. Activación: Elimina versiones antiguas del caché
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma control inmediatamente
  );
});

// 3. Intercepción de Peticiones (Fetch)
self.addEventListener('fetch', event => {
  // Ignorar peticiones que no sean GET (como POST/PUT de formularios o subida de imágenes)
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // ESTRATEGIA 1: Network-First (para datos dinámicos como 'products.json')
  if (requestUrl.pathname.endsWith('products.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(event.request)) // Fallback al caché si no hay internet
    );
    return;
  }

  // ESTRATEGIA 2: Cache-First con fallback a Red (para recursos estáticos)
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then(networkResponse => {
          // Guardar recursos válidos de origen propio dinámicamente
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Fallback de navegación: Si la petición es de tipo HTML y falla, devuelve la raíz
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
      })
  );
});
