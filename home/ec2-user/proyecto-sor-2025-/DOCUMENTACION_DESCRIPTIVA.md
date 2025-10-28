# Documentación Descriptiva - Proyecto SOR 2025

## Propósito del Proyecto

Este proyecto consiste en una plataforma web multi-sitio desplegada en AWS EC2, diseñada para demostrar capacidades de integración entre aplicaciones dinámicas y contenido estático bajo una misma infraestructura.

## Componentes del Sistema

### Sitio 1 - Aplicación de Chat en Tiempo Real
**Función**: Plataforma de comunicación interactiva  
**Características**:
- Chat en tiempo real usando WebSockets
- Interfaz web responsive
- API REST para gestión de mensajes
- Sistema de salud y monitoreo

### Sitios 2, 3, 4 - Páginas Informativas
**Función**: Presentación de contenido estático  
**Características**:
- Diseño moderno y responsive
- Contenido estático HTML/CSS/JS
- Páginas independientes pero cohesivas
- Fácil mantenimiento y actualización

## Flujo de Usuario

### Acceso a los Sitios
1. **Usuario final** accede mediante URLs específicas por puerto
2. **Nginx** recibe la petición y la dirige al componente apropiado
3. **Sitio 1** procesa interacciones dinámicas y chat
4. **Sitios 2-4** sirven contenido informativo inmediato

### Comunicación entre Componentes
- Los sitios operan de forma independiente
- Comparten misma infraestructura de servidor
- Nginx gestiona el enrutamiento transparente
- No hay dependencias directas entre sitios

## Beneficios de la Arquitectura

### Para Desarrolladores
- **Separación de preocupaciones**: Cada sitio tiene su propósito específico
- **Escalabilidad independiente**: Puede escalar componentes por separado
- **Mantenimiento simplificado**: Actualizaciones sin afectar otros sitios
- **Despliegue automatizado**: CI/CD con GitHub Actions

### Para Usuarios Finales
- **Experiencia unificada**: Mismo dominio, diferentes funcionalidades
- **Rendimiento optimizado**: Contenido estático y dinámico balanceado
- **Disponibilidad**: Múltiples sitios redundantes
- **Velocidad**: Proxy inverso optimiza la entrega de contenido

## Casos de Uso

### Escenario 1: Comunicación en Tiempo Real
- Usuarios interactúan en el chat del Sitio 1
- Mensajes se propagan instantáneamente a todos los conectados
- Sesiones persisten durante la navegación

### Escenario 2: Contenido Informativo
- Visitantes acceden a información en Sitios 2-4
- Contenido se sirve rápidamente desde archivos estáticos
- Sin sobrecarga de procesamiento del servidor

### Escenario 3: Monitoreo y Salud
- Sistema proporciona endpoints de salud
- Monitoreo continuo del estado de la aplicación
- Alertas automáticas mediante PM2

## Características Destacadas

### Arquitectura Híbrida
- Combina lo mejor de aplicaciones dinámicas y contenido estático
- Balancea carga entre procesamiento server-side y client-side
- Optimiza recursos según el tipo de contenido

### Automatización
- Despliegue continuo con GitHub Actions
- Gestión automática de procesos con PM2
- Configuración centralizada con Nginx

### Robustez
- Múltiples capas de redundancia
- Monitoreo integrado
- Recuperación automática de fallos
- Escalabilidad horizontal preparada

## Mantenimiento y Evolución

### Actualizaciones de Contenido
- Sitios estáticos: Modificar archivos HTML/CSS/JS
- Sitio dinámico: Actualizar código Node.js y dependencias
- Todas las actualizaciones se despliegan automáticamente

### Monitoreo Continuo
- Estado de servicios verificado constantemente
- Logs centralizados para diagnóstico
- Métricas de rendimiento disponibles
- Alertas proactivas de problemas

### Escalabilidad Futura
- Arquitectura preparada para adicional sitios
- Capacidad de aumentar recursos según demanda
- Posibilidad de agregar bases de datos o servicios externos
- Integración con otros servicios AWS