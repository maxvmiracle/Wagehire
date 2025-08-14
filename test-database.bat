@echo off
echo Testing database schema...
cd backend
node test-database.js
echo Test completed.
pause 