// ==========================================
// CONFIGURACIÓN E INICIALIZACIÓN DE SUPABASE
// ==========================================
const SUPABASE_URL = 'https://TU_PROYECTO_SUPABASE.supabase.co'; // <--- Pega aquí la URL de tu proyecto Supabase
const SUPABASE_ANON_KEY = 'sb_publishable_yPCMORrQyiQ1esGLUdSsJA_YfyjPhAo';

let supabaseClient = null;
if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'https://TU_PROYECTO_SUPABASE.supabase.co') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.supabaseClient = supabaseClient;
}

// Estado global de productos
window.allProducts = [];

// ==========================================
// 1. FUNCIÓN AUXILIAR: VALIDAR Y NORMALIZAR URLS
// ==========================================
function normalizarUrlContacto(urlOriginal) {
  if (!urlOriginal) return '#';
  
  let url = urlOriginal.trim();

  // Si es un número de teléfono de WhatsApp sin formato URL
  if (/^\+?\d{8,15}$/.test(url)) {
    const numLimpio = url.replace(/\+/g, '');
    return `https://wa.me/${numLimpio}?text=Hola!%20Me%20interesa%20tu%20publicación%20en%20CrediOfertas`;
  }

  // Asegurar protocolo https:// si falta
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }

  return url;
}

