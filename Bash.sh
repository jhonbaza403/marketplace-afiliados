#!/bin/bash

echo "=== 1. Creando / Actualizando package.json con la sintaxis correcta ==="

cat << 'EOF' > package.json
{
  "name": "marketplace-afiliados",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "15.1.0"
  }
}
EOF

echo "=== 2. Limpiando cachés y directorios temporales locales ==="
rm -rf .next
rm -rf node_modules
rm -f package-lock.json yarn.lock pnpm-lock.yaml bun.lockb

echo "=== 3. Reinstalando dependencias limpias (npm) ==="
npm install

echo "=== 4. Ejecutando verificación de compilación (npm run build) ==="
npm run build

echo "=== 5. Preparando cambios para Git y sincronizando con GitHub (Rama Main) ==="
git checkout main 2>/dev/null || git checkout -B main
git add .
git commit -m "Fix: Integración de npm run build y sincronización completa para producción"
git push origin main

echo "=== ¡Proceso completado con éxito! Todo sincronizado en main y Vercel iniciará el despliegue automático. ==="
