// ==========================================
// 1. CONFIGURACIÓN E INICIALIZACIÓN DE SUPABASE
// ==========================================
const SUPABASE_URL = 'https://vpslunexibbaapihmbrj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_yPCMORrQyiQ1esGLUdSsJA_YfyjPhAo';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
  let allProducts = [];

  const productsContainer = document.getElementById('products-grid');
  const searchInput = document.getElementById('search-input');
  const storeButtons = document.querySelectorAll('.store-filter');

  // Control del Modal 1: Registro / Verificación (KYC / Registro de Empresa)
  const authModal = document.getElementById('auth-modal');
  const openAuthBtn = document.getElementById('open-auth-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const kycForm = document.getElementById('kyc-form');

  if (openAuthBtn && authModal) {
    openAuthBtn.addEventListener('click', () => {
      authModal.classList.remove('hidden');
    });
  }

  if (closeModalBtn && authModal) {
    closeModalBtn.addEventListener('click', () => {
      authModal.classList.add('hidden');
    });
  }

  // REGISTRO DE EMPRESA CON RIF EN SUPABASE (KYC Form)
  if (kycForm) {
    kycForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = kycForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Registrando...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(kycForm);
        const email = formData.get('email');
        const password = formData.get('password');
        const companyName = formData.get('company_name') || formData.get('nombre');
        const rif = formData.get('rif');
        const phone = formData.get('phone') || formData.get('telefono');

        // 1. Registrar usuario en la autenticación de Supabase
        const { data, error: authError } = await supabase.auth.signUp({
          email: email,
          password: password,
        });

        if (authError) throw authError;

        // 2. Guardar los datos fiscales (RIF) de la tienda
        if (data.user) {
          const { error: storeError } = await supabase.from('stores').insert([
            {
              id: data.user.id,
              company_name: companyName,
              rif: rif,
              phone: phone,
            },
          ]);

          if (storeError) throw storeError;
        }

        alert('¡Registro enviado con éxito! Tu empresa y tu RIF han sido registrados.');
        kycForm.reset();
        if (authModal) authModal.classList.add('hidden');
      } catch (err) {
        console.error('Error en el registro:', err);
        alert('Error al registrar la empresa: ' + (err.message || 'Inténtalo nuevamente.'));
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Control del Modal 2: Publicar Oferta / Servicio
  const publishModal = document.getElementById('publish-modal');
  const openPublishBtn = document.getElementById('open-publish-btn');
  const closePublishModalBtn = document.getElementById('close-publish-modal-btn');
  const publishForm = document.getElementById('publish-form');

  if (openPublishBtn && publishModal) {
    openPublishBtn.addEventListener('click', () => {
      publishModal.classList.remove('hidden');
    });
  }

  if (closePublishModalBtn && publishModal) {
    closePublishModalBtn.addEventListener('click', () => {
      publishModal.classList.add('hidden');
    });
  }

  // PUBLICAR PRODUCTO / SERVICIO EN SUPABASE (Publish Form)
  if (publishForm) {
    publishForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = publishForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Publicando...';
      submitBtn.disabled = true;

      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          alert('Debes estar registrado y haber iniciado sesión para poder publicar.');
          return;
        }

        const formData = new FormData(publishForm);
        const newProduct = {
          store_id: user.id,
          title: formData.get('title') || formData.get('titulo'),
          description: formData.get('description') || formData.get('descripcion'),
          price: parseFloat(formData.get('price') || formData.get('precio') || 0),
          category: formData.get('category') || formData.get('categoria'),
          image_url: formData.get('image_url') || formData.get('imagen'),
          affiliate_link: formData.get('affiliate_link') || formData.get('enlace'),
        };

        const { error } = await supabase.from('products').insert([newProduct]);

        if (error) throw error;

        alert('¡Publicación creada con éxito! Ya se encuentra en el catálogo.');
        publishForm.reset();
        if (publishModal) publishModal.classList.add('hidden');

        // Recargar los productos desde la base de datos
        loadProductsFromSupabase();
      } catch (err) {
        console.error('Error al publicar:', err);
        alert('Error al guardar la publicación: ' + (err.message || 'Inténtalo de nuevo.'));
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Cerrar modales al hacer clic fuera del recuadro
  window.addEventListener('click', (e) => {
    if (e.target === authModal) {
      authModal.classList.add('hidden');
    }
    if (e.target === publishModal) {
      publishModal.classList.add('hidden');
    }
  });

  // Cerrar modales al presionar la tecla Esc
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (authModal) authModal.classList.add('hidden');
      if (publishModal) publishModal.classList.add('hidden');
    }
  });

  // Detección de Accesos Directos PWA (Shortcuts de URL)
  const urlParams = new URLSearchParams(window.location.search);
  const actionParam = urlParams.get('action');
  if (actionParam === 'publish' && publishModal) {
    publishModal.classList.remove('hidden');
  } else if (actionParam === 'kyc' && authModal) {
    authModal.classList.remove('hidden');
  }

  // ==========================================
  // CARGAR PRODUCTOS DESDE SUPABASE
  // ==========================================
  async function loadProductsFromSupabase() {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*, stores(company_name, rif)');

      if (error) throw error;

      // Mapear los datos de la base de datos al formato del renderizado
      allProducts = products.map((prod) => ({
        id: prod.id,
        title: prod.title,
        category: prod.category || 'General',
        price: prod.price,
        image: prod.image_url || 'https://via.placeholder.com/300x200?text=Sin+Imagen',
        affiliateUrl: prod.affiliate_link || '#',
        store: prod.stores ? prod.stores.company_name : 'Tienda Externa',
        rif: prod.stores ? prod.stores.rif : '',
        currency: 'USD',
        rating: '5.0',
      }));

      renderProducts(allProducts);
    } catch (error) {
      console.error('Error al cargar desde Supabase:', error);
      if (productsContainer) {
        productsContainer.innerHTML =
          '<p class="error" style="grid-column: 1/-1; text-align: center; color: #ef4444; font-weight: bold;">Error al cargar las publicaciones de la base de datos.</p>';
      }
    }
  }

  // Renderizar tarjetas de productos / servicios
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
      const storeClass = product.store.toLowerCase().replace(/\s+/g, '');
      const discountBadge = product.discount
        ? `<span class="discount-badge">${product.discount}</span>`
        : '';

      const formattedPrice =
        typeof product.price === 'number'
          ? product.price.toFixed(2)
          : parseFloat(product.price || 0).toFixed(2);

      let btnText = `Ver oferta en ${product.store}`;
      if (product.store === 'Servicios') {
        btnText = '📞 Contratar Servicio';
      } else if (product.store === 'Mayor') {
        btnText = '📦 Contactar Mayorista';
      } else if (product.store === 'Detal') {
        btnText = '🛒 Comprar al Detal';
      }

      card.innerHTML = `
        <div class="card-image">
          <img src="${product.image}" alt="${product.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=Imagen+No+Disponible'">
          <span class="store-badge ${storeClass}">${product.store}</span>
          ${discountBadge}
        </div>
        <div class="card-content">
          <span class="category">${product.category} ${product.rif ? `| RIF: ${product.rif}` : ''}</span>
          <h3 class="title">${product.title}</h3>
          <div class="price-rating">
            <span class="price">$${formattedPrice} ${product.currency || 'USD'}</span>
            <span class="rating">⭐ ${product.rating || '5.0'}</span>
          </div>
          <a href="${product.affiliateUrl}" target="_blank" rel="nofollow noopener sponsored" class="buy-btn">
            ${btnText}
          </a>
        </div>
      `;
      productsContainer.appendChild(card);
    });
  }

  // Filtrado y búsqueda en tiempo real
  function filterProducts() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeStoreBtn = document.querySelector('.store-filter.active');
    const selectedStore = activeStoreBtn ? activeStoreBtn.dataset.store : 'all';

    const filtered = allProducts.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.store.toLowerCase().includes(searchTerm);
      const matchesStore =
        selectedStore === 'all' || product.store.toLowerCase() === selectedStore.toLowerCase();
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

  // Inicializar carga desde Supabase
  loadProductsFromSupabase();
});
