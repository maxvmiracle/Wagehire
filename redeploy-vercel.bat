@echo off
echo Committing and pushing changes for Vercel redeployment...
git add .
git commit -m "Remove vercel.json for auto-detection"
git push origin main
echo.
echo Changes pushed! Vercel should automatically redeploy.
echo.
echo IMPORTANT: In your Vercel project settings:
echo 1. Go to Settings > General
echo 2. Set Framework Preset to: Create React App
echo 3. Set Root Directory to: frontend
echo 4. Set Build Command to: npm run build
echo 5. Set Output Directory to: build
echo 6. Set Install Command to: npm install
echo.
echo Also add these Environment Variables:
echo - REACT_APP_API_URL = https://your-backend-service-name.onrender.com/api
echo - NODE_ENV = production
echo.
pause 