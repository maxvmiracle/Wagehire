@echo off
echo ========================================
echo Database Management Tool
echo ========================================
echo.

if "%1"=="backup" (
    echo Creating database backup...
    cd backend
    node database/backup.js backup
    cd ..
    goto :end
)

if "%1"=="restore" (
    echo Restoring database from backup...
    cd backend
    node database/backup.js restore
    cd ..
    goto :end
)

if "%1"=="status" (
    echo Checking database status...
    cd backend
    node test-database.js
    cd ..
    goto :end
)

echo Usage: manage-database.bat [backup^|restore^|status]
echo.
echo Commands:
echo   backup  - Create a backup of the current database
echo   restore - Restore database from the latest backup
echo   status  - Check database status and schema
echo.

:end
pause 