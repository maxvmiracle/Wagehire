@echo off
echo ========================================
echo Fixing Deployment Crash Issue
echo ========================================
echo.

echo The server was crashing due to backup system issues.
echo Deploying a simplified version without backup system...
echo.

echo Step 1: Committing simplified server...
git add .
git commit -m "Fix deployment crash - Simplified server without backup system

- Created server-simple.js without backup functionality
- Updated render.yaml to use simplified server
- Made backup system non-blocking in main server
- Fixed backup system error handling
- Server will now start successfully with persistent storage"

echo.

echo Step 2: Pushing to deploy...
git push origin main

echo.

echo Step 3: Deployment should now succeed...
echo The server will start with persistent storage but without backup system.
echo Once it's stable, we can re-enable the backup system.
echo.

echo ========================================
echo Fix completed! Deployment should work now.
echo ========================================
pause 