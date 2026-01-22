# TipPool Backend

Sistema de gestión y reparto automático de propinas digitales para el sector gastronómico.

## Descripción

TipPool automatiza el proceso de recepción, control de personal y distribución de propinas. Permite:
- Registro de empleados y roles (Encargado, Mozo).
- Control de asistencia (Check-in/Check-out).
- Registro de propinas (Transferencia, QR, Efectivo).
- Cálculo automático de reparto basado en horas trabajadas y puntos por rol.

## Requisitos Previos

- Node.js (v18+)
- PostgreSQL (Base de datos)

## Instalación

1. Clonar el repositorio y entrar al directorio:
   ```bash
   cd tippool-backend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   - Copiar `.env.example` a `.env`
   - Configurar la `DATABASE_URL` con tus credenciales de PostgreSQL.
   ```bash
   cp .env.example .env
   ```

4. Inicializar base de datos:
   ```bash
   npx prisma migrate dev --name init
   ```

## Ejecución

### Desarrollo
```bash
npm run dev
```
El servidor iniciará en `http://localhost:5000`.

### Producción
1. Compilar el proyecto:
   ```bash
   npm run build
   ```
2. Iniciar:
   ```bash
   npm start
   ```

## Endpoints Principales

### Auth
- `POST /api/auth/login`: Iniciar sesión.
- `POST /api/auth/register`: Registrar usuario (Solo Encargado).

### Usuarios
- `GET /api/users`: Listar usuarios.
- `PATCH /api/users/:id`: Editar usuario.

### Check-ins
- `POST /api/checkins/entrada`: Registrar entrada.
- `POST /api/checkins/salida`: Registrar salida.

### Propinas
- `POST /api/propinas`: Registrar nueva propina.
- `GET /api/propinas`: Listar propinas.

### Repartos
- `POST /api/repartos/calcular`: Ejecutar cálculo de reparto para una fecha.
- `GET /api/repartos/mis-repartos`: Ver lo asignado al usuario.
