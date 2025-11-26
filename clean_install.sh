#!/bin/bash

# Script de Instalación Limpia para Servidor Ubuntu
# ADVERTENCIA: Este script borrará configuraciones previas de Nginx y PM2.
# Ejecutar con: sudo ./clean_install.sh

# Directorio base del proyecto (ajustar si es necesario)
BASE_DIR="/home/ubuntu/actions-runner/_work/proyecto-sor-2025-/proyecto-sor-2025-"

echo "--- INICIANDO INSTALACIÓN LIMPIA ---"

# 1. Limpieza Previa
echo "[1/7] Limpiando configuraciones anteriores..."
pm2 delete all 2>/dev/null
rm /etc/nginx/sites-enabled/sitio2 2>/dev/null
rm /etc/nginx/sites-enabled/sitio3 2>/dev/null
rm /etc/nginx/sites-available/sitio2 2>/dev/null
rm /etc/nginx/sites-available/sitio3 2>/dev/null

# 2. Actualización e Instalación de Dependencias
echo "[2/7] Instalando dependencias del sistema..."
apt update && apt upgrade -y
apt install -y nginx mysql-server

# Instalar Node.js 20 si no está
if ! command -v node &> /dev/null; then
    echo "Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

# Instalar PM2 globalmente
npm install -g pm2

# 3. Configuración de Nginx (Sitios Estáticos)
echo "[3/7] Configurando Nginx..."

# Crear config para Sitio 2 (Puerto 82)
cat > /etc/nginx/sites-available/sitio2 <<EOF
server {
    listen 82;
    server_name _;
    root $BASE_DIR/sitio2;
    index index.html;
    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF

# Crear config para Sitio 3 (Puerto 83)
cat > /etc/nginx/sites-available/sitio3 <<EOF
server {
    listen 83;
    server_name _;
    root $BASE_DIR/sitio3;
    index index.html;
    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF

# Habilitar sitios
ln -s /etc/nginx/sites-available/sitio2 /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/sitio3 /etc/nginx/sites-enabled/

# Verificar y reiniciar Nginx
nginx -t
systemctl restart nginx

# 4. Configuración de Aplicaciones Node.js
echo "[4/7] Configurando Aplicaciones Node.js..."

# Sitio 1 (Chat - Puerto 81)
echo "Configurando Sitio 1..."
cd "$BASE_DIR/sitio1"
npm install
pm2 start server.js --name sitio1

# Sitio 4 (Cine - Puerto 3000)
echo "Configurando Sitio 4..."
cd "$BASE_DIR/sitio4"
npm install
# Nota: Sitio 4 requiere base de datos. Asegúrate de configurar .env
pm2 start server.js --name sitio4

# Guardar lista de procesos PM2
pm2 save
pm2 startup | bash # Esto puede requerir ejecución manual si pide usuario

# 5. Configuración de Base de Datos (Opcional)
echo "[5/7] Preparando MySQL..."
# Se deja el script setup_db.sql listo para ejecución manual
echo "Se ha creado 'setup_db.sql'. Ejecútalo manualmente si necesitas crear la DB: sudo mysql < setup_db.sql"

# 6. Configuración de Firewall
echo "[6/7] Configurando Firewall (UFW)..."
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 81/tcp
ufw allow 82/tcp
ufw allow 83/tcp
ufw allow 3000/tcp
ufw --force enable

# 7. Resumen
echo "--- INSTALACIÓN COMPLETADA ---"
echo "Estado de los servicios:"
echo "------------------------"
pm2 status
echo "------------------------"
systemctl status nginx --no-pager | grep Active
echo "------------------------"
echo "Tus sitios deberían estar accesibles en:"
echo "- Sitio 1: http://TU_IP:81"
echo "- Sitio 2: http://TU_IP:82"
echo "- Sitio 3: http://TU_IP:83"
echo "- Sitio 4: http://TU_IP:3000"
