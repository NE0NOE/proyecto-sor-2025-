# PROYECTO FINAL - SISTEMAS OPERATIVOS Y REDES (SOR) 2025

**Estudiante:** [TU NOMBRE]
**Fecha:** [FECHA]

---

## 1. Servicios Web (5 Ptos)

### Descripción de la Arquitectura
El proyecto implementa una arquitectura de microservicios utilizando un servidor Nginx como proxy inverso y balanceador de carga básico. Se han desplegado 4 servicios distintos accesibles a través de diferentes puertos en la misma instancia EC2.

- **Tecnologías Utilizadas:**
  - **Servidor Web:** Nginx
  - **Backend:** Node.js (Express + Socket.IO)
  - **Gestor de Procesos:** PM2
  - **Sistema Operativo:** Amazon Linux 2

### Configuración de Puertos
- **Puerto 81:** Aplicación de Chat en Tiempo Real (Node.js). Nginx actúa como proxy inverso redirigiendo el tráfico al puerto interno 3000.
- **Puerto 82:** Sitio Web Estático (Sitio 2).
- **Puerto 83:** Sitio Web Estático (Sitio 3).
- **Puerto 84:** Sitio Web Estático (Sitio 4).

---

## 2. Demostración (5 Ptos)

### Evidencia de Funcionamiento
A continuación se presentan capturas de pantalla que demuestran la accesibilidad de cada servicio desde un navegador web externo.

**[ESPACIO PARA CAPTURA 1]**
*Descripción: Captura del navegador accediendo a http://[IP-PUBLICA]:81 mostrando la aplicación de Chat.*

**[ESPACIO PARA CAPTURA 2]**
*Descripción: Captura del navegador accediendo a http://[IP-PUBLICA]:82 mostrando el Sitio 2.*

**[ESPACIO PARA CAPTURA 3]**
*Descripción: Captura del navegador accediendo a http://[IP-PUBLICA]:83 mostrando el Sitio 3.*

**[ESPACIO PARA CAPTURA 4]**
*Descripción: Captura del navegador accediendo a http://[IP-PUBLICA]:84 mostrando el Sitio 4.*

---

## 3. Configuración y Acceso Remoto (3 Ptos)

### Acceso al Servidor
El acceso al servidor se realiza mediante el protocolo SSH (Secure Shell) utilizando una llave privada (.pem) para garantizar la seguridad.

**Comando de conexión:**
`ssh -i "tu-llave.pem" ec2-user@[IP-PUBLICA]`

**[ESPACIO PARA CAPTURA 5]**
*Descripción: Captura de la terminal mostrando la conexión exitosa al servidor vía SSH.*

### Configuración del Servidor (Paso a Paso)

1.  **Configuración de Seguridad (AWS):** Se configuró el Security Group de la instancia EC2 para permitir el tráfico entrante en los puertos TCP 81, 82, 83 y 84, además del puerto 22 para SSH.

**[ESPACIO PARA CAPTURA 5.1]**
*Descripción: Captura de la consola de AWS mostrando las "Inbound Rules" del Security Group con los puertos abiertos.*

2.  **Actualización del Sistema:** Se ejecutó `sudo yum update -y` para asegurar que todos los paquetes estén al día.
2.  **Instalación de Nginx:** Se instaló el servidor web mediante `sudo amazon-linux-extras install nginx1`.
3.  **Configuración de Reverse Proxy:** Se editó el archivo `/etc/nginx/conf.d/proyecto-sor.conf` para definir los bloques `server` para cada puerto.

**[ESPACIO PARA CAPTURA 6]**
*Descripción: Captura del comando `cat /etc/nginx/conf.d/proyecto-sor.conf` mostrando la configuración realizada.*

---

## 4. Monitoreo (6 Ptos)

Se implementaron estrategias de monitoreo para supervisar tanto el rendimiento del servidor como el estado de los procesos de la aplicación.

### Caso 1: Monitoreo de Procesos con PM2
Se utiliza PM2 para gestionar la aplicación Node.js, permitiendo ver el uso de CPU, memoria y el estado (online/offline) del proceso en tiempo real.

**[ESPACIO PARA CAPTURA 7]**
*Descripción: Captura del comando `pm2 status` o `pm2 monit` mostrando la aplicación "sitio1-node" en estado "online".*

### Caso 2: Monitoreo de Recursos del Sistema con Htop
Se utiliza la herramienta `htop` para visualizar la carga general del sistema, uso de memoria RAM y los procesos que más recursos consumen.

**[ESPACIO PARA CAPTURA 8]**
*Descripción: Captura de la herramienta `htop` en ejecución, mostrando el uso de CPU y Memoria del servidor.*

### Caso 3: Verificación de Puertos (Netstat)
Se utiliza `netstat` para confirmar que Nginx está escuchando correctamente en los puertos configurados (81-84).

**[ESPACIO PARA CAPTURA 9]**
*Descripción: Captura del comando `sudo netstat -tulpn | grep nginx` mostrando los puertos abiertos.*
