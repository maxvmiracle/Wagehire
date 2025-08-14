@echo off
echo Committing and pushing ESLint fixes...

git add .
git commit -m "Fix ESLint errors for Vercel deployment

- Remove unused imports from LoadingScreen.js
- Remove unused imports from NotificationSettings.js  
- Remove unused imports from Dashboard.js
- Remove unused imports from ForgotPassword.js
- Remove unused imports from InterviewDetail.js
- Remove unused imports from Interviews.js
- Remove unused imports from Login.js
- Remove unused imports from Register.js
- Remove unused imports from notificationService.js
- Fix regex escape characters in Register.js
- Remove unused variables and functions"

git push origin main

echo.
echo Changes pushed successfully!
echo Vercel should now redeploy with the fixes.
pause 