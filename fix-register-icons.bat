@echo off
echo Fixing register page icon visibility with enhanced styling...
echo.
echo 1. Added z-index to ensure icons appear above inputs
echo 2. Changed icon colors to blue-800 for better contrast
echo 3. Added inline styles as backup for color
echo 4. Added debug logging to verify component rendering
echo 5. Icons should now be clearly visible against white input fields
echo.
git add .
git commit -m "Enhanced icon visibility: added z-index, darker colors, and debug logging"
git push origin main
echo.
echo Changes pushed! Vercel should automatically redeploy.
echo.
echo After deployment, check browser console for debug messages.
echo All form field icons should now be clearly visible in dark blue.
echo.
pause 