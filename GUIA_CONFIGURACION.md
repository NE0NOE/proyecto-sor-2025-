# Guía de Configuración e Instalación - Proyecto SOR 2025

Esta guía detalla los pasos exactos para configurar una nueva instancia AWS (Amazon Linux 2) desde cero para alojar el Proyecto SOR.

## 0. Configuración de AWS (Security Groups)

Antes de conectar al servidor, es CRÍTICO configurar el **Security Group** (Cortafuegos) de tu instancia EC2 para permitir el tráfico en los puertos que vamos a usar.

1.  Ve a la consola de AWS EC2.
2.  Selecciona tu instancia y ve a la pestaña **Security** (Seguridad).
3.  Haz clic en el enlace del **Security Group** (ej. `sg-012345...`).
4.  En "Inbound rules" (Reglas de entrada), haz clic en **Edit inbound rules**.
5.  Agrega las siguientes reglas (Add rule):

| Tipo | Protocolo | Puerto (Port range) | Origen (Source) | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| SSH | TCP | 22 | My IP (o 0.0.0.0/0) | Acceso Remoto |
| Custom TCP | TCP | **81** | 0.0.0.0/0 | Sitio 1 (Node.js) |
| Custom TCP | TCP | **82** | 0.0.0.0/0 | Sitio 2 (Estático) |
| Custom TCP | TCP | **83** | 0.0.0.0/0 | Sitio 3 (Estático) |
| Custom TCP | TCP | **84** | 0.0.0.0/0 | Sitio 4 (Estático) |

6.  Haz clic en **Save rules**.

> **Nota**: Si no haces esto, aunque configures todo perfecto dentro del servidor, **nadie podrá entrar a tus páginas**.

## 1. Preparación del Servidor

Conéctate a tu instancia EC2 vía SSH y ejecuta los siguientes comandos para actualizar el sistema e instalar las herramientas básicas.

```bash
# Actualizar el sistema
sudo yum update -y

# Instalar Git
sudo yum install git -y

# Instalar Nginx
sudo amazon-linux-extras install nginx1 -y

# Instalar Node.js (Versión 16 o superior)
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs

# Verificar instalaciones
node -v
npm -v
nginx -v
git --version
```

## 2. Configuración de Directorios y Código

Vamos a preparar la estructura de carpetas y obtener el código del proyecto.

```bash
# Ir al directorio home
cd /home/ec2-user

# Clonar el repositorio (Reemplaza URL_DEL_REPO con tu link de GitHub)
# Si subiste el código manualmente, asegúrate que la carpeta 'proyecto-sor-2025-' esté aquí
git clone URL_DEL_REPO proyecto-sor-2025-

# Entrar al directorio del proyecto
cd proyecto-sor-2025-

# Instalar dependencias del Sitio 1 (Node.js)
cd sitio1
npm install
cd ..
```

## 3. Configuración de Nginx (Servicios Web)

Configuraremos Nginx para servir los 4 sitios en los puertos requeridos (81, 82, 83, 84).

### Crear archivo de configuración

Crea un nuevo archivo de configuración para el proyecto:

```bash
sudo nano /etc/nginx/conf.d/proyecto-sor.conf
```

Pega el siguiente contenido dentro del archivo:

```nginx
# Sitio 1: Aplicación Node.js (Proxy Inverso) - Puerto 81
server {
    listen 81;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Sitio 2: Estático - Puerto 82
server {
    listen 82;
    server_name _;
    root /home/ec2-user/proyecto-sor-2025-/sitio2;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}

# Sitio 3: Estático - Puerto 83
server {
    listen 83;
    server_name _;
    root /home/ec2-user/proyecto-sor-2025-/sitio3;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}

# Sitio 4: Estático - Puerto 84
server {
    listen 84;
    server_name _;
    root /home/ec2-user/proyecto-sor-2025-/sitio4;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Guarda el archivo (Ctrl+O, Enter) y sal (Ctrl+X).

### Validar y Reiniciar Nginx

```bash
# Verificar que la configuración no tenga errores
sudo nginx -t

# Iniciar el servicio Nginx
sudo systemctl start nginx

# Habilitar Nginx para que inicie con el sistema
sudo systemctl enable nginx
```

> **IMPORTANTE**: Asegúrate de abrir los puertos 81, 82, 83 y 84 en el **Security Group** de tu instancia AWS (Reglas de entrada / Inbound Rules).

## 4. Ejecución de la Aplicación Node.js

Usaremos PM2 para mantener la aplicación Node.js corriendo en segundo plano.

```bash
# Instalar PM2 globalmente
sudo npm install pm2 -g

# Iniciar la aplicación (Sitio 1)
cd /home/ec2-user/proyecto-sor-2025-/sitio1
pm2 start server.js --name "sitio1-node"

# Guardar la lista de procesos para que inicien al reiniciar el servidor
pm2 startup
pm2 save
```

## 5. Comandos de Monitoreo y Verificación

Utiliza estos comandos para tomar las capturas de pantalla requeridas.

### Verificar Puertos Abiertos
```bash
sudo netstat -tulpn | grep nginx
```

### Monitoreo de Procesos (Node.js)
```bash
pm2 status
pm2 monit
```

### Monitoreo de Recursos del Sistema
```bash
htop
# Si no está instalado: sudo yum install htop -y
```

### Logs de Acceso (Evidencia de tráfico)
```bash
# Ver logs de Nginx en tiempo real
sudo tail -f /var/log/nginx/access.log
```
