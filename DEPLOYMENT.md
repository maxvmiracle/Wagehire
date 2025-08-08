# Vercel Deployment Guide for Wagehire

This guide will help you deploy your Wagehire interview management system on Vercel.

## 🚀 Quick Deploy

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project root**
   ```bash
   vercel
   ```

### Option 2: Deploy via GitHub

1. **Push your code to GitHub**
2. **Connect your repository to Vercel**
3. **Configure environment variables**

## ⚙️ Environment Variables

Set these environment variables in your Vercel project settings:

### Required Variables
```
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

### Optional Variables
```
PORT=5000
```

## 📁 Project Structure for Vercel

The project is configured with the following structure:

```
wagehire/
├── vercel.json              # Main Vercel configuration
├── backend/
│   ├── vercel.json         # Backend-specific config
│   └── server.js           # API server
├── frontend/
│   ├── vercel.json         # Frontend-specific config
│   └── package.json        # React app
└── package.json            # Root package.json
```

## 🔧 Configuration Files

### Root vercel.json
Routes API requests to the backend and serves the frontend.

### Backend Configuration
- Uses `@vercel/node` for serverless functions
- Handles all `/api/*` routes
- Uses in-memory SQLite for production

### Frontend Configuration
- Uses `@vercel/static-build` for React app
- Serves static files from `build` directory
- Handles client-side routing

## 🗄️ Database Considerations

### Development
- Uses SQLite file database
- Data persists between restarts

### Production (Vercel)
- Uses in-memory SQLite
- **Data is lost on each deployment**
- For production use, consider:
  - [PlanetScale](https://planetscale.com/) (MySQL)
  - [Supabase](https://supabase.com/) (PostgreSQL)
  - [Neon](https://neon.tech/) (PostgreSQL)
  - [Railway](https://railway.app/) (PostgreSQL)

## 🚀 Deployment Steps

### 1. Prepare Your Project

Ensure all dependencies are installed:
```bash
npm run install-all
```

### 2. Test Locally

Test the production build locally:
```bash
npm run build
npm start
```

### 3. Deploy to Vercel

```bash
# From project root
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: wagehire (or your preferred name)
# - Directory: ./
# - Override settings? No
```

### 4. Set Environment Variables

In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the required variables listed above

### 5. Redeploy

After setting environment variables:
```bash
vercel --prod
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version compatibility
   - Verify build scripts are correct

2. **API Errors**
   - Check environment variables are set
   - Verify JWT_SECRET is configured
   - Check CORS settings

3. **Database Issues**
   - Remember: in-memory database resets on each deployment
   - Consider migrating to a cloud database for production

4. **Frontend Not Loading**
   - Check that the build completed successfully
   - Verify routing configuration
   - Check browser console for errors

### Debug Commands

```bash
# Check Vercel logs
vercel logs

# Check function logs
vercel logs --function=api

# Redeploy with fresh build
vercel --prod --force
```

## 🔄 Updating Your Deployment

### Automatic Deployments
- Connect your GitHub repository to Vercel
- Every push to main branch triggers automatic deployment

### Manual Deployments
```bash
vercel --prod
```

## 📊 Monitoring

### Vercel Analytics
- View deployment status in Vercel dashboard
- Monitor function execution times
- Check error rates

### Custom Monitoring
- Add logging to your API endpoints
- Monitor database performance
- Track user interactions

## 🔐 Security Considerations

1. **Environment Variables**
   - Never commit secrets to your repository
   - Use Vercel's environment variable system
   - Rotate JWT secrets regularly

2. **CORS Configuration**
   - Configure allowed origins for production
   - Restrict API access to your domain

3. **Database Security**
   - Use strong passwords for cloud databases
   - Enable SSL connections
   - Regular backups

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] JWT_SECRET set and secure
- [ ] Database migration completed (if using cloud DB)
- [ ] Frontend builds successfully
- [ ] API endpoints responding correctly
- [ ] Authentication working
- [ ] CORS configured properly
- [ ] Error handling in place
- [ ] Logging configured
- [ ] Monitoring set up

## 📞 Support

If you encounter issues:

1. **Check Vercel Documentation**: https://vercel.com/docs
2. **Review Build Logs**: `vercel logs`
3. **Test Locally**: Ensure it works in development
4. **Check Environment Variables**: Verify all are set correctly

## 🚀 Next Steps

After successful deployment:

1. **Set up a custom domain** (optional)
2. **Configure monitoring and alerts**
3. **Set up automated backups** (if using cloud database)
4. **Implement CI/CD pipeline**
5. **Add performance monitoring**

---

**Happy Deploying! 🎉**

Your Wagehire application should now be live on Vercel! 