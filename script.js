// ==========================================
// CONFIGURACIÓN E INICIALIZACIÓN DE SUPABASE
// ==========================================
const SUPABASE_URL = 'https://vpslunexibbaapihmbrj.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_yPCMORrQyiQ1esGLUdSsJA_YfyjPhAo';

// Cliente Supabase global
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('products-grid');
  const searchInput = document.getElementById('search-input');
  const storeButtons = document.querySelectorAll('.store-filter');
  let allProducts = [];

  // ==========================================
  // CARGAR PUBLICACIONES DESDE SUPABASE
  // ==========================================
  async function loadProductsFromSupabase() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      allProducts = data || [];
      renderProducts(allProducts);
    } catch (error) {
      console.error('Error al cargar desde Supabase:', error);
      if (productsContainer) {
        productsContainer.innerHTML =
          '<p class="error" style="grid-column: 1/-1; text-align: center; color: #ef4444; font-weight: bold;">Error al cargar las publicaciones de la base de datos.</p>';
      }
    }
  }

  // ==========================================
  // FUNCIÓN PARA COMPARTIR EN REDES SOCIALES
  // ==========================================
  window.compartirPublicacion = function(titulo, descripcion, url) {
    const textoCompartir = `🔥 ¡Mira esta oferta en CrediOfertas! ${titulo} - ${descripcion}`;
    const linkFinal = url || window.location.href;

    // 1. Si está en un dispositivo móvil con soporte Web Share API
    if (navigator.share) {
      navigator.share({
        title: titulo,
        text: textoCompartir,
        url: linkFinal
      }).catch((err) => console.log('Compartir cancelado o no soportado:', err));
    } else {
      // 2. Si está en PC, abre WhatsApp Web como opción directa
      const urlWA = `https://api.whatsapp.com/send?text=${encodeURIComponent(textoCompartir + ' ' + linkFinal)}`;
      window.open(urlWA, '_blank');
    }
  };

  // ==========================================
  // RENDERIZAR TARJETAS DE PRODUCTOS / SERVICIOS
  // ==========================================
  function renderProducts(products) {
    if (!productsContainer) return;
    productsContainer.innerHTML = '';

    if (products.length === 0) {
      productsContainer.innerHTML =
        '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #64748b;">No se encontraron publicaciones en esta categoría.</p>';
      return;
    }

    products.forEach((product) => {
      const card = document.createElement('article');
      card.className = 'product-card';
      const storeClass = (product.store || 'generico').toLowerCase().replace(/\s+/g, '');
      
      // Insignia de descuento
      const discountBadge = product.discount
        ? `<span class="discount-badge">${product.discount}</span>`
        : '';

      // Insignia de Alcance de Plan ($20 Nacional / $35 Global / Local)
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

      let btnText = `Ver oferta en ${product.store || 'Tienda'}`;
      if (product.store === 'Servicios') {
        btnText = '📞 Contratar Servicio';
      } else if (product.store === 'Mayor') {
        btnText = '📦 Contactar Mayorista';
      } else if (product.store === 'Detal') {
        btnText = '🛒 Comprar al Detal';
      }

      // Escapar comillas dobles y simples para evitar rompidos sintácticos en onclick
      const safeTitle = (product.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const safeDesc = (product.description || product.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const targetUrl = product.affiliateUrl || product.affiliate_link || '#';
      const imageUrl = product.image || product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';

      card.innerHTML = `
        <div class="card-image" style="position: relative;">
          <img src="${imageUrl}" alt="${safeTitle}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'">
          <span class="store-badge ${storeClass}">${product.store || 'General'}</span>
          ${discountBadge}
        </div>
        <div class="card-content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span class="category">${product.category || 'General'} ${product.rif ? `| RIF: ${product.rif}` : ''}</span>
            ${planBadge}
          </div>
          
          <h3 class="title">${product.title}</h3>
          
          <div class="price-rating">
            <span class="price">$${formattedPrice} ${product.currency || 'USD'}</span>
            <span class="rating">⭐ ${product.rating || '5.0'}</span>
          </div>

          <!-- Botones Acción: Comprar/Contactar y Compartir Redes -->
          <div class="card-actions" style="display: flex; gap: 8px; margin-top: 12px;">
            <a href="${targetUrl}" target="_blank" rel="nofollow noopener sponsored" class="buy-btn" style="flex: 1; text-align: center;">
              ${btnText}
            </a>
            <button 
              type="button"
              onclick="compartirPublicacion('${safeTitle}', '${safeDesc}', '${targetUrl}')" 
              class="share-btn" 
              title="Compartir en WhatsApp, Instagram, Facebook..."
              style="padding: 10px 14px; background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; font-weight: bold;"
              aria-label="Compartir en redes sociales"
            >
              📲
            </button>
          </div>
        </div>
      `;
      productsContainer.appendChild(card);
    });
  }

  // ==========================================
  // FILTRADO Y BÚSQUEDA EN TIEMPO REAL
  // ==========================================
  function filterProducts() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeStoreBtn = document.querySelector('.store-filter.active');
    const selectedStore = activeStoreBtn ? activeStoreBtn.dataset.store : 'all';

    const filtered = allProducts.filter((product) => {
      const title = (product.title || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      const store = (product.store || '').toLowerCase();
      const region = (product.region || '').toLowerCase();

      const matchesSearch =
        title.includes(searchTerm) ||
        category.includes(searchTerm) ||
        store.includes(searchTerm) ||
        region.includes(searchTerm);

      const matchesStore =
        selectedStore === 'all' || store === selectedStore.toLowerCase();

      return matchesSearch && matchesStore;
    });

    renderProducts(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', filterProducts);
  storeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      storeButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      filterProducts();
    });
  });

  // Inicializar carga de datos
  loadProductsFromSupabase();
});
