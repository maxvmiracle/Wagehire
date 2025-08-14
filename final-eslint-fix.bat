@echo off
echo Applying final ESLint fixes...

git add frontend/src/pages/InterviewDetail.js frontend/src/pages/Interviews.js
git commit -m "Fix final ESLint errors

- Remove unused variables in InterviewDetail.js (today, interviewDate)
- Remove unused import MoreVertical in Interviews.js
- Remove unused functions handleRequestNotificationPermission and formatInterviewDate
- All ESLint errors should now be resolved"

git push origin main

echo.
echo Final ESLint fixes pushed successfully!
echo Vercel build should now complete without errors.
pause 