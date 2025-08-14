# Render Deployment Guide for Wagehire

This guide will help you deploy the Wagehire application on Render.

## Prerequisites

1. A Render account (free tier available)
2. Your code pushed to a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

### Single Service Deployment (Recommended)

The application is configured to deploy both frontend and backend as a single service on Render.

1. **Connect your repository to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" and select "Web Service"
   - Connect your Git repository

2. **Configure the service:**
   - **Name:** `wagehire`
   - **Environment:** `Node`
   - **Build Command:** `npm run install-all && npm run build`
   - **Start Command:** `cd backend && node server.js`
   - **Root Directory:** Leave empty

3. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   REACT_APP_API_URL=/api
   ```

4. **Health Check Path:** `/api/health`

### Alternative: Separate Services (Legacy Method)

If you prefer separate services, you can create two services:

#### Backend Service
- **Type:** Web Service
- **Build Command:** `npm install`
- **Start Command:** `cd backend && node server.js`
- **Environment Variables:**
  ```
  NODE_ENV=production
  PORT=10000
  ```

#### Frontend Service
- **Type:** Static Site
- **Build Command:** `cd frontend && npm install && npm run build`
- **Publish Directory:** `frontend/build`
- **Environment Variables:**
  ```
  REACT_APP_API_URL=https://your-backend-service-name.onrender.com/api
  NODE_ENV=production
  ```

## Using render.yaml (Recommended)

The `render.yaml` file is configured for single-service deployment:

1. Make sure your `render.yaml` is in the root of your repository
2. In Render dashboard, create a new "Blueprint" service
3. Connect your repository
4. Render will automatically detect and use the `render.yaml` configuration

## Important Configuration Notes

### Single Service Configuration

- **Frontend:** Served from the root URL (e.g., `https://wagehire.onrender.com`)
- **Backend API:** Available at `/api/*` (e.g., `https://wagehire.onrender.com/api/health`)
- **React Router:** Handled by the backend server in production

### CORS Configuration

The backend is configured to allow requests from:
- Localhost (for development)
- All Render domains (`*.onrender.com`)
- You can add custom domains by uncommenting and modifying the CORS configuration in `backend/server.js`

## Environment Variables Setup

### Single Service Environment Variables (in Render Dashboard)

```
NODE_ENV=production
PORT=10000
REACT_APP_API_URL=/api
```

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check that all dependencies are in `package.json` files
   - Ensure build commands are correct
   - Check the build logs in Render dashboard

2. **"Route not found" Error:**
   - This usually means you're accessing the wrong URL
   - Make sure to use the main service URL, not a separate backend URL
   - The frontend should be served from the root URL

3. **API Connection Issues:**
   - Ensure the service is running (check health endpoint)
   - Verify the API URL in environment variables
   - For single service: use `/api` as the API URL

4. **Database Issues:**
   - The application uses SQLite with in-memory storage for Render
   - Data will be reset on each deployment
   - For persistent data, consider using a database service

### Health Check

Test your service is working:
```bash
curl https://your-service-name.onrender.com/api/health
```

Expected response:
```json
{"status":"OK","message":"Wagehire API is running"}
```

### Frontend Access

Your React application should be accessible at:
```
https://your-service-name.onrender.com
```

## Post-Deployment

1. **Test the application:**
   - Visit your service URL
   - Try to register/login
   - Test all major features
   - Verify API endpoints work

2. **Monitor the service:**
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