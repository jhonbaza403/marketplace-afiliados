document.addEventListener('DOMContentLoaded', () => {
  let allProducts = [];

  const productsContainer = document.getElementById('products-grid');
  const searchInput = document.getElementById('search-input');
  const storeButtons = document.querySelectorAll('.store-filter');

  // Control del Modal 1: Registro / Verificación (KYC)
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

  if (kycForm) {
    kycForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Solicitud enviada con éxito! Tu cuenta y tus documentos están en proceso de verificación.');
      kycForm.reset();
      if (authModal) authModal.classList.add('hidden');
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

  if (publishForm) {
    publishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Publicación enviada con éxito! Se revisará y aparecerá en el catálogo a la brevedad.');
      publishForm.reset();
      if (publishModal) publishModal.classList.add('hidden');
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

  // Cargar productos desde products.json
  async function loadProducts() {
    try {
      const response = await fetch('./products.json');
      if (!response.ok) throw new Error('Error al cargar el archivo JSON');
      allProducts = await response.json();
      renderProducts(allProducts);
    } catch (error) {
      console.error(error);
      if (productsContainer) {
        productsContainer.innerHTML = '<p class="error" style="grid-column: 1/-1; text-align: center; color: #ef4444; font-weight: bold;">Error al cargar los productos.</p>';
      }
    }
  }

  // Renderizar tarjetas de productos / servicios
  function renderProducts(products) {
    if (!productsContainer) return;
    productsContainer.innerHTML = '';

    if (products.length === 0) {
      productsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #64748b;">No se encontraron publicaciones en esta categoría.</p>';
      return;
    }

    products.forEach(product => {
      const card = document.createElement('article');
      card.className = 'product-card';
      
      const storeClass = product.store.toLowerCase().replace(/\s+/g, '');
      const discountBadge = product.discount 
        ? `<span class="discount-badge">${product.discount}</span>` 
        : '';

      // Formatear precio
      const formattedPrice = typeof product.price === 'number' 
        ? product.price.toFixed(2) 
        : parseFloat(product.price || 0).toFixed(2);

      // Determinar texto del botón dinámicamente según el tipo de tienda/vendedor
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
          <span class="category">${product.category}</span>
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

    const filtered = allProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm) || 
                            product.category.toLowerCase().includes(searchTerm) ||
                            product.store.toLowerCase().includes(searchTerm);

      const matchesStore = selectedStore === 'all' || 
                           product.store.toLowerCase() === selectedStore.toLowerCase();

      return matchesSearch && matchesStore;
    });

    renderProducts(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', filterProducts);

  storeButtons.forEach(button => {
    button.addEventListener('click', () => {
      storeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      filterProducts();
    });
  });

  loadProducts();
});
