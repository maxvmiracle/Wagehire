# Render Deployment Guide for Wagehire

This guide will help you deploy the Wagehire application on Render.

## Prerequisites

1. A Render account (free tier available)
2. Your code pushed to a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

### 1. Backend Deployment

1. **Connect your repository to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" and select "Web Service"
   - Connect your Git repository

2. **Configure the backend service:**
   - **Name:** `wagehire-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Root Directory:** Leave empty (or `backend` if your backend is in a subdirectory)

3. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   ```

4. **Health Check Path:** `/api/health`

### 2. Frontend Deployment

1. **Create another web service for the frontend:**
   - Click "New +" and select "Static Site"
   - Connect the same Git repository

2. **Configure the frontend service:**
   - **Name:** `wagehire-frontend`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/build`
   - **Root Directory:** Leave empty

3. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-service-name.onrender.com/api
   NODE_ENV=production
   ```

### 3. Using render.yaml (Alternative Method)

If you prefer to use the `render.yaml` file:

1. Make sure your `render.yaml` is in the root of your repository
2. In Render dashboard, create a new "Blueprint" service
3. Connect your repository
4. Render will automatically detect and use the `render.yaml` configuration

## Important Configuration Notes

### Backend Configuration

- The backend will be available at: `https://your-backend-service-name.onrender.com`
- API endpoints will be at: `https://your-backend-service-name.onrender.com/api/*`
- Health check endpoint: `https://your-backend-service-name.onrender.com/api/health`

### Frontend Configuration

- The frontend will be available at: `https://your-frontend-service-name.onrender.com`
- Make sure to update the `REACT_APP_API_URL` environment variable to point to your backend service

### CORS Configuration

The backend is configured to allow requests from:
- Localhost (for development)
- All Render domains (`*.onrender.com`)
- You can add custom domains by uncommenting and modifying the CORS configuration in `backend/server.js`

## Environment Variables Setup

### Backend Environment Variables (in Render Dashboard)

```
NODE_ENV=production
PORT=10000
```

### Frontend Environment Variables (in Render Dashboard)

```
REACT_APP_API_URL=https://your-backend-service-name.onrender.com/api
NODE_ENV=production
```

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check that all dependencies are in `package.json`
   - Ensure build commands are correct
   - Check the build logs in Render dashboard

2. **CORS Errors:**
   - Verify the frontend URL is allowed in backend CORS configuration
   - Check that `REACT_APP_API_URL` is correctly set

3. **API Connection Issues:**
   - Ensure the backend service is running (check health endpoint)
   - Verify the API URL in frontend environment variables
   - Check that the backend service name in the URL matches your actual service name

4. **Database Issues:**
   - The application uses SQLite with in-memory storage for Render
   - Data will be reset on each deployment
   - For persistent data, consider using a database service

### Health Check

Test your backend is working:
```bash
curl https://your-backend-service-name.onrender.com/api/health
```

Expected response:
```json
{"status":"OK","message":"Wagehire API is running"}
```

## Post-Deployment

1. **Test the application:**
   - Visit your frontend URL
   - Try to register/login
   - Test all major features

2. **Monitor the services:**
   - Check Render dashboard for any errors
   - Monitor logs for issues
   - Set up alerts if needed

3. **Custom Domain (Optional):**
   - You can add custom domains in Render dashboard
   - Update CORS configuration to allow your custom domain

## Security Notes

- All environment variables are encrypted in Render
- HTTPS is automatically enabled
- CORS is configured to only allow specific domains
- Helmet.js provides additional security headers

## Cost Considerations

- Free tier includes:
  - 750 hours per month
  - Services sleep after 15 minutes of inactivity
  - 512MB RAM, 0.1 CPU
- Paid plans start at $7/month for always-on services

## Support

If you encounter issues:
1. Check Render documentation: https://render.com/docs
2. Review build and runtime logs in Render dashboard
3. Check the application logs for specific error messages 