# Foro de Chat en Tiempo Real - AWS Deployment

## Configuración del Servidor AWS

### Especificaciones
- **IP del Servidor**: 3.23.96.43
- **Puerto**: 81
- **URL de Acceso**: http://3.23.96.43:81

### Comandos de Despliegue

1. **Subir archivos al servidor**
```bash
# Copiar todos los archivos del proyecto al servidor
scp -r ./* user@3.23.96.43:/ruta/del/proyecto/
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en producción**
```bash
# Opción 1: Ejecución directa
npm start

# Opción 2: Ejecución en producción
npm run start:prod

# Opción 3: Con PM2 (recomendado para producción)
npm install -g pm2
pm2 start server.js --name "chat-forum"
pm2 startup
pm2 save
```

4. **Verificar el servicio**
```bash
# Health check
curl http://3.23.96.43:81/health

# Ver logs
pm2 logs chat-forum
```

### Configuración de Firewall AWS

Asegúrate de que el Security Group permita tráfico en el puerto 81:

```bash
# Regla de entrada
Protocol: TCP
Port: 81
Source: 0.0.0.0/0 (o IPs específicas)
```

### Características Implementadas

- ✅ Chat en tiempo real con Socket.IO
- ✅ Almacenamiento en memoria (se borra al reiniciar)
- ✅ Limpieza automática cuando no hay usuarios
- ✅ Interfaz responsive y moderna
- ✅ Health check endpoint
- ✅ Configurado para AWS en puerto 81

### URLs Importantes

- **Aplicación Principal**: http://3.23.96.43:81
- **Health Check**: http://3.23.96.43:81/health
- **Socket.IO**: ws://3.23.96.43:81/socket.io/

### Monitoreo

El servidor incluye:
- Logs de conexiones/desconexiones
- Contador de usuarios activos
- Health check automático
- Reconexión automática en el cliente
