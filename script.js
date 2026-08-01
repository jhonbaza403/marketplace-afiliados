// ==========================================
// CONFIGURACIÓN E INICIALIZACIÓN DE SUPABASE
// ==========================================
const SUPABASE_URL = 'https://vpslunexibbaapihmbrj.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_yPCMORrQyiQ1esGLUdSsJA_YfyjPhAo';

// Inicialización del cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

document.addEventListener('DOMContentLoaded', () => {
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

  let allProducts = [];

  // ==========================================
  // 1. MANEJO Y CONTROL DE MODALES
  // ==========================================
  const abrirModal = (modal) => modal?.classList.remove('hidden');
  const cerrarModal = (modal) => modal?.classList.add('hidden');

  if (openAuthBtn) openAuthBtn.addEventListener('click', () => abrirModal(authModal));
  if (closeModalBtn) closeModalBtn.addEventListener('click', () => cerrarModal(authModal));

  if (openPublishBtn) openPublishBtn.addEventListener('click', () => abrirModal(publishModal));
  if (closePublishModalBtn) closePublishModalBtn.addEventListener('click', () => cerrarModal(publishModal));

  // Modales con atributo data-modal genérico
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

  // Cerrar modal al hacer clic en el fondo o presionar 'Esc'
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
  // 2. CARGAR PUBLICACIONES (SUPABASE + LOCAL)
  // ==========================================
  async function loadProductsFromSupabase() {
    let supabaseProducts = [];
    let localProducts = [];

    // 1. Cargar desde Supabase
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      supabaseProducts = data || [];
    } catch (error) {
      console.warn('Conexión remota con Supabase omitida o con error:', error.message);
    }

    // 2. Fallback: Cargar catálogo estático si existe
    try {
      const res = await fetch('./products.json');
      if (res.ok) {
        localProducts = await res.json();
      }
    } catch (e) {
      console.warn('Archivo local products.json no encontrado.');
    }

    // Unificar catálogos (los nuevos de Supabase van primero)
    allProducts = [...supabaseProducts, ...localProducts];

    if (allProducts.length === 0 && productsContainer) {
      productsContainer.innerHTML =
        '<p class="error" style="grid-column: 1/-1; text-align: center; color: #64748b; font-weight: bold; padding: 2rem;">No hay publicaciones disponibles en este momento.</p>';
      return;
    }

    renderProducts(allProducts);
  }

  // ==========================================
  // 3. VIRALIZACIÓN Y COMPARTIR EN REDES
  // ==========================================
  window.compartirRedSocial = function(red, titulo, url) {
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
  };

  // ==========================================
  // 4. HELPER: MOSTRAR VIDEO O IMAGEN
  // ==========================================
  function renderMediaElement(videoUrl, imageUrl, safeTitle) {
    if (videoUrl && videoUrl.trim() !== '') {
      const videoTrimmed = videoUrl.trim();
      
      // Si es un enlace de YouTube
      if (videoTrimmed.includes('youtube.com') || videoTrimmed.includes('youtu.be')) {
        let embedUrl = videoTrimmed;
        if (videoTrimmed.includes('watch?v=')) {
          embedUrl = videoTrimmed.replace('watch?v=', 'embed/');
        } else if (videoTrimmed.includes('youtu.be/')) {
          embedUrl = videoTrimmed.replace('youtu.be/', 'www.youtube.com/embed/');
        }
        return `
          <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
            <iframe src="${embedUrl}" style="position: absolute; top:0; left:0; width:100%; height:100%; border:0;" allowfullscreen loading="lazy"></iframe>
          </div>
        `;
      }

      // Si es un archivo de video directo MP4/WebM
      return `
        <video controls playsinline preload="metadata" poster="${imageUrl}" style="width: 100%; max-height: 230px; object-fit: cover; border-radius: 8px 8px 0 0;">
          <source src="${videoTrimmed}" type="video/mp4">
          Tu navegador no soporta reproducción de video.
        </video>
      `;
    }

    // Por defecto, renderiza la imagen previa
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
      const storeClass = (product.store || product.category || 'generico').toLowerCase().replace(/\s+/g, '');

      // Insignia de descuento
      const discountBadge = product.discount
        ? `<span class="discount-badge">${product.discount}</span>`
        : '';

      // Insignia de Plan o Alcance
      let planBadge = '';
      if (product.plan === 'global') {
        planBadge = `<span class="plan-badge global" style="background: #8b5cf6; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: bold;">🌍 Global</span>`;
      } else if (product.plan === 'nacional') {
        planBadge = `<span class="plan-badge nacional" style="background: #2563eb; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: bold;">🇻🇪 Nacional</span>`;
      } else if (product.region) {
        planBadge = `<span class="plan-badge local" style="background: #64748b; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem;">📍 ${product.region}</span>`;
      }

      const formattedPrice =
        typeof product.price === 'number'
          ? product.price.toFixed(2)
          : parseFloat(product.price || 0).toFixed(2);

      let btnText = `Ver oferta en ${product.store || product.category || 'Tienda'}`;
      const storeType = (product.store || product.category || '').toLowerCase();
      if (storeType.includes('servicio')) {
        btnText = '📞 Contratar Servicio';
      } else if (storeType.includes('mayor')) {
        btnText = '📦 Contactar Mayorista';
      } else if (storeType.includes('detal')) {
        btnText = '🛒 Comprar al Detal';
      }

      // Sanitización contra inyección de caracteres en atributos JS
      const safeTitle = (product.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const targetUrl = product.affiliateUrl || product.affiliate_link || '#';
      const imageUrl = product.image || product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
      const videoUrl = product.video_url || product.video || '';

      const mediaHtml = renderMediaElement(videoUrl, imageUrl, safeTitle);

      card.innerHTML = `
        <div class="card-image" style="position: relative; overflow: hidden; border-radius: 8px 8px 0 0;">
          ${mediaHtml}
          <span class="store-badge ${storeClass}" style="position: absolute; top: 10px; left: 10px; z-index: 2;">${product.store || product.category || 'General'}</span>
          ${discountBadge}
        </div>
        <div class="card-content" style="padding: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="category" style="font-size: 0.8rem; color: #64748b; font-weight: 600;">${product.category || 'General'} ${product.rif ? `| RIF: ${product.rif}` : ''}</span>
            ${planBadge}
          </div>
          
          <h3 class="title" style="font-size: 1.1rem; margin: 0 0 8px 0; color: #0f172a;">${product.title}</h3>
          
          <p class="description" style="font-size: 0.85rem; color: #475569; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${product.description || ''}
          </p>

          <div class="price-rating" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span class="price" style="font-size: 1.25rem; font-weight: 800; color: #2563eb;">$${formattedPrice} ${product.currency || 'USD'}</span>
            <span class="rating" style="font-size: 0.9rem; font-weight: bold; color: #f59e0b;">⭐ ${product.rating || '5.0'}</span>
          </div>

          <!-- Botonera de Acción y Viralización Redes -->
          <div class="card-actions-viral" style="display: flex; gap: 6px; margin-top: 12px;">
            <a href="${targetUrl}" target="_blank" rel="nofollow noopener sponsored" class="buy-btn" style="flex: 1; text-align: center; text-decoration: none;">
              ${btnText}
            </a>
            
            <button 
              type="button"
              onclick="compartirRedSocial('whatsapp', '${safeTitle}', '${targetUrl}')" 
              title="Compartir en WhatsApp"
              style="padding: 8px 10px; background: #25D366; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;"
            >💬</button>

            <button 
              type="button"
              onclick="compartirRedSocial('native', '${safeTitle}', '${targetUrl}')" 
              title="Copiar enlace o Compartir"
              style="padding: 8px 10px; background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; font-weight: bold;"
            >📲</button>
          </div>
        </div>
      `;
      productsContainer.appendChild(card);
    });
  }

  // ==========================================
  // 6. REGISTRO DE EMPRESA (FORMULARIO KYC/RIF)
  // ==========================================
  if (kycForm) {
    kycForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = kycForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const formData = new FormData(kycForm);
      const companyData = {
        company_name: formData.get('company_name'),
        rif: formData.get('rif'),
        email: formData.get('email'),
        phone: formData.get('phone')
      };

      const { data, error } = await supabase.from('companies').insert([companyData]);

      if (error) {
        alert('⚠️ Error al registrar la empresa: ' + error.message);
      } else {
        alert('🎉 ¡Empresa registrada con éxito en CrediOfertas!');
        cerrarModal(authModal);
        kycForm.reset();
      }

      if (submitBtn) submitBtn.disabled = false;
    });
  }

  // ==========================================
  // 7. PUBLICAR OFERTA O SERVICIO
  // ==========================================
  if (publishForm) {
    publishForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = publishForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const formData = new FormData(publishForm);
      const categoryVal = formData.get('category');
      const newProduct = {
        title: formData.get('title'),
        category: categoryVal,
        price: parseFloat(formData.get('price')),
        description: formData.get('description'),
        image: formData.get('image_url'),
        image_url: formData.get('image_url'),
        video_url: formData.get('video_url') || null,
        affiliateUrl: formData.get('affiliate_link'),
        affiliate_link: formData.get('affiliate_link'),
        store: categoryVal,
        accept_policy: formData.get('acepta_politicas') === 'Sí' || true
      };

      const { data, error } = await supabase.from('products').insert([newProduct]);

      if (error) {
        alert('⚠️ Error al publicar: ' + error.message);
      } else {
        alert('🚀 ¡Publicación creada exitosamente!');
        cerrarModal(publishModal);
        publishForm.reset();
        loadProductsFromSupabase(); // Recargar cuadrícula
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
    
    // Capturar valor de 'data-filter' o 'data-store' de forma flexible
    const rawFilter = activeStoreBtn 
      ? (activeStoreBtn.dataset.filter || activeStoreBtn.dataset.store || 'all')
      : 'all';

    const selectedFilter = rawFilter.toLowerCase().trim();

    const filtered = allProducts.filter((product) => {
      const title = (product.title || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      const store = (product.store || '').toLowerCase();
      const region = (product.region || '').toLowerCase();
      const description = (product.description || '').toLowerCase();

      // Coincidencia con el texto del buscador
      const matchesSearch =
        !searchTerm ||
        title.includes(searchTerm) ||
        category.includes(searchTerm) ||
        store.includes(searchTerm) ||
        region.includes(searchTerm) ||
        description.includes(searchTerm);

      // Coincidencia con los botones de filtro
      let matchesStore = false;
      if (selectedFilter === 'all') {
        matchesStore = true;
      } else {
        matchesStore =
          category.includes(selectedFilter) ||
          store.includes(selectedFilter) ||
          description.includes(selectedFilter);
      }

      return matchesSearch && matchesStore;
    });

    renderProducts(filtered);
  }

  // Evento para el buscador
  if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
  }

  // Evento para los botones de las categorías / tiendas
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
  supabase
    .channel('public:products')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'products' }, (payload) => {
      console.log('⚡ Nueva oferta detectada en tiempo real:', payload.new);
      allProducts.unshift(payload.new);
      renderProducts(allProducts);
    })
    .subscribe();

  // Inicializar carga de publicaciones
  loadProductsFromSupabase();
});
