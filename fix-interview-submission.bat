@echo off
echo ========================================
echo Fixing Interview Submission Issue
echo ========================================
echo.

echo Step 1: Running database migration...
cd backend
node migrate-database.js
if %errorlevel% neq 0 (
    echo ERROR: Database migration failed!
    pause
    exit /b 1
)
echo Database migration completed successfully.
echo.

echo Step 2: Testing database schema...
node test-database.js
if %errorlevel% neq 0 (
    echo ERROR: Database test failed!
    pause
    exit /b 1
)
echo Database test passed successfully.
echo.

echo Step 3: Restarting server...
cd ..
echo Server will restart automatically with the fixed schema.
echo The interview submission should now work correctly.
echo.

echo ========================================
echo Fix completed successfully!
echo ========================================
pause 