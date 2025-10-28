# Documentación Técnica - Proyecto SOR 2025

## Arquitectura del Sistema

### Componentes Principales
- **Sitio 1**: Aplicación Node.js con Express y Socket.IO
- **Sitios 2, 3, 4**: Sitios estáticos HTML/CSS/JS
- **Nginx**: Servidor web y proxy inverso
- **PM2**: Gestor de procesos para Node.js
- **EC2**: Servidor Amazon Linux 2

### Especificaciones Técnicas

#### Puertos y Configuración
- **Puerto 81**: Proxy inverso para Sitio 1 (Node.js)
- **Puerto 82**: Sitio estático 2
- **Puerto 83**: Sitio estático 3  
- **Puerto 84**: Sitio estático 4
- **Puerto 3000**: Aplicación Node.js (interno)

#### Stack Tecnológico
- **Backend**: Node.js v16.20.2+, Express, Socket.IO
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Servidor**: Nginx 1.28.0
- **Process Manager**: PM2
- **Sistema Operativo**: Amazon Linux 2

#### Estructura de Directorios