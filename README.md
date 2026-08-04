# 🛒 Mi Marketplace de Ofertas & CrediOfertas

Plataforma web PWA multivendedor de agregación de ofertas y productos populares de Amazon, Shein, AliExpress y Alibaba, integrada con módulos de Publicación de Ofertas/Servicios, Autenticación, Subida de Archivos y Verificación Comercial (KYC / RIF).

🌐 **Sitio en vivo:** [marketplace-afiliados.vercel.app](https://marketplace-afiliados.vercel.app)

---

## 🚀 Características Principales

* **Búsqueda y Filtro en Tiempo Real:** Buscador dinámico multi-propiedad por título, categoría o tipo de tienda (Al mayor, Detal, Servicios y Afiliados).
* **Sistema de Afiliados y Contacto Directo:** Enlaces a tiendas externas y generación automática de enlaces para contacto por WhatsApp con mensaje preconfigurado.
* **Soporte Multimedia Completo:** Renderizado de imágenes y reproductores de video (archivos MP4 subidos a Storage o embebidos de YouTube).
* **Modales e Interacción:** Sistema de modales para inicio de sesión, publicación de productos/servicios y verificación de empresas.
* **Soporte PWA (Progressive Web App):** Instalable en dispositivos móviles y de escritorio, con soporte offline gestionado mediante Service Worker y `manifest.json`.
* **Integración en Tiempo Real:** Actualización dinámica de productos vía canales de Supabase Realtime.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** Next.js (React), JavaScript (ES6+), HTML5, CSS3.
* **Backend y Base de Datos:** Supabase (Auth, Database & Storage).
* **PWA:** Web App Manifest (`manifest.json`) y Service Worker (`sw.js`).
* **Despliegue:** [Vercel](https://vercel.com/bazwjhon-2554s-projects/tienda-ofertas-marketplace).

---

## 📁 Estructura del Proyecto

```text
├── public/
│   ├── manifest.json      # Configuración de PWA e iconos de acceso directo
│   ├── sw.js              # Service Worker para caché y soporte offline
│   ├── productos.json     # Base de datos local/fallback de ofertas
│   └── logo.png           # Logotipo principal e icono de la PWA
├── app.js                 # Lógica de cliente, modales, filtros y Supabase
├── registerkyc.js         # Módulo KYC, helpers de URL, utilidades PWA y eventos
├── vercel.json            # Configuración de despliegue en Vercel
├── .gitignore             # Exclusión de node_modules, .next y archivos sensibles
└── README.md              # Documentación del proyecto
