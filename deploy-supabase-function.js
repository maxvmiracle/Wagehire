const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Supabase project details
const SUPABASE_PROJECT_ID = 'xzndkdqlsllwyygbniht';
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN; // You'll need to set this

async function deployFunction() {
  console.log('🚀 Attempting to deploy Supabase Edge Function...\n');

  if (!SUPABASE_ACCESS_TOKEN) {
    console.log('❌ SUPABASE_ACCESS_TOKEN environment variable is required');
    console.log('\n📋 To get your access token:');
    console.log('1. Go to https://supabase.com/dashboard/account/tokens');
    console.log('2. Generate a new access token');
    console.log('3. Set it as environment variable: SUPABASE_ACCESS_TOKEN=your_token_here');
    console.log('\n🔧 Alternative: Deploy manually via Supabase Dashboard');
    console.log('1. Go to https://supabase.com/dashboard/project/xzndkdqlsllwyygbniht/functions');
    console.log('2. Find the "api" function');
    console.log('3. Click "Deploy" or "Edit" to trigger redeployment');
    return;
  }

  try {
    // Read the function code
    const functionPath = path.join(__dirname, 'backend', 'supabase', 'functions', 'api', 'index.js');
    const functionCode = fs.readFileSync(functionPath, 'utf8');

    console.log('📁 Function code loaded successfully');
    console.log(`📏 Code size: ${functionCode.length} characters`);

    // Deploy using Supabase REST API
    const deployUrl = `https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_ID}/functions/api`;
    
    const response = await axios.put(deployUrl, {
      code: functionCode,
      name: 'api',
      import_map: null,
      verify_jwt: false
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Function deployed successfully!');
    console.log('📊 Response:', response.data);

    // Wait a moment and test
    console.log('\n⏳ Waiting 10 seconds for deployment to complete...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('\n🧪 Testing the deployed function...');
    await testDeployedFunction();

  } catch (error) {
    console.error('❌ Deployment failed:', error.response?.data || error.message);
    
    console.log('\n🔧 Manual Deployment Instructions:');
    console.log('1. Go to https://supabase.com/dashboard/project/xzndkdqlsllwyygbniht/functions');
    console.log('2. Find the "api" function');
    console.log('3. Click "Edit"');
    console.log('4. Copy the content from backend/supabase/functions/api/index.js');
    console.log('5. Paste it into the editor');
    console.log('6. Click "Deploy"');
  }
}

async function testDeployedFunction() {
  try {
    const axios = require('axios');
    const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

    // Test with existing user
    const email = 'test-today-1755792762618@test.com';
    const password = 'Password123!';

    const loginResponse = await axios.post(`${SUPABASE_URL}/auth/login`, {
      email,
      password
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const { token } = loginResponse.data;

    const dashboardResponse = await axios.get(`${SUPABASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': token
      }
    });

    const stats = dashboardResponse.data.stats;
    console.log('\n📊 Deployed Function Results:');
    console.log(`• Total Interviews: ${stats.totalInterviews}`);
    console.log(`• Today's Interviews: ${stats.todaysInterviews}`);
    console.log(`• Upcoming (7 days): ${stats.upcomingInterviews}`);
    console.log(`• Completed: ${stats.completedInterviews}`);

    if (stats.upcomingInterviews > 0) {
      console.log('\n🎉 SUCCESS: Today\'s interviews are now included in upcoming!');
    } else {
      console.log('\n❌ Still using old logic. Manual deployment required.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

deployFunction(); 