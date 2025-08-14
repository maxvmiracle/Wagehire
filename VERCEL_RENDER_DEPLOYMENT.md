# Vercel + Render Deployment Guide

This guide will help you deploy the Wagehire application with the frontend on Vercel and backend on Render.

## Architecture Overview

- **Frontend (React):** Deployed on Vercel
- **Backend (Node.js/Express):** Deployed on Render
- **Communication:** Frontend makes API calls to backend via Vercel proxy or direct calls

## Prerequisites

1. Vercel account (free tier available)
2. Render account (free tier available)
3. Git repository (GitHub, GitLab, etc.)

## Step 1: Backend Deployment on Render

### 1.1 Connect Repository to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your Git repository

### 1.2 Configure Backend Service

- **Name:** `wagehire-backend`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `cd backend && node server.js`
- **Root Directory:** Leave empty

### 1.3 Environment Variables

Set these in Render dashboard:
```
NODE_ENV=production
PORT=10000
```

### 1.4 Health Check

- **Health Check Path:** `/api/health`

### 1.5 Deploy

Click "Create Web Service" and wait for deployment to complete.

**Your backend will be available at:** `https://wagehire-backend.onrender.com`

## Step 2: Frontend Deployment on Vercel

### 2.1 Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository

### 2.2 Configure Frontend Project

- **Framework Preset:** Create React App
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### 2.3 Environment Variables

Set these in Vercel dashboard:
```
REACT_APP_API_URL=https://wagehire-backend.onrender.com/api
NODE_ENV=production
```

### 2.4 Deploy

Click "Deploy" and wait for deployment to complete.

**Your frontend will be available at:** `https://your-project-name.vercel.app`

## Step 3: Update Vercel Configuration

### 3.1 Update vercel.json

Update the `frontend/vercel.json` file with your actual backend URL:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://wagehire-backend.onrender.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://wagehire-backend.onrender.com/api"
  }
}
```

### 3.2 Redeploy Frontend

After updating `vercel.json`, redeploy your frontend project.

## Step 4: Testing the Deployment

### 4.1 Test Backend

```bash
# Test health endpoint
curl https://wagehire-backend.onrender.com/api/health

# Expected response:
{"status":"OK","message":"Wagehire API is running"}
```

### 4.2 Test Frontend

1. Visit your Vercel frontend URL
2. Try to register/login
3. Test all major features
4. Check browser console for any errors

### 4.3 Test API Communication

1. Open browser developer tools
2. Go to Network tab
3. Perform actions in the app
4. Verify API calls are going to the correct backend URL

## Configuration Details

### Backend CORS Configuration

The backend is configured to allow requests from:
- Localhost (development)
- Render domains (`*.onrender.com`)
- Vercel domains (`*.vercel.app`)
- Custom domains (can be added)

### Frontend API Configuration

The frontend uses:
- **Development:** Proxy to localhost:5000
- **Production:** Direct calls to Render backend or Vercel proxy

### Environment Variables

#### Backend (Render)
```
NODE_ENV=production
PORT=10000
```

#### Frontend (Vercel)
```
REACT_APP_API_URL=https://wagehire-backend.onrender.com/api
NODE_ENV=production
```

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Verify backend CORS configuration includes Vercel domains
   - Check that frontend is making requests to correct backend URL

2. **API Connection Issues:**
   - Ensure backend is running (check health endpoint)
   - Verify environment variables are set correctly
   - Check Vercel proxy configuration

3. **Build Failures:**
   - Check that all dependencies are in package.json
   - Verify build commands are correct
   - Check build logs in Vercel/Render dashboards

4. **Environment Variable Issues:**
   - Ensure variables are set in correct service
   - Check variable names match code expectations
   - Redeploy after changing environment variables

### Debugging Steps

1. **Check Backend Logs:**
   - Go to Render dashboard
   - Click on your backend service
   - Check "Logs" tab for errors

2. **Check Frontend Logs:**
   - Go to Vercel dashboard
   - Click on your project
   - Check "Functions" tab for build logs

3. **Test API Directly:**
   ```bash
   curl -X POST https://wagehire-backend.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```

4. **Check Browser Network Tab:**
   - Open browser developer tools
   - Go to Network tab
   - Perform actions and check API calls

## Advantages of This Setup

### Vercel Benefits
- ✅ Excellent React support
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments
- ✅ Built-in proxy support

### Render Benefits
- ✅ Great Node.js support
- ✅ Persistent storage options
- ✅ Database services available
- ✅ Custom domains
- ✅ Health monitoring

## Cost Considerations

### Vercel Free Tier
- Unlimited deployments
- 100GB bandwidth/month
- 100GB storage
- Custom domains

### Render Free Tier
- 750 hours/month
- 512MB RAM
- 0.1 CPU
- Services sleep after 15 minutes

## Post-Deployment

1. **Set up custom domains** (optional)
2. **Configure monitoring** and alerts
3. **Set up database** for persistent data
4. **Configure email service** for notifications
5. **Set up CI/CD** for automatic deployments

## Support

If you encounter issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Check Render documentation: https://render.com/docs
3. Review build and runtime logs
4. Test API endpoints directly 