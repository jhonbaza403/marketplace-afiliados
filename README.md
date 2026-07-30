# 🛒 Mi Marketplace de Ofertas & CrediOfertas

Plataforma web de agregación de ofertas y productos populares de **Amazon**, **Shein**, **AliExpress** y **Alibaba**, integrada con un módulo de **Registro y Verificación de Identidad (KYC)** para la evaluación y solicitud de financiamiento / crédito (estilo Cashea).

🌐 **Sitio en vivo:** [marketplace-afiliados.vercel.app](https://marketplace-afiliados.vercel.app/)

---

## 🚀 Características Principales

- **Filtro y Búsqueda en Tiempo Real:** Buscador dinámico por nombre o categoría y filtrado instantáneo por tienda.
- **Sistema de Afiliados:** Enlaces optimizados hacia Amazon, Shein, AliExpress y Alibaba con insignias de descuento y calificaciones.
- **Módulo de Registro & KYC:** Formulario modal para verificación de usuarios con carga de documento de identidad (cédula) y fotografía (selfie) para solicitudes de crédito.
- **Soporte Integrado:** Botón flotante para atención directa vía WhatsApp.
- **Diseño Responsive:** Interfaz moderna y adaptable a dispositivos móviles y escritorios.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5** (Semántico)
- **CSS3** (Flexbox, CSS Grid, Variables y Animaciones)
- **JavaScript (Vanilla ES6+)** (Carga dinámica de datos JSON, filtrado en vivo y control de modales)

---

## 📁 Estructura del Proyecto

```text
├── index.html        # Estructura HTML principal y modal KYC
├── style.css         # Estilos globales, grid y ventana modal
├── script.js        # Lógica de renderizado, búsqueda y eventos
├── products.json     # Base de datos local de ofertas
└── README.md         # Documentación del proyecto
