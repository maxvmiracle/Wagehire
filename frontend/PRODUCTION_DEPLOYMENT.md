# 🚀 Production Deployment Guide

## 🎯 Overview
This guide will help you deploy your Wagehire frontend application to production using popular hosting platforms.

## 📋 Pre-Deployment Checklist

### ✅ Backend Status
- [x] Supabase backend is deployed and functional
- [x] All API endpoints are working correctly
- [x] Database schema is properly set up
- [x] Authentication is working

### ✅ Frontend Status
- [x] All tests pass locally
- [x] Environment variables are configured
- [x] Build process works without errors
- [x] All features are functional

## 🏗️ Build the Application

First, let's build the production version of your application:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Build the application
npm run build
```

The build process will create a `build` folder with optimized production files.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Vercel** is the easiest and most reliable option for React applications.

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy to Vercel
```bash
# Login to Vercel
vercel login

# Deploy the application
vercel --prod
```

#### Step 3: Configure Environment Variables
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:

```env
REACT_APP_API_BASE_URL=https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api
REACT_APP_SUPABASE_URL=https://xzndkdqlsllwyygbniht.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ
```

#### Step 4: Redeploy
```bash
vercel --prod
```

**Benefits of Vercel:**
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments from Git
- ✅ Built-in analytics
- ✅ Free tier available

---

### Option 2: Netlify

**Netlify** is another excellent option for React applications.

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Deploy to Netlify
```bash
# Login to Netlify
netlify login

# Deploy the application
netlify deploy --prod --dir=build
```

#### Step 3: Configure Environment Variables
1. Go to your Netlify dashboard
2. Select your site
3. Go to Site settings → Environment variables
4. Add the same environment variables as above

#### Step 4: Redeploy
```bash
netlify deploy --prod --dir=build
```

---

### Option 3: GitHub Pages

**GitHub Pages** is free and integrates well with GitHub repositories.

#### Step 1: Add GitHub Pages Dependency
```bash
npm install --save-dev gh-pages
```

#### Step 2: Update package.json
Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "homepage": "https://yourusername.github.io/your-repo-name"
}
```

#### Step 3: Deploy
```bash
npm run deploy
```

---

### Option 4: AWS S3 + CloudFront

**AWS S3 + CloudFront** for enterprise-grade hosting.

#### Step 1: Create S3 Bucket
1. Go to AWS S3 Console
2. Create a new bucket
3. Enable static website hosting
4. Configure bucket policy for public access

#### Step 2: Upload Files
```bash
# Install AWS CLI
aws configure

# Sync build folder to S3
aws s3 sync build/ s3://your-bucket-name --delete
```

#### Step 3: Configure CloudFront
1. Create CloudFront distribution
2. Point to S3 bucket
3. Configure custom domain (optional)

## 🔧 Environment Configuration

### Production Environment Variables

Create a `.env.production` file in your frontend directory:

```env
REACT_APP_API_BASE_URL=https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api
REACT_APP_SUPABASE_URL=https://xzndkdqlsllwyygbniht.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ
```

### Build Configuration

Update your `package.json` build script:

```json
{
  "scripts": {
    "build": "GENERATE_SOURCEMAP=false react-scripts build",
    "build:prod": "env-cmd -f .env.production react-scripts build"
  }
}
```

## 🧪 Post-Deployment Testing

After deployment, test the following:

### 1. Basic Functionality
- [ ] Application loads without errors
- [ ] All pages are accessible
- [ ] Navigation works correctly
- [ ] Responsive design works on mobile

### 2. Authentication
- [ ] Registration works
- [ ] Login works
- [ ] Logout works
- [ ] Protected routes are secure

### 3. Core Features
- [ ] Profile updates work
- [ ] Interview scheduling works
- [ ] Dashboard displays correctly
- [ ] Role-based access works

### 4. Performance
- [ ] Page load times are acceptable
- [ ] No console errors
- [ ] Images and assets load correctly

## 🔍 Monitoring and Analytics

### 1. Error Tracking
Consider adding error tracking:

```bash
npm install @sentry/react @sentry/tracing
```

### 2. Analytics
Add Google Analytics or similar:

```bash
npm install react-ga
```

### 3. Performance Monitoring
- Use browser DevTools
- Monitor Core Web Vitals
- Check Lighthouse scores

## 🚨 Troubleshooting

### Common Deployment Issues

**Issue**: Environment variables not working
- **Solution**: Make sure they're configured in your hosting platform

**Issue**: API calls failing
- **Solution**: Check CORS settings and API URLs

**Issue**: Build fails
- **Solution**: Check for TypeScript errors and missing dependencies

**Issue**: Routing not working
- **Solution**: Configure redirects for SPA routing

### Vercel Redirects Configuration

Create a `vercel.json` file:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Netlify Redirects Configuration

Create a `_redirects` file in the `public` folder:

```
/*    /index.html   200
```

## 📊 Performance Optimization

### 1. Code Splitting
Your React app should already have code splitting enabled.

### 2. Image Optimization
- Use WebP format where possible
- Implement lazy loading
- Optimize image sizes

### 3. Caching
- Configure proper cache headers
- Use service workers for offline support

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit sensitive data to Git
- Use environment variables for all secrets
- Rotate API keys regularly

### 2. HTTPS
- Ensure HTTPS is enabled
- Configure HSTS headers
- Use secure cookies

### 3. CORS
- Configure proper CORS policies
- Limit allowed origins
- Validate API requests

## 🎉 Success Checklist

- [ ] Application is deployed and accessible
- [ ] All features work correctly
- [ ] Environment variables are configured
- [ ] HTTPS is enabled
- [ ] Performance is acceptable
- [ ] Error tracking is set up
- [ ] Analytics are configured
- [ ] Monitoring is in place

## 🚀 Next Steps

1. **Set up custom domain** (optional)
2. **Configure SSL certificate** (if needed)
3. **Set up monitoring and alerts**
4. **Create backup and recovery procedures**
5. **Document deployment procedures**
6. **Train team on deployment process**

---

**Congratulations! Your Wagehire application is now live in production!** 🎉 