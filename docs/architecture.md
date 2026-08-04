# Arquitectura del Sistema - Credi Marketplace

## 1. Stack Tecnológico
* **Framework:** Next.js 15 (App Router, Server Components y Server Actions)
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS
* **Base de datos & ORM:** PostgreSQL + Prisma
* **Autenticación & Almacenamiento:** Supabase Auth & Storage
* **Despliegue:** Vercel

## 2. Estructura de Directorios (Modular)
El proyecto utiliza una arquitectura modular basada en características (`features/`) para mantener el código escalable:
- `app/`: Rutas y páginas de Next.js (App Router).
- `components/`: Componentes globales reutilizables (UI base, botones, modales).
- `features/`: Módulos de negocio aislados (marketplace, auth, wallet, chat, etc.).
- `prisma/`: Esquemas de base de datos y migraciones.
- `lib/`: Configuraciones de clientes externos (Supabase, Prisma Client).
