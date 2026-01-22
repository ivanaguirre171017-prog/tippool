# TipPool 💸

TipPool es una solución integral diseñada para automatizar y agilizar la gestión, recaudación y reparto de propinas digitales en el sector de la hostelería. 

## 🚀 Características
- **Gestión de Personal**: Altas, bajas y edición de perfiles de mozos y encargados.
- **Reparto Automatizado**: Cálculo inteligente de propinas basado en participación y turnos.
- **Historial Detallado**: Registro completo de repartos realizados y pendientes.
- **Estadísticas Avanzadas**: Dashboards para visualizar el rendimiento del negocio.
- **Multi-rol**: Accesos diferenciados para Mozos (visualización) y Encargados (gestión).

## 🛠️ Stack Tecnológico
- **Frontend**: React Native, Expo, React Native Paper.
- **Backend**: Node.js, Express, TypeScript.
- **Base de Datos**: PostgreSQL (via Prisma ORM).
- **Almacenamiento**: Cloudinary (para fotos de perfil).

## 📦 Estructura del Proyecto
```text
Tippool/
├── tippool-app/      # Aplicación móvil (React Native)
└── tippool-backend/  # API RESTful (Node.js)
```

## ⚙️ Instalación y Configuración

### Backend
1. Navega a `tippool-backend/`.
2. Instala dependencias: `npm install`.
3. Configura el archivo `.env` (usa `.env.example` como guía).
4. Genera el cliente de Prisma: `npm run prisma:generate`.
5. Ejecuta las migraciones: `npm run prisma:migrate`.
6. (Opcional) Carga datos de prueba: `npx prisma db seed`.
7. Inicia el servidor: `npm run dev`.

### Frontend
1. Navega a `tippool-app/`.
2. Instala dependencias: `npm install`.
3. Inicia Expo: `npm start`.

---
Desarrollado con ❤️ para optimizar el trabajo en equipo.
