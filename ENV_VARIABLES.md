# Environment Variables for Netlify Production

## Required Variables

Configure these environment variables in your Netlify dashboard (Site settings → Environment variables):

### Database
```
DATABASE_URL=postgresql://user:password@host:5432/database?pgbouncer=true&connection_limit=1
```
**Note**: For Supabase, use the "Transaction" pooling connection string. For Neon, use the pooled connection string.

### Authentication
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```
**Important**: Generate a strong random secret for production.

### Cloudinary (Image Upload)
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend URL
```
FRONTEND_URL=https://your-site-name.netlify.app
```
This will be your Netlify site URL once deployed.

## Optional Variables

### Direct Database URL (for migrations)
```
DIRECT_URL=postgresql://user:password@host:5432/database
```
Only needed if you want to run migrations directly (not through connection pooler).

## Migration Steps

### 1. Set up Supabase/Neon Database

**Option A: Supabase**
1. Create a new project at https://supabase.com
2. Go to Settings → Database
3. Copy the "Transaction" pooling connection string
4. Use this as your `DATABASE_URL`

**Option B: Neon**
1. Create a new project at https://neon.tech
2. Copy the pooled connection string
3. Use this as your `DATABASE_URL`

### 2. Run Migrations

From your local machine:
```bash
# Set the DATABASE_URL to your cloud database
export DATABASE_URL="your-cloud-database-url"

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed initial data
npx prisma db seed
```

### 3. Configure Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add all environment variables in Netlify dashboard
4. Deploy!

## API Endpoint Changes

The frontend needs to update API calls from:
```
http://TU_IP:5000/api/v1/auth/login
```

To:
```
https://your-site-name.netlify.app/api/v1/auth/login
```

Or directly to functions:
```
https://your-site-name.netlify.app/.netlify/functions/auth/login
```

The `netlify.toml` file includes redirects to make `/api/v1/*` work seamlessly.

## PWA Configuration

The app is configured as a Progressive Web App (PWA). Users can:
1. Visit the Netlify URL on their mobile browser
2. Tap "Add to Home Screen"
3. Use it like a native app

No app store submission required for initial deployment!
