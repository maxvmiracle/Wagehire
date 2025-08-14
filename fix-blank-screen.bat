@echo off
echo Adding debugging components to fix blank screen issue...

git add .
git commit -m "Add debugging components to fix blank screen issue

- Add ErrorBoundary to catch and display errors
- Add DebugInfo component for troubleshooting
- Update App.js with better error handling
- Update Layout.js with proper authentication checks
- Add debug parameter support (?debug=true)

To debug: Visit https://wagehire.vercel.app/?debug=true"

git push origin main

echo.
echo Debugging changes pushed successfully!
echo Visit https://wagehire.vercel.app/?debug=true to see debug information
pause 