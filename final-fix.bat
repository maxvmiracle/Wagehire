@echo off
echo Applying final ESLint fixes...

git add frontend/src/pages/Interviews.js
git commit -m "Fix remaining ESLint errors in Interviews.js

- Add missing firstDayOfMonth variable definition
- Replace Calendar with CalendarDays in all references
- Fix undefined variable errors"

git push origin main

echo.
echo Final fixes pushed successfully!
echo Vercel should now build without ESLint errors.
pause 