// ==========================================
// 2. RENDERIZADO DE TARJETAS EN EL GRID
// ==========================================
function renderProducts(productsList) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (!productsList || productsList.length === 0) {
    grid.innerHTML = '<p class="no-results" style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #cbd5e1;">No se encontraron ofertas o servicios disponibles.</p>';
    return;
  }

  productsList.forEach(item => {
    const card = document.createElement('article');
    card.className = 'product-card';

    // Capturar cualquier variación del nombre de la propiedad del enlace
    const rawLink = item.affiliate_link || item.affiliateUrl || item.url || item.link || '';
    const actionUrl = normalizarUrlContacto(rawLink);

    // Identificar tipo de tienda/oferta
    const storeLower = (item.store || '').toLowerCase();
    const categoryLower = (item.category || '').toLowerCase();
    const typeLower = (item.type || '').toLowerCase();
    
    const esAfiliadoExterno = ['amazon', 'shein', 'aliexpress', 'alibaba'].includes(storeLower) || 
                               ['amazon', 'shein', 'aliexpress', 'alibaba'].includes(categoryLower);

    // Definir texto y estilo del botón dinámicamente
    let btnText = '💬 Contactar por WhatsApp';
    let btnClass = 'whatsapp-btn';

    if (esAfiliadoExterno) {
      const nombreTienda = item.store || item.category || 'Tienda';
      btnText = `🛒 Ver Oferta en ${nombreTienda}`;
      btnClass = 'affiliate-btn';
    } else if (categoryLower.includes('servicio') || typeLower === 'servicio') {
      btnText = '🛠️ Contratar Servicio';
      btnClass = 'service-btn';
    } else if (categoryLower.includes('mayor') || typeLower === 'mayorista') {
      btnText = '📦 Cotizar al Mayor';
      btnClass = 'mayor-btn';
    }

    // Normalizar Imagen y Video
    const imageUrl = item.image_url || item.image || 'logo.png';
    const videoUrl = item.video_url || item.videoUrl || '';

    card.innerHTML = `
      <div class="card-media">
        ${videoUrl 
          ? `<video src="${videoUrl}" controls poster="${imageUrl}" preload="metadata"></video>` 
          : `<img src="${imageUrl}" alt="${item.title}" loading="lazy" onerror="this.src='logo.png'">`
        }
        <span class="badge ${typeLower || categoryLower}">${item.category || item.store || 'Oferta'}</span>
      </div>
      <div class="card-body">
        <h3>${item.title}</h3>
        <p class="price">$${parseFloat(item.price || 0).toFixed(2)} <small>USD</small></p>
        <p class="description">${item.description || 'Sin descripción disponible.'}</p>
        
        <a href="${actionUrl}" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="btn-action ${btnClass}">
           ${btnText}
        </a>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ==========================================
// 3. CARGA DE PRODUCTOS (SUPABASE / LOCAL)
// ==========================================
async function cargarProductos() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        window.allProducts = data;
        renderProducts(window.allProducts);
        return;
      }
    } catch (err) {
      console.warn('Error al cargar datos desde Supabase:', err);
    }
  }

  // Datos por defecto en caso de no conectar a Supabase
  window.allProducts = [
    {
      id: 1,
      title: 'Lote de Calzado Deportivo al Mayor',
      category: 'Calzado',
      store: 'mayorista',
      type: 'mayorista',
      price: 12.50,
      description: 'Venta al mayor desde 12 pares. Excelente calidad y envío inmediato.',
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      affiliate_link: '+584120000000',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Servicio Técnico Especializado de Laptops',
      category: 'Servicios',
      store: 'servicio',
      type: 'servicio',
      price: 25.00,
      description: 'Mantenimiento preventivo, diagnóstico y reparación de hardware/software.',
      image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500',
      affiliate_link: '+584120000000',
      created_at: new Date().toISOString()
    }
  ];
  renderProducts(window.allProducts);
}

// ==========================================
// 4. SUBIDA DE ARCHIVOS A SUPABASE STORAGE
// ==========================================
async function subirArchivoStorage(file, folder) {
  if (!supabaseClient || !file) return null;
  
  const ext = file.name.split('.').pop();
  const filePath = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;

  const { data, error } = await supabaseClient.storage
    .from('media')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (error) {
    console.error('Error al subir archivo a Storage:', error);
    return null;
  }

  const { data: publicUrlData } = supabaseClient.storage
    .from('media')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

// ==========================================
// 5. CAPTURA DEL FORMULARIO DE PUBLICACIÓN
// ==========================================
const publishForm = document.getElementById('publish-form');

if (publishForm) {
  publishForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = publishForm.querySelector('.publish-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Subiendo y guardando...';
    }

    const formData = new FormData(publishForm);
    const imageFile = document.getElementById('pub-image-file')?.files[0];
    const videoFile = document.getElementById('pub-video-file')?.files[0];

    let finalImageUrl = formData.get('image_url') || 'logo.png';
    let finalVideoUrl = formData.get('video_url') || '';

    // Subida de imagen y video si se seleccionaron archivos locales
    if (imageFile) {
      const urlSubida = await subirArchivoStorage(imageFile, 'imagenes');
      if (urlSubida) finalImageUrl = urlSubida;
    }

    if (videoFile) {
      const urlSubida = await subirArchivoStorage(videoFile, 'videos');
      if (urlSubida) finalVideoUrl = urlSubida;
    }

    const nuevoProducto = {
      title: formData.get('title'),
      category: formData.get('category'),
      type: formData.get('type') || 'detal',
      store: formData.get('type') || formData.get('category'),
      price: parseFloat(formData.get('price')) || 0,
      description: formData.get('description'),
      image_url: finalImageUrl,
      video_url: finalVideoUrl,
      affiliate_link: formData.get('affiliate_link'),
      created_at: new Date().toISOString()
    };

    // A) Insertar en Supabase si está disponible
    try {
      if (supabaseClient) {
        const { data, error } = await supabaseClient.from('products').insert([nuevoProducto]).select();
        if (error) throw error;
        if (data && data[0]) nuevoProducto.id = data[0].id;
      } else {
        nuevoProducto.id = Date.now();
      }
    } catch (err) {
      console.warn('Error al guardar en Supabase, agregando localmente:', err);
      nuevoProducto.id = Date.now();
    }

    // B) Actualizar Arreglo en Memoria y Volver a Renderizar
    if (window.allProducts) {
      window.allProducts.unshift(nuevoProducto);
      renderProducts(window.allProducts);
    }

    // C) Restablecer Formulario y Cerrar Modal
    document.getElementById('publish-modal')?.classList.add('hidden');
    publishForm.reset();
    
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '🚀 Publicar Ahora Gratis';
    }

    alert('🚀 ¡Publicación creada e integrada con éxito!');
  });
}

// ==========================================
// 6. INICIO DE SESIÓN Y REGISTRO (SUPABASE AUTH)
// ==========================================
const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const isSignUp = loginForm.dataset.mode === 'signup';

    if (!supabaseClient) {
      alert('⚠️ Supabase no está configurado. Revisa las llaves SUPABASE_URL y SUPABASE_ANON_KEY.');
      return;
    }

    try {
      let result;
      if (isSignUp) {
        result = await supabaseClient.auth.signUp({ email, password });
      } else {
        result = await supabaseClient.auth.signInWithPassword({ email, password });
      }

      if (result.error) throw result.error;

      alert(isSignUp ? '📩 Registro exitoso. Revisa tu correo para confirmar la cuenta.' : '✅ Sesión iniciada correctamente.');
      document.getElementById('auth-modal')?.classList.add('hidden');
      loginForm.reset();
    } catch (err) {
      alert(`❌ Error de autenticación: ${err.message}`);
    }
  });
}

// ==========================================
// 7. REGISTRO Y VERIFICACIÓN DE EMPRESA (RIF)
// ==========================================
const kycForm = document.getElementById('kyc-form');

if (kycForm) {
  kycForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(kycForm);
    
    const kycData = {
      company_name: formData.get('company_name'),
      rif: formData.get('rif'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      created_at: new Date().toISOString()
    };

    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.from('companies').insert([kycData]);
        if (error) throw error;
      } catch (err) {
        console.warn('Error al registrar empresa en Supabase:', err);
      }
    }

    alert('🏢 Registro de Empresa / RIF enviado correctamente para verificación.');
    document.getElementById('kyc-modal')?.classList.add('hidden');
    kycForm.reset();
  });
}

// ==========================================
// 8. BÚSQUEDA Y FILTRADO
// ==========================================
function filtrarProductos() {
  const searchTerm = (document.getElementById('search-bar')?.value || '').toLowerCase().trim();
  const activeFilterBtn = document.querySelector('.store-filter.active');
  const storeFilter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';

  const filtrados = window.allProducts.filter(item => {
    const titleMatch = (item.title || '').toLowerCase().includes(searchTerm);
    const descMatch = (item.description || '').toLowerCase().includes(searchTerm);
    const categoryMatch = (item.category || '').toLowerCase().includes(searchTerm);
    const matchesSearch = titleMatch || descMatch || categoryMatch;

    if (!matchesSearch) return false;
    if (storeFilter === 'all') return true;

    const itemStore = (item.store || '').toLowerCase();
    const itemCategory = (item.category || '').toLowerCase();
    const itemType = (item.type || '').toLowerCase();

    return itemStore === storeFilter || itemCategory === storeFilter || itemType === storeFilter;
  });

  renderProducts(filtrados);
}

// Evento Búsqueda
document.getElementById('search-bar')?.addEventListener('input', filtrarProductos);

// Eventos Botones de Filtro
document.querySelectorAll('.store-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.store-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtrados();
  });
});

// ==========================================
// 9. CONTROL DE MODALES
// ==========================================
document.querySelectorAll('[data-modal]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const modalId = trigger.getAttribute('data-modal');
    document.getElementById(modalId)?.classList.remove('hidden');
  });
});

document.querySelectorAll('.modal-overlay .close-btn').forEach(closeBtn => {
  closeBtn.addEventListener('click', () => {
    closeBtn.closest('.modal-overlay')?.classList.add('hidden');
  });
});

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.add('hidden');
  }
});

// ==========================================
// 10. INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
});
