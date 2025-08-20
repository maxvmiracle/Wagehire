// Test script to verify frontend integration with Supabase backend
const https = require('https');

// Test configuration
const config = {
  apiBaseUrl: 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ'
};

function testEndpoint(path, method = 'GET', data = null, description = '', userToken = null) {
  const options = {
    hostname: 'xzndkdqlsllwyygbniht.supabase.co',
    port: 443,
    path: `/functions/v1/api${path}`,
    method: method,
    headers: {
      'Authorization': `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json'
    }
  };

  // Add user token for authenticated endpoints
  if (userToken) {
    options.headers['X-User-Token'] = userToken;
  }

  console.log(`\n🧪 Testing: ${description || `${method} ${path}`}`);
  console.log(`   URL: ${config.apiBaseUrl}${path}`);

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          console.log(`   Response: ${JSON.stringify(parsed, null, 2).substring(0, 200)}${responseData.length > 200 ? '...' : ''}`);
        } catch (e) {
          console.log(`   Response: ${responseData.substring(0, 200)}${responseData.length > 200 ? '...' : ''}`);
        }
        
        const result = {
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300,
          data: responseData
        };
        
        resolve(result);
      });
    });

    req.on('error', (e) => {
      console.error(`   Error: ${e.message}`);
      resolve({ status: 0, success: false, error: e.message });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runFrontendIntegrationTests() {
  console.log('🚀 Frontend Integration Testing');
  console.log('===============================\n');

  const results = [];

  // Test 1: Health Check
  results.push(await testEndpoint('/health', 'GET', null, 'Health Check'));

  // Test 2: Register a test user
  const testUser = {
    email: 'frontend-test@example.com',
    password: 'TestPass123!',
    name: 'Frontend Test User',
    phone: '1234567890',
    current_position: 'Frontend Developer',
    experience_years: 2,
    skills: 'React, JavaScript, CSS'
  };
  
  results.push(await testEndpoint('/auth/register', 'POST', testUser, 'Register Test User'));

  // Test 3: Login with test user
  const loginData = {
    email: 'frontend-test@example.com',
    password: 'TestPass123!'
  };
  
  const loginResult = await testEndpoint('/auth/login', 'POST', loginData, 'Login Test User');
  results.push(loginResult);

  // Extract token from login response
  let token = null;
  try {
    const loginResponse = JSON.parse(loginResult.data);
    token = loginResponse.token;
    console.log(`   Extracted token: ${token ? 'Success' : 'Failed'}`);
  } catch (e) {
    console.log('   Could not extract token from login response');
  }

  // Test 4: Get user profile (if we have a token)
  if (token) {
    results.push(await testEndpoint('/users/profile', 'GET', null, 'Get User Profile', token));
  }

  // Test 5: Create an interview (if we have a token)
  if (token) {
    const interviewData = {
      candidate_id: '7d1b3d21-ea03-4132-812f-721fb4313c00', // Use existing user ID
      company_name: 'Frontend Test Corp',
      job_title: 'React Developer',
      scheduled_date: '2025-08-30T10:00:00Z',
      duration: 60,
      status: 'scheduled',
      round: 1,
      interview_type: 'technical',
      location: 'Remote',
      notes: 'Frontend integration test interview',
      company_website: 'https://frontend-test.com',
      interviewer_name: 'Test Interviewer',
      interviewer_email: 'interviewer@frontend-test.com',
      interviewer_position: 'Senior Developer'
    };
    
    results.push(await testEndpoint('/interviews', 'POST', interviewData, 'Create Test Interview', token));
  }

  // Test 6: Get interviews
  results.push(await testEndpoint('/interviews', 'GET', null, 'Get All Interviews', token));

  // Summary
  console.log('\n📊 Frontend Integration Test Results');
  console.log('====================================');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

  if (passed === total) {
    console.log('\n🎉 All frontend integration tests passed!');
    console.log('   Your frontend is ready to connect to the Supabase backend.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the responses above for details.');
  }

  console.log('\n🔧 Next Steps:');
  console.log('   1. Copy env.production.example to .env.production');
  console.log('   2. Update your frontend environment variables');
  console.log('   3. Test your React application locally');
  console.log('   4. Deploy to production');

  console.log('\n📋 Environment Variables to Set:');
  console.log('   REACT_APP_API_BASE_URL=https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api');
  console.log('   REACT_APP_SUPABASE_URL=https://xzndkdqlsllwyygbniht.supabase.co');
  console.log('   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ');

  console.log('\n🚀 Ready for frontend deployment!');
}

runFrontendIntegrationTests().catch(console.error); 