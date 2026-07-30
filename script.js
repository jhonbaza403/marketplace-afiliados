document.addEventListener('DOMContentLoaded', () => {
  let allProducts = [];

  const productsContainer = document.getElementById('products-grid');
  const searchInput = document.getElementById('search-input');
  const storeButtons = document.querySelectorAll('.store-filter');

  // Cargar productos desde products.json
  async function loadProducts() {
    try {
      const response = await fetch('./products.json');
      if (!response.ok) throw new Error('Error al cargar productos');
      allProducts = await response.json();
      renderProducts(allProducts);
    } catch (error) {
      console.error(error);
      if (productsContainer) {
        productsContainer.innerHTML = '<p class="error">Error al cargar productos.</p>';
      }
    }
  }

  // Renderizar tarjetas
  function renderProducts(products) {
    if (!productsContainer) return;
    productsContainer.innerHTML = '';

    if (products.length === 0) {
      productsContainer.innerHTML = '<p class="no-results">No se encontraron productos.</p>';
      return;
    }

    products.forEach(product => {
      const card = document.createElement('article');
      card.className = 'product-card';
      const storeClass = product.store.toLowerCase().replace(/\s+/g, '');

      card.innerHTML = `
        <div class="card-image">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
          <span class="store-badge ${storeClass}">${product.store}</span>
        </div>
        <div class="card-content">
          <span class="category">${product.category}</span>
          <h3 class="title">${product.title}</h3>
          <div class="price-rating">
            <span class="price">$${product.price.toFixed(2)} ${product.currency}</span>
            <span class="rating">⭐ ${product.rating}</span>
          </div>
          <a href="${product.affiliateUrl}" 
             target="_blank" 
             rel="nofollow noopener sponsored" 
             class="buy-btn">
             Ver oferta en ${product.store}
          </a>
        </div>
      `;
      productsContainer.appendChild(card);
    });
  }

  // Filtrar por tienda y buscador
  function filterProducts() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
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
