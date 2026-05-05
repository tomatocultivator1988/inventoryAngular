# Deployment Guide

This guide will help you deploy the Inventory Management System to production.

## Prerequisites

- GitHub account
- Hosting platform account (Vercel, Netlify, Render, Railway, etc.)
- Supabase project (already set up)

## Backend Deployment

### Option 1: Render

1. **Create a new Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `server` folder as the root directory

2. **Configure Build Settings**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

3. **Add Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   JWT_SECRET=your-production-jwt-secret
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://your-app.onrender.com`)

### Option 2: Railway

1. **Create a new project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure**
   - Set root directory to `server`
   - Add environment variables (same as above)
   - Railway will auto-detect Node.js and deploy

3. **Get your URL**
   - Copy the generated URL from Railway dashboard

### Important: File Upload in Production

For production, you should use cloud storage instead of local filesystem:

**Option A: AWS S3**
```bash
npm install aws-sdk multer-s3
```

**Option B: Cloudinary**
```bash
npm install cloudinary multer-storage-cloudinary
```

Update `server/src/middleware/upload.ts` to use cloud storage.

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Angular
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist/inventory-frontend/browser`

3. **Update API URLs**
   Before deploying, update the API URLs in:
   - `client/src/app/services/auth.service.ts`
   - `client/src/app/services/products.service.ts`
   
   Change:
   ```typescript
   private apiUrl = 'http://localhost:3001/api/auth';
   ```
   
   To:
   ```typescript
   private apiUrl = 'https://your-backend-url.onrender.com/api/auth';
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Copy your frontend URL

### Option 2: Netlify

1. **Deploy via Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository
   - Configure:
     - **Base directory**: `client`
     - **Build command**: `npm run build`
     - **Publish directory**: `dist/inventory-frontend/browser`

2. **Update API URLs** (same as Vercel)

3. **Deploy**

---

## Post-Deployment Steps

### 1. Update CORS Settings

Update your backend `.env` or environment variables:
```
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### 2. Update Frontend API URLs

Ensure all API calls point to your production backend URL.

### 3. Test All Features

- [ ] User registration
- [ ] User login
- [ ] Create product
- [ ] Upload image
- [ ] Update product
- [ ] Delete product
- [ ] Search/filter
- [ ] Pagination
- [ ] Change password

### 4. Update README.md

Add your live URLs to the README:

```markdown
## Live Demo

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-api.onrender.com
- **API Documentation**: https://your-api.onrender.com/api/docs
```

---

## Environment Variables Checklist

### Backend (.env)
- [ ] `NODE_ENV=production`
- [ ] `PORT=3001`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `JWT_SECRET` (use a strong random string)
- [ ] `JWT_EXPIRES_IN=7d`
- [ ] `CORS_ORIGIN` (your frontend URL)

### Frontend
- [ ] Update API URLs in services
- [ ] Verify build configuration

---

## Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGIN` matches your frontend URL exactly
- Check for trailing slashes
- Verify environment variables are set correctly

### 404 on Angular Routes
Add a `_redirects` file (Netlify) or `vercel.json` (Vercel):

**Netlify** (`client/public/_redirects`):
```
/*    /index.html   200
```

**Vercel** (`client/vercel.json`):
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### File Upload Not Working
- Check if uploads directory exists and is writable
- Consider using cloud storage (S3, Cloudinary) for production
- Verify multer middleware is properly configured

### Database Connection Issues
- Verify Supabase credentials
- Check if Supabase project is active
- Ensure service role key has proper permissions

---

## Security Checklist

- [ ] Use HTTPS for both frontend and backend
- [ ] Strong JWT secret in production
- [ ] Environment variables properly set
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (optional but recommended)
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (Supabase handles this)
- [ ] File upload size limits enforced
- [ ] File type validation for uploads

---

## Monitoring & Maintenance

### Recommended Tools
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Plausible
- **Logging**: LogRocket, Datadog

### Regular Maintenance
- Monitor server logs
- Check database usage
- Review uploaded files storage
- Update dependencies regularly
- Backup database periodically

---

## Cost Estimates (Free Tiers)

- **Supabase**: Free tier (500MB database, 1GB file storage)
- **Vercel**: Free tier (100GB bandwidth/month)
- **Render**: Free tier (750 hours/month)
- **Netlify**: Free tier (100GB bandwidth/month)

**Total**: $0/month for small projects

---

## Need Help?

- Check deployment platform documentation
- Review server logs for errors
- Test API endpoints with Postman
- Verify environment variables are set correctly

Good luck with your deployment! 🚀
