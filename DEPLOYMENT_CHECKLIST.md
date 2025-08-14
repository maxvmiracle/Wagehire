# Deployment Checklist - Vercel + Render

## Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All changes committed to Git repository
- [ ] Backend CORS configured for Vercel domains
- [ ] Frontend API configuration updated
- [ ] Environment variables documented
- [ ] Build scripts tested locally

### ✅ Repository Structure
- [ ] Backend code in `/backend` directory
- [ ] Frontend code in `/frontend` directory
- [ ] `vercel.json` in `/frontend` directory
- [ ] `render.yaml` in root directory
- [ ] All dependencies in respective `package.json` files

## Backend Deployment (Render)

### ✅ Render Setup
- [ ] Render account created
- [ ] Git repository connected
- [ ] New Web Service created
- [ ] Service name: `wagehire-backend`

### ✅ Backend Configuration
- [ ] Environment: Node
- [ ] Build Command: `npm install`
- [ ] Start Command: `cd backend && node server.js`
- [ ] Root Directory: (empty)

### ✅ Environment Variables (Render)
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`

### ✅ Health Check
- [ ] Health Check Path: `/api/health`
- [ ] Backend URL: `https://wagehire-backend.onrender.com`

### ✅ Backend Testing
- [ ] Health endpoint responds correctly
- [ ] API endpoints accessible
- [ ] CORS working for Vercel domains
- [ ] Database initialization successful

## Frontend Deployment (Vercel)

### ✅ Vercel Setup
- [ ] Vercel account created
- [ ] Git repository connected
- [ ] New project created
- [ ] Framework preset: Create React App

### ✅ Frontend Configuration
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`
- [ ] Install Command: `npm install`

### ✅ Environment Variables (Vercel)
- [ ] `REACT_APP_API_URL=https://wagehire-backend.onrender.com/api`
- [ ] `NODE_ENV=production`

### ✅ Vercel Configuration
- [ ] `vercel.json` updated with correct backend URL
- [ ] Proxy routes configured
- [ ] React routing handled

### ✅ Frontend Testing
- [ ] Frontend builds successfully
- [ ] React app loads correctly
- [ ] API calls working
- [ ] Authentication flows working
- [ ] All features functional

## Post-Deployment Testing

### ✅ Integration Testing
- [ ] Frontend can communicate with backend
- [ ] User registration works
- [ ] User login works
- [ ] Interview management works
- [ ] Candidate management works
- [ ] Email functionality works

### ✅ Performance Testing
- [ ] Page load times acceptable
- [ ] API response times good
- [ ] No console errors
- [ ] Mobile responsiveness working

### ✅ Security Testing
- [ ] HTTPS working on both services
- [ ] CORS properly configured
- [ ] Environment variables secure
- [ ] No sensitive data exposed

## Monitoring Setup

### ✅ Logs and Monitoring
- [ ] Render logs accessible
- [ ] Vercel logs accessible
- [ ] Error monitoring configured
- [ ] Performance monitoring set up

### ✅ Alerts and Notifications
- [ ] Deployment notifications enabled
- [ ] Error alerts configured
- [ ] Health check monitoring active

## Documentation

### ✅ Documentation Updated
- [ ] Deployment guide completed
- [ ] Environment variables documented
- [ ] Troubleshooting guide created
- [ ] API documentation updated

## URLs and Access

### ✅ Service URLs
- [ ] Backend: `https://wagehire-backend.onrender.com`
- [ ] Frontend: `https://your-project-name.vercel.app`
- [ ] Health Check: `https://wagehire-backend.onrender.com/api/health`

### ✅ Custom Domains (Optional)
- [ ] Custom domain configured for frontend
- [ ] Custom domain configured for backend
- [ ] SSL certificates working
- [ ] DNS records updated

## Final Verification

### ✅ End-to-End Testing
- [ ] Complete user journey tested
- [ ] All features working in production
- [ ] No critical bugs found
- [ ] Performance meets requirements

### ✅ Go-Live Checklist
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Team notified of deployment
- [ ] Monitoring active
- [ ] Backup procedures in place

## Troubleshooting Reference

### Common Issues
- [ ] CORS errors → Check backend CORS configuration
- [ ] Build failures → Check dependencies and build commands
- [ ] API connection issues → Verify environment variables
- [ ] Environment variable issues → Check variable names and values

### Support Resources
- [ ] Vercel documentation bookmarked
- [ ] Render documentation bookmarked
- [ ] Error logs accessible
- [ ] Team contact information available 