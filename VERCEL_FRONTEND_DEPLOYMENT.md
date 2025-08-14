# Vercel Frontend Deployment Guide

This guide will walk you through deploying the Wagehire frontend on Vercel step by step.

## Prerequisites

- ✅ Vercel account (free tier available)
- ✅ Git repository with your code
- ✅ Backend deployed on Render (or other platform)
- ✅ Environment variables ready

## Step 1: Prepare Your Repository

### 1.1 Ensure Your Code is Ready

Make sure your frontend code is in the `frontend/` directory and all files are committed to Git:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 1.2 Verify Key Files Exist

Your repository should have these files:
```
frontend/
├── package.json
├── vercel.json
├── public/
│   └── index.html
└── src/
    ├── App.js
    ├── index.js
    └── components/
```

## Step 2: Create Vercel Account

1. **Go to [Vercel](https://vercel.com)**
2. **Click "Sign Up"**
3. **Choose your sign-up method:**
   - GitHub (recommended)
   - GitLab
   - Bitbucket
   - Email

## Step 3: Connect Your Repository

### 3.1 Import Project

1. **Log in to Vercel Dashboard**
2. **Click "New Project"**
3. **Import your Git repository**
4. **Select the repository** containing your Wagehire code

### 3.2 Configure Project Settings

When importing, configure these settings:

```
Framework Preset: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

## Step 4: Configure Environment Variables

### 4.1 Set Environment Variables

In the Vercel project settings, add these environment variables:

```
REACT_APP_API_URL=https://your-backend-service-name.onrender.com/api
NODE_ENV=production
```

**Important Notes:**
- Replace `your-backend-service-name` with your actual Render backend service name
- All React environment variables must start with `REACT_APP_`
- Environment variables are case-sensitive

### 4.2 How to Add Environment Variables

1. **Go to your Vercel project dashboard**
2. **Click "Settings" tab**
3. **Click "Environment Variables"**
4. **Add each variable:**
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-service-name.onrender.com/api`
   - **Environment**: Production, Preview, Development
5. **Click "Add"**
6. **Repeat for `NODE_ENV`**

## Step 5: Deploy

### 5.1 Initial Deployment

1. **Click "Deploy"** in Vercel
2. **Wait for build to complete** (usually 2-5 minutes)
3. **Check build logs** for any errors

### 5.2 Monitor Deployment

Watch the deployment logs for:
- ✅ Dependencies installed successfully
- ✅ Build completed without errors
- ✅ Deployment successful

## Step 6: Verify Deployment

### 6.1 Check Your Live Site

1. **Visit your Vercel URL** (e.g., `https://wagehire.vercel.app`)
2. **Test the application:**
   - Try to register/login
   - Check if API calls work
   - Verify all features function

### 6.2 Debug Issues

If you see a white screen or errors:

1. **Check browser console** (F12 → Console)
2. **Visit debug URL**: `https://your-site.vercel.app/?debug=true`
3. **Check Vercel build logs** for errors

## Step 7: Configure Custom Domain (Optional)

### 7.1 Add Custom Domain

1. **Go to Vercel project settings**
2. **Click "Domains"**
3. **Add your custom domain**
4. **Update DNS records** as instructed

### 7.2 Update Environment Variables

If using a custom domain, update your backend CORS settings to allow your custom domain.

## Step 8: Continuous Deployment

### 8.1 Automatic Deployments

Vercel automatically deploys when you:
- Push to `main` branch
- Create pull requests
- Merge pull requests

### 8.2 Manual Deployments

To deploy manually:
1. **Go to Vercel dashboard**
2. **Click "Deployments"**
3. **Click "Redeploy"**

## Troubleshooting

### Common Issues

#### ❌ Build Fails
**Symptoms**: Build fails in Vercel
**Solutions**:
1. Check build logs for specific errors
2. Verify all dependencies are in `package.json`
3. Ensure `vercel.json` is configured correctly

#### ❌ White Screen
**Symptoms**: Page loads but shows white screen
**Solutions**:
1. Check browser console for JavaScript errors
2. Verify environment variables are set correctly
3. Check if backend is accessible

#### ❌ API Connection Issues
**Symptoms**: Frontend can't connect to backend
**Solutions**:
1. Verify `REACT_APP_API_URL` is correct
2. Check backend CORS configuration
3. Test backend health endpoint

#### ❌ Environment Variables Not Working
**Symptoms**: `process.env.REACT_APP_API_URL` is undefined
**Solutions**:
1. Ensure variable names start with `REACT_APP_`
2. Redeploy after adding environment variables
3. Check variable names are correct

### Debug Commands

#### Check Environment Variables
```bash
# In browser console
console.log(process.env.REACT_APP_API_URL);
console.log(process.env.NODE_ENV);
```

#### Test Backend Connection
```bash
curl https://your-backend-service-name.onrender.com/api/health
```

## Configuration Files

### vercel.json
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
      "dest": "https://your-backend-service-name.onrender.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://your-backend-service-name.onrender.com/api"
  }
}
```

### package.json (Key Scripts)
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

## Performance Optimization

### 1. Enable Caching
Vercel automatically caches static assets. No additional configuration needed.

### 2. Optimize Images
Use WebP format and optimize image sizes.

### 3. Code Splitting
React.lazy() is already implemented for better performance.

## Security Considerations

### 1. Environment Variables
- Never commit sensitive data to Git
- Use Vercel environment variables for secrets
- All React env vars must start with `REACT_APP_`

### 2. CORS Configuration
Ensure your backend allows requests from your Vercel domain.

### 3. HTTPS
Vercel automatically provides SSL certificates.

## Monitoring and Analytics

### 1. Vercel Analytics
Enable Vercel Analytics in project settings for performance monitoring.

### 2. Error Tracking
Consider adding error tracking services like Sentry.

### 3. Performance Monitoring
Use browser DevTools to monitor performance.

## Cost Considerations

### Vercel Free Tier Includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ 100GB storage
- ✅ Custom domains
- ✅ SSL certificates
- ✅ Global CDN

### Paid Plans:
- **Pro**: $20/month for more bandwidth and features
- **Enterprise**: Custom pricing for large organizations

## Support Resources

### Vercel Documentation
- [Vercel Docs](https://vercel.com/docs)
- [React Deployment Guide](https://vercel.com/guides/deploying-react-with-vercel)

### Community Support
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/vercel)

## Final Checklist

Before going live, verify:

- [ ] Frontend builds successfully on Vercel
- [ ] Environment variables are set correctly
- [ ] Backend is accessible from frontend
- [ ] All features work as expected
- [ ] Custom domain is configured (if using)
- [ ] SSL certificate is active
- [ ] Performance is acceptable
- [ ] Error monitoring is set up

## Quick Commands

### Deploy Updates
```bash
git add .
git commit -m "Update for deployment"
git push origin main
# Vercel automatically deploys
```

### Check Deployment Status
1. Go to Vercel dashboard
2. Check "Deployments" tab
3. Monitor build logs

### Rollback Deployment
1. Go to Vercel dashboard
2. Click "Deployments"
3. Find previous deployment
4. Click "Redeploy"

---

**Need Help?** If you encounter issues, check the troubleshooting section above or refer to the Vercel documentation. 