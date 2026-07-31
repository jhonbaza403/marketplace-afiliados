const CACHE_NAME = 'crediofertas-v3';

// Archivos requeridos para que la App funcione Offline
// Se usan rutas relativas para compatibilidad total con GitHub Pages / Vercel / Netlify
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './products.json',
  './logo.png',
  './manifest.json'
];

// 1. Instalación: Guarda los archivos en caché
self.addEventListener('install', event => {
  self.skipWaiting(); // Fuerza la activación inmediata del SW recién instalado
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      console.log('[SW] Guardando recursos iniciales...');
      // Se utiliza Promise.allSettled para que el SW se instale aunque algún archivo secundario falle
      return Promise.allSettled(
        urlsToCache.map(url => cache.add(url).catch(err => console.warn(`[SW] No se pudo cachear: ${url}`, err)))
      );
    })
  );
});

// 2. Activación: Elimina versiones antiguas de caché
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Borrando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma control inmediatamente de todas las pestañas abiertas
  );
});

// 3. Intercepción de Peticiones (Fetch)
self.addEventListener('fetch', event => {
  // Solo procesar peticiones GET
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // Ignorar peticiones de extensiones de navegador o esquemas no soportados (chrome-extension, etc.)
  if (!requestUrl.protocol.startsWith('http')) return;

  // ESTRATEGIA 1: Network-First (para datos dinámicos como 'products.json')
  if (requestUrl.pathname.endsWith('products.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(event.request)) // Fallback al caché si no hay conexión a internet
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
          // Guardar recursos válidos de origen propio en caché dinámicamente
          if (
            networkResponse && 
            networkResponse.status === 200 && 
            requestUrl.origin === location.origin
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Fallback para navegación HTML cuando no hay conexión
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html') || caches.match('./');
        }
      })
  );
});
