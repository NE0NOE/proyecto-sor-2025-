# Estructura del Proyecto

Este documento detalla la organización de archivos y carpetas del proyecto para la migración al servidor Ubuntu.

## 📂 Directorios Principales

### Aplicaciones
*   **`sitio1/`**: Aplicación de Chat en Tiempo Real.
    *   Tecnología: **Node.js + Socket.io**.
    *   Puerto: **81**.
    *   Archivos clave: `server.js` (Backend), `public/app.js` (Frontend).
*   **`sitio2/`**: Sitio Web Estático (Calculadora IMC).
    *   Tecnología: **HTML/CSS/JS**.
    *   Puerto: **82** (Servido por Nginx).
*   **`sitio3/`**: Sitio Web Estático.
    *   Tecnología: **HTML/CSS/JS**.
    *   Puerto: **83** (Servido por Nginx).
*   **`sitio4/`**: Aplicación de Cine (Versión Original).
    *   Tecnología: **Node.js + Express + MySQL**.
    *   Puerto: **3000** (Originalmente).
    *   *Nota: Requiere base de datos.*
*   **`sitio4_static/`**: Aplicación de Cine (Versión Estática).
    *   Tecnología: **HTML/CSS/JS** (Sin Backend).
    *   Puerto: **3000** (Servido por Nginx en la instalación actual).
    *   Usa `js/data.js` para simular la base de datos.

### Configuración y Scripts
*   **`nginx/`**: Contiene las configuraciones de Nginx generadas localmente.
    *   `sitio2`: Configuración para el puerto 82.
    *   `sitio3`: Configuración para el puerto 83.
    *   *(La config de sitio4 se genera dinámicamente en el script de instalación)*.
*   **`.github/workflows/`**: Configuraciones de CI/CD para GitHub Actions.

## 📜 Scripts de Automatización

Estos scripts están diseñados para ejecutarse en el servidor Ubuntu:

*   **`clean_install.sh`** (Recomendado): **Script Maestro**.
    *   Borra configuraciones anteriores.
    *   Instala todas las dependencias (Node, Nginx, MySQL, PM2).
    *   Configura y despliega todos los sitios (Sitio 1 en Node, Sitios 2, 3 y 4 Estático en Nginx).
*   **`setup_db.sql`**: Script SQL para crear la base de datos y usuario (opcional si usas la versión estática de sitio4).
*   **`repair_server.sh`**: Script antiguo para reparaciones puntuales (obsoleto por `clean_install.sh`).
*   **`setup_server.sh`**: Script de configuración inicial (obsoleto por `clean_install.sh`).

## 🌐 Resumen de Puertos (Configuración Actual)

| Sitio | Puerto | Tecnología | URL Ejemplo |
|-------|--------|------------|-------------|
| Sitio 1 | 81 | Node.js | `http://IP:81` |
| Sitio 2 | 82 | Nginx | `http://IP:82` |
| Sitio 3 | 83 | Nginx | `http://IP:83` |
| Sitio 4 | 3000 | Nginx | `http://IP:3000` |
