@echo off
echo ========================================
echo    Wagehire Supabase Setup Script
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

REM Check if Supabase CLI is installed
supabase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Installing Supabase CLI...
    npm install -g supabase
    if %errorlevel% neq 0 (
        echo ❌ Failed to install Supabase CLI
        pause
        exit /b 1
    )
) else (
    echo ✅ Supabase CLI is installed
)

echo.
echo ========================================
echo    Setup Steps
echo ========================================
echo.
echo 1. Create a Supabase project at: https://supabase.com/dashboard
echo 2. Get your project reference from the dashboard
echo 3. Run the following commands:
echo.
echo    supabase login
echo    supabase link --project-ref YOUR_PROJECT_REF
echo    supabase db push
echo    supabase functions deploy api
echo.
echo 4. Set environment variables:
echo    supabase secrets set SUPABASE_URL=your_supabase_url
echo    supabase secrets set SUPABASE_ANON_KEY=your_supabase_anon_key
echo    supabase secrets set JWT_SECRET=your-super-secret-jwt-key-here
echo.
echo 5. Update your frontend API configuration
echo.
echo For detailed instructions, see: SUPABASE_DEPLOYMENT_GUIDE.md
echo.

pause 