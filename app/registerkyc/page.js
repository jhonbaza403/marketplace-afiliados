'use client';

import { createClient } from '@supabase/supabase-js';

// ==========================================
// CONFIGURACIÓN E INICIALIZACIÓN DE SUPABASE
// ==========================================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://TU_PROYECTO_SUPABASE.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_yPCMORrQyiQ1esGLUdSsJA_YfyjPhAo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Correo receptor de ingresos por suscripciones y comisiones
export const PAYPAL_RECEIVER_EMAIL = 'bazwjhon@gmail.com';

// ==========================================
// HELPER: NORMALIZACIÓN Y VALIDACIÓN DE URLS
// ==========================================
export function normalizarUrlContacto(urlOriginal, titulo = '') {
  if (!urlOriginal) return '#';
  
  let url = urlOriginal.trim();

  // Si es solo un número de teléfono (formato WhatsApp)
  if (/^\+?\d{8,15}$/.test(url)) {
    const numLimpio = url.replace(/\+/g, '');
    const mensaje = encodeURIComponent(`¡Hola! Me interesa tu publicación "${titulo}" en CrediOfertas.`);
    return `https://wa.me/${numLimpio}?text=${mensaje}`;
  }

  if (url.startsWith('wa.me/')) {
    return `https://${url}`;
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }

  return url;
}

// Helper global para compartir en redes sociales
export function compartirRedSocial(red, titulo, url) {
  if (typeof window === 'undefined') return;
  
  const linkFinal = url || window.location.href;
  const mensaje = encodeURIComponent(`🔥 ¡Mira esta oferta en CrediOfertas! ${titulo}\n👉 ${linkFinal}`);

  let shareUrl = '';

  switch (red) {
    case 'whatsapp':
      shareUrl = `https://api.whatsapp.com/send?text=${mensaje}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkFinal)}`;
      break;
    case 'x':
      shareUrl = `https://twitter.com/intent/tweet?text=${mensaje}`;
      break;
    case 'native':
      if (navigator.share) {
        navigator.share({
          title: titulo,
          text: `🔥 ¡Mira esta oferta! ${titulo}`,
          url: linkFinal
        }).catch(() => {});
        return;
      } else {
        navigator.clipboard.writeText(linkFinal);
        alert('¡Enlace copiado al portapapeles!');
        return;
      }
  }

  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=450');
  }
}

