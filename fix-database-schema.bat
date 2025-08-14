@echo off
echo Running database migration...
cd backend
node migrate-database.js
echo Migration completed.
pause 