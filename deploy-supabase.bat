@echo off
echo ========================================
echo Wagehire Supabase Deployment Script
echo ========================================
echo.

echo Checking prerequisites...
where supabase >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Supabase CLI is not installed!
    echo Please install it first:
    echo npm install -g supabase
    echo.
    pause
    exit /b 1
)

echo Supabase CLI found ✓
echo.

echo ========================================
echo Step 1: Initialize Supabase Project
echo ========================================
echo.

cd backend
if not exist "supabase" (
    echo Initializing Supabase project...
    supabase init
    if %errorlevel% neq 0 (
        echo ERROR: Failed to initialize Supabase project!
        pause
        exit /b 1
    )
    echo Supabase project initialized ✓
) else (
    echo Supabase project already exists ✓
)

echo.
echo ========================================
echo Step 2: Database Migration
echo ========================================
echo.

echo Applying database migrations...
supabase db push
if %errorlevel% neq 0 (
    echo ERROR: Failed to apply database migrations!
    pause
    exit /b 1
)
echo Database migrations applied ✓

echo.
echo ========================================
echo Step 3: Deploy Edge Functions
echo ========================================
echo.

echo Deploying API Edge Function...
supabase functions deploy api
if %errorlevel% neq 0 (
    echo ERROR: Failed to deploy Edge Function!
    pause
    exit /b 1
)
echo Edge Function deployed ✓

echo.
echo ========================================
echo Step 4: Environment Variables Setup
echo ========================================
echo.

echo IMPORTANT: You need to set environment variables manually!
echo.
echo Run these commands with your actual values:
echo.
echo supabase secrets set SUPABASE_URL=your_supabase_url
echo supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
echo.
echo You can find these values in your Supabase project settings:
echo - Go to Settings ^> API
echo - Copy the "Project URL" and "service_role" key
echo.

set /p SET_VARS="Do you want to set environment variables now? (y/n): "
if /i "%SET_VARS%"=="y" (
    echo.
    set /p SUPABASE_URL="Enter your Supabase URL: "
    set /p SERVICE_ROLE_KEY="Enter your service role key: "
    
    echo Setting environment variables...
    supabase secrets set SUPABASE_URL=%SUPABASE_URL%
    supabase secrets set SUPABASE_SERVICE_ROLE_KEY=%SERVICE_ROLE_KEY%
    
    if %errorlevel% neq 0 (
        echo ERROR: Failed to set environment variables!
        pause
        exit /b 1
    )
    echo Environment variables set ✓
)

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.

echo Your Wagehire backend has been deployed to Supabase!
echo.
echo Next steps:
echo 1. Update your frontend to use Supabase Auth
echo 2. Update your API base URL to point to the Edge Function
echo 3. Test the deployment using the health check endpoint
echo.
echo Health check URL:
echo https://your-project-ref.supabase.co/functions/v1/api/health
echo.

cd ..
pause 