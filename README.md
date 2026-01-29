# TipPool 💸

TipPool es una solución integral diseñada para automatizar y agilizar la gestión, recaudación y reparto de propinas digitales en el sector de la hostelería.

## 🚀 Características
- **Gestión de Personal**: Altas, bajas y edición de perfiles de mozos y encargados.
- **Reparto Automatizado**: Cálculo inteligente de propinas basado en participación y turnos.
- **Historial Detallado**: Registro completo de repartos realizados y pendientes.
- **Estadísticas Avanzadas**: Dashboards para visualizar el rendimiento del negocio.
- **Multi-rol**: Accesos diferenciados para Mozos (visualización) y Encargados (gestión).
- **Infraestructura Serverless**: Escabilidad y mantenimiento simplificado gracias a Netlify.

## 🛠️ Stack Tecnológico
- **Frontend**: React Native, Expo, React Native Paper.
- **Backend**: Serverless Functions (Netlify Functions), TypeScript.
- **Base de Datos**: PostgreSQL (via Prisma ORM) - Supabase/Neon recomendado.
- **Almacenamiento**: Cloudinary (para fotos de perfil).
- **Infraestructura**: Netlify (Hosting & Serverless Functions).

## 📦 Estructura del Proyecto
```text
Tippool/
├── netlify/            # Serverless Functions (Backend) & Librerías compartidas
│   ├── functions/      # Endpoints de la API
│   └── lib/            # Lógica de negocio y utilidades
├── tippool-app/        # Aplicación móvil (React Native)
├── tippool-backend/    # Backend Legacy (Express) - Mantenido como referencia
├── prisma/             # Schema de base de datos y migraciones
└── ...config files     # netlify.toml, package.json, etc.
```

## ⚙️ Instalación y Configuración local

### Prerrequisitos
- Node.js & npm
- Netlify CLI: `npm install -g netlify-cli`

### Backend (Serverless)
Simulamos el entorno de Netlify localmente usando Netlify CLI.

1. Instala las dependencias en la raíz del proyecto:
   ```bash
   npm install
   ```
2. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz (ver **[ENV_VARIABLES.md](./ENV_VARIABLES.md)**).
3. Asegúrate de tener el cliente de Prisma generado:
   ```bash
   npx prisma generate
   ```

### Frontend
1. Navega a la carpeta de la aplicación:
   ```bash
   cd tippool-app
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación con Expo:
   ```bash
   npm start
   ```

## 🚀 Despliegue

La aplicación está optimizada para desplegarse en **Netlify**.
Para instrucciones detalladas paso a paso, consulta **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

## 📚 Documentación
- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Guía de despliegue en producción.
- **[ENV_VARIABLES.md](./ENV_VARIABLES.md)**: Referencia de variables de entorno.
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)**: Detalles de la migración a arquitectura serverless.

---
Desarrollado con ❤️ para optimizar el trabajo en equipo.
