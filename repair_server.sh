#!/bin/bash

# Script de reparación para el servidor
# Ejecutar con: sudo ./repair_server.sh

echo "--- Iniciando reparación del servidor ---"

# 1. Arreglar Nginx
echo "Aplicando configuraciones de Nginx..."
cp nginx/sitio2 /etc/nginx/sites-available/sitio2
cp nginx/sitio3 /etc/nginx/sites-available/sitio3

# Asegurar enlaces simbólicos
ln -sf /etc/nginx/sites-available/sitio2 /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/sitio3 /etc/nginx/sites-enabled/

echo "Verificando configuración de Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "Configuración Nginx válida. Reiniciando servicio..."
    systemctl restart nginx
else
    echo "ERROR: La configuración de Nginx falló. Revisa los archivos."
    exit 1
fi

# 2. Arreglar Sitio 1 (Node.js)
echo "Reparando Sitio 1..."
cd /home/ubuntu/actions-runner/_work/proyecto-sor-2025-/proyecto-sor-2025-/sitio1

echo "Instalando dependencias..."
npm install

echo "Reiniciando proceso PM2..."
pm2 restart sitio1 || pm2 start server.js --name sitio1

echo "Estado de PM2:"
pm2 status

echo "Logs recientes de sitio1:"
pm2 logs sitio1 --lines 15 --nostream

# 3. Persistencia
echo "Guardando configuración de PM2..."
pm2 save

echo "--- Reparación completada ---"
