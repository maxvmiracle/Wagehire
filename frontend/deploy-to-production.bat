@echo off
echo 🚀 Wagehire Frontend Deployment Script
echo ======================================
echo.

echo ✅ Step 1: Checking environment...
if not exist ".env.production" (
    echo ❌ .env.production not found! Creating from template...
    copy env.production.example .env.production
    echo ✅ Created .env.production
) else (
    echo ✅ .env.production exists
)

echo.
echo ✅ Step 2: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Step 3: Building for production...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo ✅ Step 4: Build completed successfully!
echo.
echo 📁 Build files created in: build/
echo.
echo 🚀 Ready for deployment!
echo.
echo 📋 Next Steps:
echo    1. Deploy to Vercel: vercel --prod
echo    2. Deploy to Netlify: netlify deploy --prod
echo    3. Deploy to AWS S3: aws s3 sync build/ s3://your-bucket
echo.
echo 🔧 Environment Variables to set in your deployment platform:
echo    REACT_APP_API_BASE_URL=https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api
echo    REACT_APP_SUPABASE_URL=https://xzndkdqlsllwyygbniht.supabase.co
echo    REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ
echo.
echo 🎉 Your frontend is ready for production deployment!
pause 