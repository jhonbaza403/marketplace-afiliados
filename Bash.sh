#!/bin/bash

echo "🚀 Iniciando proceso de sincronización con GitHub y Vercel..."

# 1. Agregar todos los archivos modificados y nuevos al staging
git add .

# 2. Confirmar cambios con un mensaje descriptivo
git commit -m "Sincronizacion completa: modales, autenticacion, PWA, SW, manifest y soporte de videos"

# 3. Empujar los cambios a la rama principal
git push origin main

echo "✅ ¡Sincronización completada con éxito!"
