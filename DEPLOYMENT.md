# Tippool - Guía de Despliegue

## Despliegue Rápido

### Prerrequisitos
- Cuenta de GitHub
- Cuenta de Netlify (el plan gratuito funciona)
- Cuenta de Supabase o Neon (el plan gratuito funciona)

### 1. Instalar Dependencias

```bash
# En el directorio raíz
npm install

# En el directorio frontend
cd tippool-app
npm install
cd ..
```

### 2. Configurar Base de Datos en la Nube

#### Opción A: Supabase (Recomendado)
1. Ve a https://supabase.com y crea una cuenta gratuita
2. Crea un nuevo proyecto
3. Ve a **Settings** → **Database**
4. Bajo "Connection string", selecciona el modo **Transaction**
5. Copia la cadena de conexión (debería incluir `?pgbouncer=true`)

#### Opción B: Neon
1. Ve a https://neon.tech y crea una cuenta gratuita
2. Crea un nuevo proyecto
3. Copia la cadena de conexión **Pooled connection**

### 3. Ejecutar Migraciones de Base de Datos

```bash
# Establece tu URL de base de datos (usa la del paso 2)
export DATABASE_URL="postgresql://usuario:password@host:5432/database?pgbouncer=true"

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Opcional: Crear usuario administrador inicial
# Necesitarás hacer esto manualmente en la base de datos o vía Prisma Studio
npx prisma studio
```

### 4. Desplegar en Netlify
#### A. Subir a GitHub
```bash
# Asegúrate de que netlify.toml y package.json estén actualizados
git add .
git commit -m "Configurar despliegue en Netlify con generación automática de Prisma"
git push origin main
```
_Nota: El archivo `netlify.toml` está configurado para ejecutar automáticamente `prisma generate` durante el proceso de construcción, por lo que no necesitas un script `postinstall`._

#### B. Conectar a Netlify
1. Ve a https://app.netlify.com
2. Haz clic en **"Add new site"** → **"Import an existing project"**
3. Elige **GitHub** y autoriza a Netlify
4. Selecciona tu repositorio **Tippool**
5. Netlify detectará automáticamente la configuración de `netlify.toml`
6. Haz clic en **"Deploy site"**

#### C. Configurar Variables de Entorno
En el panel de tu sitio en Netlify:
1. Ve a **Site settings** → **Environment variables**
2. Añade las siguientes variables:

| Variable | Valor Ejemplo | Dónde obtenerlo |
|----------|---------------|-----------------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db?pgbouncer=true` | Panel de Supabase/Neon |
| `JWT_SECRET` | `tu-calve-secreta-min-32-chars` | Genera con `openssl rand -base64 32` |
| `CLOUDINARY_CLOUD_NAME` | `tu-cloud-name` | Panel de Cloudinary |
| `CLOUDINARY_API_KEY` | `123456789012345` | Panel de Cloudinary |
| `CLOUDINARY_API_SECRET` | `abcdefghijklmnopqrstuvwxyz` | Panel de Cloudinary |
| `FRONTEND_URL` | `https://tippool.netlify.app` | Tu URL de sitio Netlify |

3. Haz clic en **"Save"**
4. Ve a **Deploys** y haz clic en **"Trigger deploy"** → **"Clear cache and deploy site"**

### 5. Actualizar URL de API del Frontend

Encuentra la configuración de la API en tu código frontend (usualmente en un archivo de configuración o constantes) y actualiza:

**Antes:**
```typescript
const API_BASE_URL = 'http://TU_IP:5000/api/v1';
```

**Después:**
```typescript
const API_BASE_URL = 'https://tu-nombre-de-sitio.netlify.app/api/v1';
```

Luego haz commit y push:
```bash
git add .
git commit -m "Actualizar URL de API para producción"
git push origin main
```

Netlify redeplegará automáticamente.

### 6. Probar tu Despliegue

1. Visita tu URL de Netlify (ej. `https://tippool.netlify.app`)
2. Prueba la funcionalidad de inicio de sesión
3. Prueba check-in/check-out
4. Prueba el reparto de propinas (como ENCARGADO)

### 7. Instalar como PWA en Móvil

**iOS:**
1. Abre Safari y visita tu URL de Netlify
2. Toca el botón Compartir
3. Baja y toca **"Añadir a pantalla de inicio"**
4. Toca **"Añadir"**

**Android:**
1. Abre Chrome y visita tu URL de Netlify
2. Toca el menú (tres puntos)
3. Toca **"Añadir a pantalla de inicio"**
4. Toca **"Añadir"**

## Solución de Problemas

### Fallo de Construcción en Netlify
- Revisa los logs de construcción en el panel de Netlify
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica la configuración de `netlify.toml`

### Errores de Conexión a Base de Datos
- Verifica que `DATABASE_URL` sea correcta
- Asegúrate de estar usando la cadena de conexión **pooled/transaction**
- Revisa que las migraciones se hayan ejecutado

### API Devuelve 404
- Verifica que las Netlify Functions estén desplegadas (revisa la pestaña Functions en el panel)
- Revisa que las URLs de la API en el frontend coincidan con la URL del sitio Netlify
- Revisa las redirecciones en `netlify.toml`

### Imágenes No Se Suben
- Verifica que las credenciales de Cloudinary sean correctas
- Revisa que las tres variables de Cloudinary estén establecidas

## Dominio Personalizado (Opcional)

1. En el panel de Netlify, ve a **Domain settings**
2. Haz clic en **"Add custom domain"**
3. Sigue las instrucciones para configurar DNS
4. Actualiza la variable de entorno `FRONTEND_URL` con tu dominio personalizado

## Monitoreo

- **Netlify Analytics**: Site settings → Analytics
- **Function Logs**: Pestaña Functions → Ver logs
- **Database Monitoring**: Panel de Supabase/Neon

## Estimación de Costos (Plan Gratuito)

- **Netlify**: Gratis (100GB ancho de banda, 300 minutos de construcción/mes)
- **Supabase**: Gratis (500MB base de datos, 2GB ancho de banda)
- **Neon**: Gratis (0.5GB almacenamiento, 100 horas computación)
- **Cloudinary**: Gratis (25GB almacenamiento, 25GB ancho de banda)

**Total**: $0/mes para uso pequeño a mediano

## Soporte

Para problemas, revisa:
1. Logs de construcción de Netlify
2. Logs de funciones de Netlify
3. Consola del navegador para errores de frontend
4. Conexión a base de datos en panel de Supabase/Neon
