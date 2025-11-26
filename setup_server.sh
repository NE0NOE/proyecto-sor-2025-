#!/bin/bash

# Script de configuración para servidor Ubuntu (AWS)
# Ejecutar con: sudo ./setup_server.sh

echo "--- Iniciando configuración del servidor ---"

# 1. Actualizar sistema
echo "Actualizando repositorios..."
apt update && apt upgrade -y

# 2. Instalar Node.js (versión LTS)
echo "Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. Instalar MySQL Server
echo "Instalando MySQL Server..."
apt install -y mysql-server

# 4. Instalar PM2 (Gestor de procesos para Node.js)
echo "Instalando PM2..."
npm install -g pm2

# 5. Configurar Firewall (UFW)
echo "Configurando Firewall..."
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 81/tcp   # Puerto para sitio1
ufw allow 3000/tcp # Puerto para sitio4
ufw --force enable

# 6. Verificación
echo "--- Verificación de versiones ---"
node -v
npm -v
mysql --version
pm2 -v

echo "--- Configuración completada ---"
echo "Ahora puedes desplegar tu código y ejecutar tus aplicaciones."
echo "Para sitio1: cd sitio1 && npm install && pm2 start server.js --name sitio1"
echo "Para sitio4: cd sitio4 && npm install && pm2 start server.js --name sitio4"
