@echo off
echo ========================================
echo Checking Deployment Status
echo ========================================
echo.

echo Checking Render deployment status...
echo The backend should be available at: https://wagehire-backend.onrender.com/api/health
echo.

echo Testing health endpoint...
curl -s https://wagehire-backend.onrender.com/api/health
echo.

echo.
echo ========================================
echo Deployment Status Check Complete
echo ========================================
echo.
echo If the health check returns a response, the deployment is successful.
echo You can now test the interview submission form.
echo.
pause 