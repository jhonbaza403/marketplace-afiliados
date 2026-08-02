'use client';

import { useState, useEffect } from 'react';

// Tipado/Estructura base para Supabase o Estado Local
export default function Home() {
  // Estados para Modales
  const [activeModal, setActiveModal] = useState(null); // 'auth' | 'kyc' | 'publish' | null
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isOffline, setIsOffline] = useState(false);
  const [showPWA, setShowPWA] = useState(true);

  // Estados para Productos/Ofertas y Formulario de Publicación
  const [products, setProducts] = useState([
    {
      id: '1',
      title: 'Lote de Franelas 100% Algodón al Mayor',
      price: 4.50,
      category: 'mayorista',
      store: 'mayor',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
      description: 'Franelas de alta calidad para estampados. Envíos a todo el país.',
      link: 'https://wa.me/18722371015?text=Hola,%20busco%20informacion%20del%20lote%20de%20franelas',
    },
    {
      id: '2',
      title: 'Servicio de Diseño Web & Tiendas Online',
      price: 150.00,
      category: 'servicio',
      store: 'servicios',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
      description: 'Desarrollo de páginas optimizadas y con integración de pagos.',
      link: 'https://wa.me/18722371015?text=Consulta%20por%20servicio%20web',
    }
  ]);

  const [newPublish, setNewPublish] = useState({
    type: 'detal',
    title: '',
    price: '',
    affiliateLink: '',
    description: '',
  });

  // Módulo de seguridad y estado online/offline
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const verificarSeguridad = () => {
      try {
        const esBot = Boolean(
          navigator.webdriver ||
          document.documentElement.getAttribute('webdriver') ||
          window.callPhantom ||
          window._phantom ||
          window.__nightmare
        );
        if (esBot) {
          console.warn('Entorno automatizado detectado.');
        }
      } catch (error) {
        console.warn('Verificación de seguridad omitida:', error);
      }
    };

    verificarSeguridad();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Manejador de Publicación
  const handlePublishSubmit = (e) => {
    e.preventDefault();
    const newOffer = {
      id: Date.now().toString(),
      title: newPublish.title,
      price: parseFloat(newPublish.price) || 0,
      category: newPublish.type,
      store: newPublish.type,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500',
      description: newPublish.description,
      link: newPublish.affiliateLink.startsWith('http') 
        ? newPublish.affiliateLink 
        : `https://wa.me/${newPublish.affiliateLink.replace(/\D/g, '')}`,
    };

    setProducts([newOffer, ...products]);
    setActiveModal(null);
    setNewPublish({ type: 'detal', title: '', price: '', affiliateLink: '', description: '' });
  };

  // Filtrado dinámico de publicaciones
  const filteredProducts = products.filter((item) => {
    const matchesFilter = filter === 'all' || item.category === filter || item.store === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      {/* BANNER OFFLINE */}
      {isOffline && (
        <div style={{ background: '#ef4444', color: '#fff', textAlign: 'center', padding: '8px', fontWeight: '600' }}>
          📡 Modo sin conexión (Offline). Mostrando contenido guardado.
        </div>
      )}

      {/* BANNER PWA */}
      {showPWA && (
        <div style={{ background: '#1e293b', color: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📱 ¡Instala la App de CrediOfertas en tu pantalla de inicio!</span>
          <div>
            <button className="btn btn-primary" style={{ padding: '6px 14px' }}>Instalar</button>
            <button 
              onClick={() => setShowPWA(false)} 
              style={{ background: 'none', color: '#fff', border: 'none', fontSize: '20px', cursor: 'pointer', marginLeft: '8px' }}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* BARRA SUPERIOR STICKY */}
      <nav className="top-nav">
        <div className="top-nav-container">
          <a href="#" className="brand-logo-small">
            <img src="/logo.png" alt="CrediOfertas Logo" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <span>CrediOfertas</span>
          </a>

          <div className="nav-actions">
            <div id="google_translate_element"></div>
            <button onClick={() => setActiveModal('publish')} className="btn btn-primary">➕ Publicar Oferta</button>
            <button onClick={() => setActiveModal('auth')} className="btn btn-secondary">🔑 Acceder</button>
            <button onClick={() => setActiveModal('kyc')} className="btn btn-success">🏢 Registro RIF / KYC</button>
          </div>
        </div>
      </nav>

      {/* HERO BANNER */}
      <header className="hero-banner">
        <div className="container">
          <h1 className="hero-title">CrediOfertas <span>Marketplace</span></h1>
          <p className="hero-subtitle">
            Tu plataforma de comercio: compra al <strong>Mayor</strong>, al <strong>Detal</strong>, contrata <strong>Servicios</strong> o explora tendencias.
          </p>

          <div className="hero-pills">
            <a href="https://amzn.to/4bJJq22" target="_blank" rel="nofollow noopener sponsored" className="pill-btn">
              <span style={{ fontSize: '1.25rem' }}>🛒</span>
              <div>
                <span className="pill-title">Top Amazon</span>
                <small className="pill-sub">Lo + vendido</small>
              </div>
            </a>

            <a href="https://onelink.shein.com/44/5wyleaujbj2iI" target="_blank" rel="nofollow noopener sponsored" className="pill-btn">
              <span style={{ fontSize: '1.25rem' }}>👗</span>
              <div>
                <span className="pill-title">Tendencias Shein</span>
                <small className="pill-sub">Moda & Ofertas</small>
              </div>
            </a>

            <a href="https://s.click.aliexpress.com/e/_c33p0iwF" target="_blank" rel="nofollow noopener sponsored" className="pill-btn">
              <span style={{ fontSize: '1.25rem' }}>⚡</span>
              <div>
                <span className="pill-title">SuperOfertas AliExpress</span>
                <small className="pill-sub">Envíos rápidos</small>
              </div>
            </a>

            <a href="https://offer.alibaba.com/cps/t9vapivb?bm=cps&src=saf" target="_blank" rel="nofollow noopener sponsored" className="pill-btn">
              <span style={{ fontSize: '1.25rem' }}>🏭</span>
              <div>
                <span className="pill-title">Mayoreo Alibaba</span>
                <small className="pill-sub">Precios fábrica</small>
              </div>
            </a>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="controls">
          <input 
            type="search" 
            className="search-bar" 
            placeholder="🔍 Buscar ofertas, servicios, ventas al mayor, Amazon, Shein..." 
            aria-label="Buscar productos"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="filters" role="tablist">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'mayorista', label: '📦 Venta al Mayor' },
              { id: 'detal', label: '🛍️ Venta al Detal' },
              { id: 'servicio', label: '🛠️ Servicios' },
              { id: 'amazon', label: 'Amazon' },
              { id: 'shein', label: 'Shein' },
              { id: 'aliexpress', label: 'AliExpress' },
              { id: 'alibaba', label: 'Alibaba' }
            ].map((item) => (
              <button 
                key={item.id}
                className={`store-filter ${filter === item.id ? 'active' : ''}`}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {/* GRID DE PUBLICACIONES */}
        <section id="products-grid" className="products-grid" aria-live="polite">
          {filteredProducts.length === 0 ? (
            <div className="no-results">No se encontraron ofertas que coincidan con la búsqueda.</div>
          ) : (
            filteredProducts.map((item) => (
              <article key={item.id} className="product-card">
                <div className="card-media">
                  <span className={`badge ${item.store || 'detal'}`}>{item.category || 'Oferta'}</span>
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <div className="card-content">
                  <span className="category">{item.category}</span>
                  <h3>{item.title}</h3>
                  <p className="description">{item.description}</p>
                  <div className="price-rating">
                    <span className="price">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="card-actions-viral">
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="buy-btn btn-primary"
                    >
                      📲 Contactar / Comprar
                    </a>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      {/* MODAL 1: AUTENTICACIÓN */}
      {activeModal === 'auth' && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            <h2>🔑 Acceso a CrediOfertas</h2>
            <p className="modal-sub">Inicia sesión o regístrate para publicar y gestionar tus ofertas.</p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="auth-email">Correo Electrónico</label>
                <input type="email" id="auth-email" required placeholder="tu@correo.com" />
              </div>
              <div className="form-group">
                <label htmlFor="auth-password">Contraseña</label>
                <input type="password" id="auth-password" required placeholder="••••••••" />
              </div>
              <button type="submit" className="submit-btn" style={{ marginTop: '15px' }}>Ingresar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTRO EMPRESA / KYC */}
      {activeModal === 'kyc' && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            <h2>🏢 Registro de Empresa & Verificación KYC</h2>
            <p className="modal-sub">Ingresa los datos fiscales y sube los documentos para verificar tu perfil comercial.</p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="company_name">Nombre Comercial</label>
                <input type="text" id="company_name" required placeholder="Inversiones Global C.A." />
              </div>
              <div className="form-group">
                <label htmlFor="rif">RIF Fiscal / Documento ID</label>
                <input type="text" id="rif" required placeholder="J-12345678-0" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Teléfono / WhatsApp</label>
                <input type="tel" id="phone" required placeholder="+58 412 000 0000" />
              </div>
              <div className="form-group">
                <label htmlFor="document_file">Documento RIF / Cédula (Imagen)</label>
                <input type="file" id="document_file" accept="image/*" required />
              </div>
              <div className="form-group">
                <label htmlFor="selfie_front">Foto Frontal (Selfie Rostro)</label>
                <input type="file" id="selfie_front" accept="image/*" required />
              </div>
              <div className="form-group">
                <label htmlFor="selfie_right">Foto Perfil Derecho</label>
                <input type="file" id="selfie_right" accept="image/*" required />
              </div>
              <div className="form-group">
                <label htmlFor="selfie_left">Foto Perfil Izquierdo</label>
                <input type="file" id="selfie_left" accept="image/*" required />
              </div>
              <button type="submit" className="submit-btn">✅ Enviar para Verificación</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PUBLICACIÓN */}
      {activeModal === 'publish' && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            <h2>📢 Publicar Oferta / Servicio</h2>
            <p className="modal-sub">Anuncia productos al mayor, detal o servicios profesionales con video de 90 segundos.</p>

            <form onSubmit={handlePublishSubmit}>
              <div className="form-group">
                <label htmlFor="pub-type">Tipo de Oferta</label>
                <select 
                  id="pub-type" 
                  required 
                  className="form-select"
                  value={newPublish.type}
                  onChange={(e) => setNewPublish({ ...newPublish, type: e.target.value })}
                >
                  <option value="detal">🛍️ Venta al Detal</option>
                  <option value="mayorista">📦 Venta al Mayor</option>
                  <option value="servicio">🛠️ Servicio Profesional</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="pub-title">Título</label>
                <input 
                  type="text" 
                  id="pub-title" 
                  required 
                  placeholder="Ej: Lote de Franelas de Algodón" 
                  value={newPublish.title}
                  onChange={(e) => setNewPublish({ ...newPublish, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="pub-price">Precio ($ USD)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  id="pub-price" 
                  required 
                  placeholder="15.00" 
                  value={newPublish.price}
                  onChange={(e) => setNewPublish({ ...newPublish, price: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="pub-affiliate">Enlace de Contacto / WhatsApp / Web</label>
                <input 
                  type="text" 
                  id="pub-affiliate" 
                  required 
                  placeholder="+584120000000 o https://tienda.com" 
                  value={newPublish.affiliateLink}
                  onChange={(e) => setNewPublish({ ...newPublish, affiliateLink: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="pub-image">Imagen Promocional</label>
                <input type="file" id="pub-image" accept="image/*" />
              </div>
              <div className="form-group">
                <label htmlFor="pub-video">Video Corto (hasta 90 segundos)</label>
                <input type="file" id="pub-video" accept="video/mp4,video/webm" />
              </div>
              <div className="form-group">
                <label htmlFor="pub-description">Descripción</label>
                <textarea 
                  id="pub-description" 
                  rows={3} 
                  required 
                  placeholder="Detalles de la oferta..."
                  value={newPublish.description}
                  onChange={(e) => setNewPublish({ ...newPublish, description: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">🚀 Publicar Ahora</button>
            </form>
          </div>
        </div>
      )}

      {/* SOPORTE WHATSAPP */}
      <a 
        href="https://wa.me/18722371015" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-float"
        style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#25d366', color: '#fff', padding: '12px 20px', borderRadius: '50px', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 999 }}
      >
        💬 Soporte WhatsApp
      </a>

      {/* FOOTER */}
      <footer style={{ marginTop: '50px', padding: '25px 20px', background: '#ffffff', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-sub)', fontSize: '0.875rem' }}>
        <div className="container">
          <p><strong>Aviso de Plataforma:</strong> Este marketplace permite la publicación directa de comerciantes, empresas e independientes, así como productos de afiliados externos.</p>
          <p>&copy; 2026 CrediOfertas Marketplace Multivendedor. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}
