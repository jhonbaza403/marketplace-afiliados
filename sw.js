// ==========================================
// CONFIGURACIÓN Y VERSIÓN DE LA CACHÉ PWA
// ==========================================
const CACHE_NAME = 'crediofertas-v1.0.3';

// Recursos estáticos indispensables para el funcionamiento offline
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/products.json',
  '/productos.json',
  '/css/styles.css',
  '/js/app.js'
];

// ==========================================
// 1. INSTALACIÓN DEL SERVICE WORKER
// Precaché tolerante a fallos mediante Promise.allSettled
// ==========================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[SW] Guardando recursos estáticos en caché...');
      
      const results = await Promise.allSettled(
        STATIC_ASSETS.map(async (asset) => {
          try {
            await cache.add(asset);
          } catch (err) {
            console.warn(`[SW] No se pudo precachear el recurso: ${asset}`, err);
          }
        })
      );
      
      console.log('[SW] Precaché completado.');
    }).then(() => self.skipWaiting())
  );
});

// ==========================================
// 2. ACTIVACIÓN Y LIMPIEZA DE CACHÉ ANTIGUA
// ==========================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Eliminando caché obsoleta:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ==========================================
// 3. ESTRATEGIA DE RED Y CACHÉ (Network First con Fallback a Caché)
// ==========================================
self.addEventListener('fetch', (event) => {
  // Solo interceptar solicitudes HTTP/HTTPS de tipo GET
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // Ignorar esquemas que no sean HTTP/HTTPS (extensiones de Chrome, etc.)
  if (!requestUrl.protocol.startsWith('http')) return;

  // Ignorar llamadas a la API de Supabase o servicios externos en la caché estática
  if (requestUrl.hostname.includes('supabase.co')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Almacenar únicamente respuestas válidas de origen propio
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (networkResponse.type === 'basic' || networkResponse.type === 'cors')
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        console.log(`[SW] Modo Offline: Intentando recuperar "${event.request.url}" desde caché`);
        
        // 1. Intentar responder con la copia exacta en caché
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // 2. Fallback de navegación: Si el usuario está navegando entre páginas offline, servir "/"
        if (event.request.mode === 'navigate') {
          const fallbackPage = await caches.match('/') || await caches.match('/index.html');
          if (fallbackPage) {
            return fallbackPage;
          }
        }

        // 3. Responder con un error HTTP básico si no existe copia en caché
        return new Response('Contenido no disponible sin conexión', {
          status: 533,
          statusText: 'Offline',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })
  );
});