// Inicializador de eventos para el DOM en cliente
export function initRegisterKyc() {
  if (typeof window === 'undefined') return;

  const startApp = async () => {
    // Elementos DOM Principales
    const productsContainer = document.getElementById('products-grid');
    const searchInput = document.getElementById('search-input') || document.getElementById('search-bar');
    const storeButtons = document.querySelectorAll('.store-filter');

    // Modales
    const authModal = document.getElementById('auth-modal');
    const publishModal = document.getElementById('publish-modal');
    const openAuthBtn = document.getElementById('open-auth-btn');
    const openPublishBtn = document.getElementById('open-publish-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const closePublishModalBtn = document.getElementById('close-publish-modal-btn');

    // Formularios
    const kycForm = document.getElementById('kyc-form');
    const publishForm = document.getElementById('publish-form');
    const loginForm = document.getElementById('login-form');

    let allProducts = [];
    let currentUser = null;

    // ==========================================
    // PWA 1. REGISTRO DE SERVICE WORKER
    // ==========================================
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => {
            console.log('✅ Service Worker registrado con éxito. Escopo:', reg.scope);
          })
          .catch((err) => {
            console.warn('⚠️ Error al registrar el Service Worker:', err);
          });
      });
    }

    // ==========================================
    // PWA 2. CONTROL DE EVENTO E INSTALACIÓN (BANNER PWA)
    // ==========================================
    let deferredPrompt = null;
    const pwaInstallBanner = document.getElementById('pwa-install-banner');
    const installPwaBtn = document.getElementById('install-pwa-btn');
    const closePwaBannerBtn = document.getElementById('close-pwa-banner-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (pwaInstallBanner) {
        pwaInstallBanner.classList.remove('hidden');
      }
    });

    if (installPwaBtn) {
      installPwaBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Respuesta de instalación PWA: ${outcome}`);
        deferredPrompt = null;
        if (pwaInstallBanner) pwaInstallBanner.classList.add('hidden');
      });
    }

    if (closePwaBannerBtn) {
      closePwaBannerBtn.addEventListener('click', () => {
        if (pwaInstallBanner) pwaInstallBanner.classList.add('hidden');
      });
    }

    window.addEventListener('appinstalled', () => {
      console.log('🎉 ¡CrediOfertas PWA se instaló correctamente!');
      if (pwaInstallBanner) pwaInstallBanner.classList.add('hidden');
    });

    // ==========================================
    // PWA 3. DETECCIÓN DE CONEXIÓN (OFFLINE/ONLINE)
    // ==========================================
    const offlineBanner = document.getElementById('offline-banner');

    function updateOnlineStatus() {
      if (!navigator.onLine) {
        if (offlineBanner) {
          offlineBanner.textContent = '📡 Estás en modo sin conexión (Offline). Mostrando datos guardados en caché.';
          offlineBanner.classList.add('visible');
        }
      } else {
        if (offlineBanner) {
          offlineBanner.classList.remove('visible');
        }
      }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    // ==========================================
    // 1. AUTENTICACIÓN Y CONTROL DE SESIÓN
    // ==========================================
    async function checkUserSession() {
      if (!supabase) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        currentUser = session ? session.user : null;
        updateAuthUI();
      } catch (e) {
        console.warn('⚠️ No se pudo obtener la sesión:', e.message);
      }
    }

    function updateAuthUI() {
      if (openAuthBtn) {
        if (currentUser) {
          openAuthBtn.textContent = '👤 Mi Cuenta';
          openAuthBtn.classList.add('logged-in');
        } else {
          openAuthBtn.textContent = '🔑 Iniciar Sesión / Registro';
          openAuthBtn.classList.remove('logged-in');
        }
      }
    }

    if (supabase) {
      supabase.auth.onAuthStateChange((_event, session) => {
        currentUser = session ? session.user : null;
        updateAuthUI();
      });

      await checkUserSession();
    }

    if (loginForm && supabase) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        const isSignUp = loginForm.dataset.mode === 'signup';

        if (isSignUp) {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: loginForm.full_name?.value || '' } }
          });
          if (error) alert('⚠️ Error al registrarse: ' + error.message);
          else alert('🎉 Registro exitoso. ¡Bienvenido a CrediOfertas!');
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) alert('⚠️ Error al iniciar sesión: ' + error.message);
          else alert('✅ Sesión iniciada correctamente');
        }
        cerrarModal(authModal);
      });
    }

    // ==========================================
    // 2. MANEJO Y CONTROL DE MODALES
    // ==========================================
    const abrirModal = (modal) => modal?.classList.remove('hidden');
    const cerrarModal = (modal) => modal?.classList.add('hidden');

    if (openAuthBtn) openAuthBtn.addEventListener('click', () => abrirModal(authModal));
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => cerrarModal(authModal));

    if (openPublishBtn) {
      openPublishBtn.addEventListener('click', () => {
        if (!currentUser && supabase) {
          alert('Debes iniciar sesión para publicar un producto o servicio.');
          abrirModal(authModal);
          return;
        }
        abrirModal(publishModal);
      });
    }
    if (closePublishModalBtn) closePublishModalBtn.addEventListener('click', () => cerrarModal(publishModal));

    document.querySelectorAll('[data-modal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-modal');
        const targetModal = document.getElementById(targetId);
        if (targetModal) abrirModal(targetModal);
      });
    });

    document.querySelectorAll('.close-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        cerrarModal(authModal);
        cerrarModal(publishModal);
      });
    });

    window.addEventListener('click', (e) => {
      if (e.target === authModal) cerrarModal(authModal);
      if (e.target === publishModal) cerrarModal(publishModal);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        cerrarModal(authModal);
        cerrarModal(publishModal);
      }
    });

    // ==========================================
    // 3. CARGAR PUBLICACIONES (SUPABASE + LOCAL)
    // ==========================================
    async function loadProductsFromSupabase() {
      let supabaseProducts = [];
      let localProducts = [];

      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (error) throw error;
          supabaseProducts = data || [];
        } catch (error) {
          console.warn('Conexión remota con Supabase omitida o con error:', error.message);
        }
      }

      try {
        const res = await fetch('./products.json');
        if (res.ok) {
          localProducts = await res.json();
        }
      } catch (e) {
        console.warn('Archivo local products.json no encontrado.');
      }

      allProducts = [...supabaseProducts, ...localProducts];

      if (allProducts.length === 0 && productsContainer) {
        productsContainer.innerHTML =
          '<p class="error" style="grid-column: 1/-1; text-align: center; color: #64748b; font-weight: bold; padding: 2rem;">No hay publicaciones disponibles en este momento.</p>';
        return;
      }

      renderProducts(allProducts);
    }

    // ==========================================
    // 4. HELPER: MOSTRAR VIDEO O IMAGEN
    // ==========================================
    function renderMediaElement(videoUrl, imageUrl, safeTitle) {
      if (videoUrl && videoUrl.trim() !== '') {
        const videoTrimmed = videoUrl.trim();
        
        if (videoTrimmed.includes('youtube.com') || videoTrimmed.includes('youtu.be')) {
          let embedUrl = videoTrimmed;
          if (videoTrimmed.includes('watch?v=')) {
            embedUrl = videoTrimmed.replace('watch?v=', 'embed/');
          } else if (videoTrimmed.includes('youtu.be/')) {
            embedUrl = videoTrimmed.replace('youtu.be/', 'www.youtube.com/embed/');
          }
          return `
            <div class="video-container">
              <iframe src="${embedUrl}" allowfullscreen loading="lazy" title="${safeTitle}"></iframe>
            </div>
          `;
        }

        return `
          <video controls playsinline preload="metadata" poster="${imageUrl}" style="width: 100%; max-height: 230px; object-fit: cover; border-radius: 8px 8px 0 0;">
            <source src="${videoTrimmed}" type="video/mp4">
            Tu navegador no soporta reproducción de video.
          </video>
        `;
      }

      return `
        <img src="${imageUrl}" alt="${safeTitle}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'" style="width: 100%; height: 200px; object-fit: cover;">
      `;
    }

    // ==========================================
    // 5. RENDERIZAR TARJETAS EN EL DOM
    // ==========================================
    function renderProducts(products) {
      if (!productsContainer) return;
      productsContainer.innerHTML = '';

      if (products.length === 0) {
        productsContainer.innerHTML =
          '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #64748b;">No se encontraron publicaciones disponibles para este filtro.</p>';
        return;
      }

      products.forEach((product) => {
        const card = document.createElement('article');
        card.className = 'product-card';
        
        const productType = (product.type || 'detal').toLowerCase();
        const storeLower = (product.store || '').toLowerCase();
        const categoryLower = (product.category || '').toLowerCase();
        const storeClass = (product.type || product.category || 'generico').toLowerCase().replace(/\s+/g, '');

        const discountBadge = product.discount
          ? `<span class="discount-badge">${product.discount}</span>`
          : '';

        let planBadge = '';
        if (product.plan === 'global') {
          planBadge = `<span class="plan-badge global">🌍 Global</span>`;
        } else if (product.plan === 'nacional') {
          planBadge = `<span class="plan-badge nacional">🇻🇪 Nacional</span>`;
        } else if (product.region) {
          planBadge = `<span class="plan-badge local">📍 ${product.region}</span>`;
        }

        const formattedPrice =
          typeof product.price === 'number'
            ? product.price.toFixed(2)
            : parseFloat(product.price || 0).toFixed(2);

        const rawUrl = product.affiliateUrl || product.affiliate_link || product.url || product.link || '';
        const safeTitle = (product.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const targetUrl = normalizarUrlContacto(rawUrl, product.title);

        const esAfiliado = ['amazon', 'shein', 'aliexpress', 'alibaba'].includes(storeLower) || 
                           ['amazon', 'shein', 'aliexpress', 'alibaba'].includes(categoryLower);

        let btnText = '🛒 Comprar al Detal';
        let btnClass = 'whatsapp-btn';

        if (esAfiliado) {
          btnText = `🛒 Ver oferta en ${product.store || product.category || 'Tienda'}`;
          btnClass = 'affiliate-btn';
        } else if (productType === 'servicio' || categoryLower.includes('servicio')) {
          btnText = '🛠️ Contratar Servicio';
          btnClass = 'service-btn';
        } else if (productType === 'mayorista' || categoryLower.includes('mayor')) {
          btnText = '📦 Contactar Mayorista';
          btnClass = 'mayor-btn';
        }

        const imageUrl = product.image_url || product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
        const videoUrl = product.video_url || product.video || '';

        const mediaHtml = renderMediaElement(videoUrl, imageUrl, safeTitle);

        card.innerHTML = `
          <div class="card-image">
            ${mediaHtml}
            <span class="store-badge ${storeClass}">${product.type ? product.type.toUpperCase() : (product.category || 'DETAL')}</span>
            ${discountBadge}
          </div>
          <div class="card-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span class="category">${product.category || 'General'} ${product.rif ? `| RIF: ${product.rif}` : ''}</span>
              ${planBadge}
            </div>
            
            <h3 class="title">${product.title}</h3>
            
            <p class="description">
              ${product.description || ''}
            </p>

            <div class="price-rating">
              <span class="price">$${formattedPrice} ${product.currency || 'USD'}</span>
              <span class="rating">⭐ ${product.rating || '5.0'}</span>
            </div>

            <div class="card-actions-viral">
              <a href="${targetUrl}" target="_blank" rel="nofollow noopener sponsored" class="btn-action ${btnClass}">
                ${btnText}
              </a>
              
              <button 
                type="button"
                class="share-btn"
                onclick="window.compartirRedSocial && window.compartirRedSocial('whatsapp', '${safeTitle}', '${targetUrl}')" 
                title="Compartir en WhatsApp"
              >💬</button>

              <button 
                type="button"
                class="share-btn"
                style="background-color: #64748b;"
                onclick="window.compartirRedSocial && window.compartirRedSocial('native', '${safeTitle}', '${targetUrl}')" 
                title="Copiar enlace o Compartir"
              >📲</button>
            </div>
          </div>
        `;
        productsContainer.appendChild(card);
      });
    }

    // ==========================================
    // 6. REGISTRO DE EMPRESA (FORMULARIO KYC/RIF VÍA API)
    // ==========================================
    if (kycForm) {
      kycForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = kycForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const formData = new FormData(kycForm);
        if (currentUser) {
          formData.append('userId', currentUser.id);
        }

        try {
          const response = await fetch('/api/kyc', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Error al procesar la solicitud.');
          }

          alert('🎉 ' + result.message);
          cerrarModal(authModal);
          kycForm.reset();
        } catch (err) {
          alert('⚠️ Error al registrar KYC: ' + err.message);
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }

    // ==========================================
    // 7. PUBLICAR OFERTA CON SUBIDA DE ARCHIVOS (STORAGE 'media')
    // ==========================================
    if (publishForm && supabase) {
      publishForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentUser) {
          alert('Debes iniciar sesión para publicar.');
          return;
        }

        const submitBtn = publishForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const formData = new FormData(publishForm);
        let imageUrl = formData.get('image_url') || '';
        let videoUrl = formData.get('video_url') || '';

        const imageFile = formData.get('image_file');
        const videoFile = formData.get('video_file');

        try {
          if (imageFile && imageFile.size > 0) {
            const filePath = `images/${Date.now()}_${imageFile.name}`;
            const { data, error } = await supabase.storage.from('media').upload(filePath, imageFile);
            if (!error && data) {
              const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath);
              imageUrl = publicUrlData.publicUrl;
            }
          }

          if (videoFile && videoFile.size > 0) {
            const filePath = `videos/${Date.now()}_${videoFile.name}`;
            const { data, error } = await supabase.storage.from('media').upload(filePath, videoFile);
            if (!error && data) {
              const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath);
              videoUrl = publicUrlData.publicUrl;
            }
          }
        } catch (err) {
          console.warn('⚠️ Ocurrió una advertencia en la carga de archivos a Storage:', err.message);
        }

        const newProduct = {
          user_id: currentUser.id,
          title: formData.get('title'),
          category: formData.get('category'),
          type: formData.get('type') || 'detal',
          price: parseFloat(formData.get('price') || 0),
          description: formData.get('description'),
          image_url: imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
          video_url: videoUrl || null,
          affiliate_link: formData.get('affiliate_link'),
          accept_policy: true
        };

        const { error } = await supabase.from('products').insert([newProduct]);

        if (error) {
          alert('⚠️ Error al publicar: ' + error.message);
        } else {
          alert('🚀 ¡Publicación creada exitosamente!');
          cerrarModal(publishModal);
          publishForm.reset();
          loadProductsFromSupabase();
        }

        if (submitBtn) submitBtn.disabled = false;
      });
    }

    // ==========================================
    // 8. FILTRADO Y BÚSQUEDA EN TIEMPO REAL
    // ==========================================
    function filterProducts() {
      const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const activeStoreBtn = document.querySelector('.store-filter.active');
      
      const rawFilter = activeStoreBtn 
        ? (activeStoreBtn.dataset.filter || activeStoreBtn.dataset.store || 'all')
        : 'all';

      const selectedFilter = rawFilter.toLowerCase().trim();

      const filtered = allProducts.filter((product) => {
        const title = (product.title || '').toLowerCase();
        const category = (product.category || '').toLowerCase();
        const store = (product.store || '').toLowerCase();
        const type = (product.type || '').toLowerCase();
        const description = (product.description || '').toLowerCase();

        const matchesSearch =
          !searchTerm ||
          title.includes(searchTerm) ||
          category.includes(searchTerm) ||
          store.includes(searchTerm) ||
          description.includes(searchTerm);

        let matchesStore = false;
        if (selectedFilter === 'all') {
          matchesStore = true;
        } else {
          matchesStore =
            category.includes(selectedFilter) ||
            store.includes(selectedFilter) ||
            type.includes(selectedFilter) ||
            description.includes(selectedFilter);
        }

        return matchesSearch && matchesStore;
      });

      renderProducts(filtered);
    }

    if (searchInput) {
      searchInput.addEventListener('input', filterProducts);
    }

    storeButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        storeButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        filterProducts();
      });
    });

    // ==========================================
    // 9. ACTUALIZACIONES EN TIEMPO REAL (REALTIME)
    // ==========================================
    if (supabase) {
      supabase
        .channel('public:products')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'products' }, (payload) => {
          console.log('⚡ Nueva oferta detectada en tiempo real:', payload.new);
          allProducts.unshift(payload.new);
          renderProducts(allProducts);
        })
        .subscribe();
    }

    // Inicializar carga de publicaciones
    loadProductsFromSupabase();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }
}
