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
  const searchInput = document.getElementById('search-input');
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
  // 2. CARGAR PUBLICACIONES DESDE SUPABASE
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
      console.error('Error al cargar datos desde Supabase:', error.message);
      if (productsContainer) {
        productsContainer.innerHTML =
          '<p class="error" style="grid-column: 1/-1; text-align: center; color: #ef4444; font-weight: bold; padding: 2rem;">Error al conectar con la base de datos. Por favor, intenta de nuevo más tarde.</p>';
      }
    }
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
  // 4. RENDERIZAR TARJETAS EN EL DOM
  // ==========================================
  function renderProducts(products) {
    if (!productsContainer) return;
    productsContainer.innerHTML = '';

    if (products.length === 0) {
      productsContainer.innerHTML =
        '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #64748b;">No se encontraron publicaciones disponibles.</p>';
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

      let btnText = `Ver oferta en ${product.store || 'Tienda'}`;
      if (product.store === 'Servicios') {
        btnText = '📞 Contratar Servicio';
      } else if (product.store === 'Mayor') {
        btnText = '📦 Contactar Mayorista';
      } else if (product.store === 'Detal') {
        btnText = '🛒 Comprar al Detal';
      }

      // Sanitización contra inyección de caracteres en atributos JS
      const safeTitle = (product.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
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

          <!-- Botonera de Acción y Viralización Redes -->
          <div class="card-actions-viral" style="display: flex; gap: 6px; margin-top: 12px;">
            <a href="${targetUrl}" target="_blank" rel="nofollow noopener sponsored" class="buy-btn" style="flex: 1; text-align: center;">
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
  // 5. REGISTRO DE EMPRESA (FORMULARIO KYC/RIF)
  // ==========================================
  if (kycForm) {
    kycForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(kycForm);
      const companyData = {
        company_name: formData.get('company_name'),
        rif: formData.get('rif'),
        email: formData.get('email'),
        phone: formData.get('phone')
      };

      const { data, error } = await supabase.from('companies').insert([companyData]);

      if (error) {
        alert('Error al registrar la empresa: ' + error.message);
      } else {
        alert('¡Empresa registrada con éxito en CrediOfertas!');
        cerrarModal(authModal);
        kycForm.reset();
      }
    });
  }

  // ==========================================
  // 6. PUBLICAR OFERTA O SERVICIO
  // ==========================================
  if (publishForm) {
    publishForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(publishForm);
      const newProduct = {
        title: formData.get('title'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        description: formData.get('description'),
        image: formData.get('image_url'),
        image_url: formData.get('image_url'),
        affiliateUrl: formData.get('affiliate_link'),
        affiliate_link: formData.get('affiliate_link'),
        store: formData.get('category')
      };

      const { data, error } = await supabase.from('products').insert([newProduct]);

      if (error) {
        alert('Error al publicar: ' + error.message);
      } else {
        alert('¡Publicación creada exitosamente!');
        cerrarModal(publishModal);
        publishForm.reset();
        loadProductsFromSupabase(); // Recargar cuadrícula en tiempo real
      }
    });
  }

  // ==========================================
  // 7. FILTRADO Y BÚSQUEDA EN TIEMPO REAL
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

  // Inicializar carga de publicaciones
  loadProductsFromSupabase();
});
