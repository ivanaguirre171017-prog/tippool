# Tippool - Deployment Guide

## Quick Start Deployment

### Prerequisites
- GitHub account
- Netlify account (free tier works)
- Supabase or Neon account (free tier works)

### 1. Install Dependencies

```bash
# In the root directory
npm install

# In the frontend directory
cd tippool-app
npm install
cd ..
```

### 2. Set Up Cloud Database

#### Option A: Supabase (Recommended)
1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to **Settings** → **Database**
4. Under "Connection string", select **Transaction** mode
5. Copy the connection string (it should include `?pgbouncer=true`)

#### Option B: Neon
1. Go to https://neon.tech and create a free account
2. Create a new project
3. Copy the **Pooled connection** string

### 3. Run Database Migrations

```bash
# Set your database URL (use the one from step 2)
export DATABASE_URL="postgresql://user:password@host:5432/database?pgbouncer=true"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Optional: Create initial admin user
# You'll need to do this manually in the database or via Prisma Studio
npx prisma studio
```

### 4. Deploy to Netlify

#### A. Push to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

#### B. Connect to Netlify
1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize Netlify
4. Select your **Tippool** repository
5. Netlify will auto-detect the configuration from `netlify.toml`
6. Click **"Deploy site"**

#### C. Configure Environment Variables
In your Netlify site dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add the following variables:

| Variable | Example Value | Where to Get It |
|----------|---------------|-----------------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db?pgbouncer=true` | Supabase/Neon dashboard |
| `JWT_SECRET` | `your-super-secret-key-min-32-chars` | Generate with `openssl rand -base64 32` |
| `CLOUDINARY_CLOUD_NAME` | `your-cloud-name` | Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | `123456789012345` | Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | `abcdefghijklmnopqrstuvwxyz` | Cloudinary dashboard |
| `FRONTEND_URL` | `https://tippool.netlify.app` | Your Netlify site URL |

3. Click **"Save"**
4. Go to **Deploys** and click **"Trigger deploy"** → **"Clear cache and deploy site"**

### 5. Update Frontend API URL

Find the API configuration in your frontend code (usually in a config or constants file) and update:

**Before:**
```typescript
const API_BASE_URL = 'http://TU_IP:5000/api/v1';
```

**After:**
```typescript
const API_BASE_URL = 'https://your-site-name.netlify.app/api/v1';
```

Then commit and push:
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

Netlify will automatically redeploy.

### 6. Test Your Deployment

1. Visit your Netlify URL (e.g., `https://tippool.netlify.app`)
2. Test login functionality
3. Test check-in/check-out
4. Test tip distribution (as ENCARGADO)

### 7. Install as PWA on Mobile

**iOS:**
1. Open Safari and visit your Netlify URL
2. Tap the Share button
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**

**Android:**
1. Open Chrome and visit your Netlify URL
2. Tap the menu (three dots)
3. Tap **"Add to Home screen"**
4. Tap **"Add"**

## Troubleshooting

### Build Fails on Netlify
- Check the build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify `netlify.toml` configuration

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Ensure you're using the **pooled/transaction** connection string
- Check that migrations have been run

### API Returns 404
- Verify the Netlify Functions are deployed (check Functions tab in dashboard)
- Check that API URLs in frontend match the Netlify site URL
- Review `netlify.toml` redirects

### Images Not Uploading
- Verify Cloudinary credentials are correct
- Check that all three Cloudinary variables are set

## Custom Domain (Optional)

1. In Netlify dashboard, go to **Domain settings**
2. Click **"Add custom domain"**
3. Follow instructions to configure DNS
4. Update `FRONTEND_URL` environment variable with your custom domain

## Monitoring

- **Netlify Analytics**: Site settings → Analytics
- **Function Logs**: Functions tab → View logs
- **Database Monitoring**: Supabase/Neon dashboard

## Cost Estimate (Free Tier)

- **Netlify**: Free (100GB bandwidth, 300 build minutes/month)
- **Supabase**: Free (500MB database, 2GB bandwidth)
- **Neon**: Free (0.5GB storage, 100 hours compute)
- **Cloudinary**: Free (25GB storage, 25GB bandwidth)

**Total**: $0/month for small to medium usage

## Support

For issues, check:
1. Netlify build logs
2. Netlify function logs
3. Browser console for frontend errors
4. Database connection in Supabase/Neon dashboard
