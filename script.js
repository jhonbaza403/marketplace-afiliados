document.addEventListener('DOMContentLoaded', () => {
  let allProducts = [];

  const productsContainer = document.getElementById('products-grid');
  const searchInput = document.getElementById('search-input');
  const storeButtons = document.querySelectorAll('.store-filter');

  // Control del Modal de Registro / Verificación (KYC)
  const authModal = document.getElementById('auth-modal');
  const openAuthBtn = document.getElementById('open-auth-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const kycForm = document.getElementById('kyc-form');

  if (openAuthBtn) {
    openAuthBtn.addEventListener('click', () => {
      authModal.classList.remove('hidden');
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      authModal.classList.add('hidden');
    });
  }

  // Cerrar modal al hacer clic fuera de la tarjeta
  window.addEventListener('click', (e) => {
    if (e.target === authModal) {
      authModal.classList.add('hidden');
    }
  });

  if (kycForm) {
    kycForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Solicitud enviada con éxito! Tu cuenta y tus documentos están en proceso de verificación para otorgar tu cupo de financiamiento.');
      kycForm.reset();
      authModal.classList.add('hidden');
    });
  }

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
        productsContainer.innerHTML = '<p class="error" style="grid-column: 1/-1; text-align: center;">Error al cargar los productos.</p>';
      }
    }
  }

  // Renderizar tarjetas de productos
  function renderProducts(products) {
    if (!productsContainer) return;
    productsContainer.innerHTML = '';

    if (products.length === 0) {
      productsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No se encontraron productos en esta categoría.</p>';
      return;
    }

    products.forEach(product => {
      const card = document.createElement('article');
      card.className = 'product-card';
      
      const storeClass = product.store.toLowerCase().replace(/\s+/g, '');
      const discountBadge = product.discount 
        ? `<span class="discount-badge">${product.discount}</span>` 
        : '';

      card.innerHTML = `
        <div class="card-image">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
          <span class="store-badge ${storeClass}">${product.store}</span>
          ${discountBadge}
        </div>
        <div class="card-content">
          <span class="category">${product.category}</span>
          <h3 class="title">${product.title}</h3>
          <div class="price-rating">
            <span class="price">$${product.price.toFixed(2)} ${product.currency}</span>
            <span class="rating">⭐ ${product.rating}</span>
          </div>
          <a href="${product.affiliateUrl}" target="_blank" rel="nofollow noopener sponsored" class="buy-btn">
             Ver oferta en ${product.store}
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
                            product.category.toLowerCase().includes(searchTerm);
      const matchesStore = selectedStore === 'all' || product.store.toLowerCase() === selectedStore.toLowerCase();
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
