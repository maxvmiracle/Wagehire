@echo off
echo Starting Wagehire Frontend with External Access...
echo.
echo This will make the frontend accessible from other devices on your network.
echo.
set HOST=0.0.0.0
set PORT=3000
echo Starting on http://%HOST%:%PORT%
echo.
echo To access from another device, use your computer's IP address:
echo Example: http://192.168.12.41:3000
echo.
npm start 