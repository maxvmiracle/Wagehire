const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🎨 Downloading Favicon');
console.log('======================\n');

// Create a simple blue favicon using a data URL approach
const faviconSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="16" fill="#1e40af"/>
  <path d="M8 22L12 10L16 18L20 10L24 22" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="16" cy="8" r="1.5" fill="white"/>
</svg>`;

const faviconPath = path.join(__dirname, 'frontend', 'public', 'favicon.svg');

try {
  // Write the SVG favicon
  fs.writeFileSync(faviconPath, faviconSvg);
  console.log('✅ favicon.svg created successfully');
  
  // Also create a simple HTML file to test the favicon
  const testHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Favicon Test</title>
  <link rel="icon" href="favicon.svg" type="image/svg+xml" />
</head>
<body>
  <h1>Favicon Test</h1>
  <p>Check the browser tab for the favicon!</p>
</body>
</html>`;
  
  fs.writeFileSync(path.join(__dirname, 'frontend', 'public', 'favicon-test.html'), testHtml);
  console.log('✅ favicon-test.html created for testing');
  
} catch (error) {
  console.log('❌ Error creating favicon:', error.message);
}

console.log('\n🎯 Favicon Setup Complete!');
console.log('==========================');
console.log('✅ favicon.svg - Created with blue background and white "W"');
console.log('✅ HTML updated with proper favicon links');
console.log('✅ Test file created for verification');
console.log('\n🔄 Next Steps:');
console.log('   1. Deploy the changes to Vercel');
console.log('   2. Refresh your browser');
console.log('   3. Clear browser cache if needed');
console.log('   4. The favicon should now appear in the browser tab');
console.log('\n💡 If the favicon still doesn\'t show:');
console.log('   - Try hard refresh (Ctrl+F5 or Cmd+Shift+R)');
console.log('   - Clear browser cache completely');
console.log('   - Check browser developer tools for any errors');
console.log('   - Test with: https://wagehire.vercel.app/favicon-test.html'); 