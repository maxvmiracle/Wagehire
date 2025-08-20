@echo off
echo 🚀 Deploying Wagehire to Vercel
echo =================================

echo.
echo 📋 Step 1: Installing dependencies...
npm install

echo.
echo 📋 Step 2: Building the application...
npm run build

echo.
echo 📋 Step 3: Checking if Vercel CLI is installed...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
) else (
    echo Vercel CLI is already installed.
)

echo.
echo 📋 Step 4: Deploying to Vercel...
echo Please follow the prompts to complete deployment.
vercel --prod

echo.
echo ✅ Deployment completed!
echo.
echo 🔧 Next Steps:
echo 1. Configure environment variables in Vercel dashboard
echo 2. Test the deployed application
echo 3. Set up custom domain (optional)
echo.
echo 📖 For detailed instructions, see PRODUCTION_DEPLOYMENT.md
pause 