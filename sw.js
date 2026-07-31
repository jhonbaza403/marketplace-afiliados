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

// 1. Instalación: Guarda todos los archivos en el almacenamiento caché
self.addEventListener('install', event => {
  self.skipWaiting(); // Fuerza la activación inmediata del SW recién instalado
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error('Error al guardar en caché:', err))
  );
});

// 2. Activación: Elimina versiones antiguas del caché cuando se actualice el SW
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
    }).then(() => self.clients.claim()) // Toma control inmediatamente de todas las pestañas
  );
});

// 3. Intercepción de Peticiones (Fetch): Estrategia Mixta
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Para el JSON de productos: Buscar primero en red (Network-First) y fallback a caché
  if (requestUrl.pathname.endsWith('products.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Copiar la respuesta más reciente al caché
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(event.request)) // Si falla la red, carga desde caché
    );
    return;
  }

  // Para el resto de recursos estáticos: Buscar en caché primero (Cache-First) y fallback a red
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(networkResponse => {
          // Guardar recursos adicionales dinámicamente si es necesario
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        });
      })
  );
});
