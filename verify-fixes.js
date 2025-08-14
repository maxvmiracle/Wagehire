const fs = require('fs');
const path = require('path');

// Files that should be checked
const filesToCheck = [
  'frontend/src/components/LoadingScreen.js',
  'frontend/src/components/NotificationSettings.js',
  'frontend/src/pages/Dashboard.js',
  'frontend/src/pages/ForgotPassword.js',
  'frontend/src/pages/InterviewDetail.js',
  'frontend/src/pages/Interviews.js',
  'frontend/src/pages/Login.js',
  'frontend/src/pages/Register.js',
  'frontend/src/services/notificationService.js'
];

// Issues that should be fixed
const issuesToCheck = [
  { file: 'LoadingScreen.js', pattern: /Users|Calendar|User|Shield|Mail|FileText|Settings|Home/, description: 'unused imports' },
  { file: 'NotificationSettings.js', pattern: /BellOff/, description: 'unused BellOff import' },
  { file: 'Dashboard.js', pattern: /import.*Star/, description: 'unused Star import' },
  { file: 'ForgotPassword.js', pattern: /const response = await/, description: 'unused response variable' },
  { file: 'InterviewDetail.js', pattern: /ExternalLink|Activity|Phone/, description: 'unused imports' },
  { file: 'Interviews.js', pattern: /Building|MapPin|ExternalLink|Linkedin|LinkIcon|Globe|Briefcase/, description: 'unused imports' },
  { file: 'Login.js', pattern: /UserCheck/, description: 'unused UserCheck import' },
  { file: 'Register.js', pattern: /UserCheck|MapPin/, description: 'unused imports' },
  { file: 'notificationService.js', pattern: /Bell/, description: 'unused Bell import' }
];

console.log('🔍 Verifying ESLint fixes...\n');

let allFixed = true;

filesToCheck.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    const issue = issuesToCheck.find(issue => issue.file === fileName);
    if (issue && issue.pattern.test(content)) {
      console.log(`❌ ${fileName}: ${issue.description} still present`);
      allFixed = false;
    } else {
      console.log(`✅ ${fileName}: Fixed`);
    }
  } else {
    console.log(`⚠️  ${filePath}: File not found`);
  }
});

console.log('\n' + (allFixed ? '🎉 All ESLint issues appear to be fixed!' : '⚠️  Some issues may still need attention'));
console.log('\nNext steps:');
console.log('1. Run: git add .');
console.log('2. Run: git commit -m "Fix ESLint errors"');
console.log('3. Run: git push origin main');
console.log('4. Vercel will automatically redeploy'); 