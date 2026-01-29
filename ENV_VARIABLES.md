# Variables de Entorno para Producción en Netlify

## Variables Requeridas

Configura estas variables de entorno en tu panel de control de Netlify (Configuración del sitio → Variables de entorno):

### Base de Datos
```
DATABASE_URL=postgresql://user:password@host:5432/database?pgbouncer=true&connection_limit=1
```
**Nota**: Para Supabase, usa la cadena de conexión de "Transaction" pooling. Para Neon, usa la cadena de conexión "pooled".

### Autenticación
```
JWT_SECRET=tu-clave-secreta-jwt-cambiala-en-produccion
```
**Importante**: Genera un secreto aleatorio fuerte para producción.

### Cloudinary (Subida de Imágenes)
```
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

### URL del Frontend
```
FRONTEND_URL=https://tu-nombre-de-sitio.netlify.app
```
Esta será la URL de tu sitio en Netlify una vez desplegado.

## Variables Opcionales

### URL Directa de Base de Datos (para migraciones)
```
DIRECT_URL=postgresql://user:password@host:5432/database
```
Solo es necesaria si quieres ejecutar migraciones directamente (no a través del connection pooler).

## Pasos de Migración

### 1. Configurar Base de Datos Supabase/Neon

**Opción A: Supabase**
1. Crea un nuevo proyecto en https://supabase.com
2. Ve a Settings → Database
3. Copia la cadena de conexión "Transaction" pooling
4. Úsala como tu `DATABASE_URL`

**Opción B: Neon**
1. Crea un nuevo proyecto en https://neon.tech
2. Copia la cadena de conexión "pooled"
3. Úsala como tu `DATABASE_URL`

### 2. Ejecutar Migraciones

Desde tu máquina local:
```bash
# Establece la DATABASE_URL a tu base de datos en la nube
export DATABASE_URL="tu-url-de-base-de-datos-cloud"

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# (Opcional) Sembrar datos iniciales
npx prisma db seed
```

### 3. Configurar Netlify

1. Sube tu código a GitHub
2. Conecta tu repositorio a Netlify
3. Añade todas las variables de entorno en el panel de Netlify
4. ¡Despliega!

## Cambios en Endpoints de API

El frontend necesita actualizar las llamadas a la API de:
```
http://TU_IP:5000/api/v1/auth/login
```

A:
```
https://tu-nombre-de-sitio.netlify.app/api/v1/auth/login
```

O directamente a las funciones:
```
https://tu-nombre-de-sitio.netlify.app/.netlify/functions/auth/login
```

El archivo `netlify.toml` incluye redirecciones para hacer que `/api/v1/*` funcione sin problemas.

## Configuración PWA

La aplicación está configurada como una Progressive Web App (PWA). Los usuarios pueden:
1. Visitar la URL de Netlify en su navegador móvil
2. Tocar "Añadir a pantalla de inicio"
3. Úsala como una aplicación nativa

¡No se requiere envío a tiendas de aplicaciones para el despliegue inicial!
