# 🚀 Render Deployment Guide

This guide will help you deploy Wagehire to Render and fix the deployment issues.

## 🔧 **Problem Fixed**

The original error was:
```
Error: Cannot find module '/opt/render/project/src/index.js'
```

This happened because Render was looking for `index.js` in the root directory, but your backend was in the `backend/` folder.

## ✅ **Solution Implemented**

1. **Created `index.js`** in the root directory that properly loads the backend
2. **Updated `package.json`** with Render-specific scripts
3. **Created `render.yaml`** for proper service configuration
4. **Added deployment scripts** for build and start processes

## 🚀 **Deployment Steps**

### **Step 1: Prepare Your Repository**

Make sure your repository has these files:
- ✅ `index.js` (new entry point)
- ✅ `package.json` (updated with render scripts)
- ✅ `render.yaml` (deployment configuration)
- ✅ `backend/server.js` (your backend server)
- ✅ `frontend/` (your React app)

### **Step 2: Deploy to Render**

#### **Option A: Using render.yaml (Recommended)**

1. **Connect your GitHub repository** to Render
2. **Create a new Web Service**
3. **Select "Use render.yaml"** during setup
4. **Render will automatically**:
   - Deploy both backend and frontend services
   - Set up environment variables
   - Configure health checks

#### **Option B: Manual Setup**

**Backend Service:**
1. **Create a new Web Service**
2. **Environment**: Node
3. **Build Command**: `npm run render-build`
4. **Start Command**: `npm run render-start`
5. **Health Check Path**: `/api/health`

**Frontend Service:**
1. **Create a new Static Site**
2. **Build Command**: `cd frontend && npm install && npm run build`
3. **Publish Directory**: `frontend/build`

### **Step 3: Environment Variables**

Set these environment variables in Render:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (for Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL (update with your frontend URL)
FRONTEND_URL=https://your-frontend-domain.onrender.com

# Database Reset (set to 'false' for production)
RESET_DB=false

# Node Environment
NODE_ENV=production

# Port (Render sets this automatically)
PORT=10000
```

### **Step 4: Update Frontend API URL**

In your frontend service, set:
```env
REACT_APP_API_URL=https://your-backend-service.onrender.com
```

## 🔍 **Troubleshooting**

### **Issue 1: Build Fails**
**Solution**: Check that all dependencies are in `package.json`

### **Issue 2: Server Won't Start**
**Solution**: 
1. Check environment variables are set
2. Verify `JWT_SECRET` is configured
3. Check logs for specific errors

### **Issue 3: Database Issues**
**Solution**:
1. Set `RESET_DB=false` for production
2. Ensure database files are writable
3. Check SQLite permissions

### **Issue 4: Email Not Working**
**Solution**:
1. Verify Gmail App Password is correct
2. Check `EMAIL_USER` and `EMAIL_PASS` are set
3. Ensure 2FA is enabled on Gmail

## 📋 **Deployment Checklist**

- [ ] Repository connected to Render
- [ ] Environment variables configured
- [ ] Backend service deployed
- [ ] Frontend service deployed
- [ ] Health check passing (`/api/health`)
- [ ] Email configuration working
- [ ] Database accessible
- [ ] Frontend can connect to backend

## 🎯 **Expected Results**

After successful deployment:
1. **Backend**: `https://your-backend.onrender.com`
2. **Frontend**: `https://your-frontend.onrender.com`
3. **Health Check**: `https://your-backend.onrender.com/api/health` returns `{"status":"ok"}`
4. **API Endpoints**: All backend routes working
5. **Email**: Verification emails sent successfully

## 🔧 **Manual Deployment Commands**

If you need to deploy manually:

```bash
# Install dependencies
npm run install-all

# Build frontend
npm run build

# Start backend
npm run render-start
```

## 📞 **Support**

If you encounter issues:
1. Check Render logs for specific errors
2. Verify all environment variables are set
3. Test health check endpoint
4. Check database permissions
5. Verify email configuration

## 🎉 **Success!**

Once deployed, your Wagehire application will be accessible from anywhere with:
- ✅ Automatic scaling
- ✅ SSL certificates
- ✅ Global CDN
- ✅ Health monitoring
- ✅ Automatic deployments

The deployment should now work correctly with the new `index.js` entry point! 