@echo off
echo Fixing backend database schema...
echo.
echo 1. Added missing email_verified column to users table
echo 2. Added email_verification_token and email_verification_expires columns
echo 3. Improved error handling in registration route
echo.
git add .
git commit -m "Fix database schema: add missing email verification columns"
git push origin main
echo.
echo Changes pushed! Render should automatically redeploy the backend.
echo.
echo After deployment, try registering again - it should work now.
echo.
echo If you still get errors, check the Render logs for more details.
echo.
pause 