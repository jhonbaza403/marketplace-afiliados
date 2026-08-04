# Diseño de Base de Datos - Credi Marketplace

## Módulos Principales (Prisma Schema)

### 1. Usuarios y Perfiles (`User`, `Profile`)
* Gestión de roles: Comprador, Vendedor, Profesional, Empresa, Administrador.
* Datos de autenticación vinculados a Supabase Auth.

### 2. Comercio (`Product`, `Store`, `Order`)
* Catálogo de productos con categorías, stock e integración de pasarela.
* Tiendas personales por vendedor con estadísticas y seguidores.

### 3. Servicios y Empleo (`Service`, `Company`, `Job`)
* Perfiles de profesionales y publicaciones de empleos corporativos.

### 4. Inteligencia Artificial y Finanzas (`AI Conversation`, `Wallet`, `Transaction`)
* Historial de interacciones con el asistente de Gemini.
* Control de comisiones por ventas (ej. 5%) y billetera virtual.
