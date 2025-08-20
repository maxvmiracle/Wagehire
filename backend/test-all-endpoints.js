const https = require('https');

function testEndpoint(path, method = 'GET', data = null, description = '', userToken = null) {
  const options = {
    hostname: 'xzndkdqlsllwyygbniht.supabase.co',
    port: 443,
    path: `/functions/v1/api${path}`,
    method: method,
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ',
      'Content-Type': 'application/json'
    }
  };

  // Add user token for authenticated endpoints
  if (userToken) {
    options.headers['X-User-Token'] = userToken;
  }

  console.log(`\n🧪 Testing: ${description || `${method} ${path}`}`);
  console.log(`   URL: https://xzndkdqlsllwyygbniht.supabase.co${options.path}`);

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

async function runAllTests() {
  console.log('🚀 Comprehensive API Endpoint Testing');
  console.log('=====================================\n');

  const results = [];

  // Test 1: Health Check
  results.push(await testEndpoint('/health', 'GET', null, 'Health Check'));

  // Test 2: Login to get user token
  const loginData = {
    email: 'test@example.com',
    password: 'TestPass123!'
  };
  const loginResult = await testEndpoint('/auth/login', 'POST', loginData, 'Login to get token');
  results.push(loginResult);

  // Extract user token from login response
  let userToken = null;
  try {
    const loginResponse = JSON.parse(loginResult.data);
    userToken = loginResponse.token;
    console.log(`   Extracted user token: ${userToken ? 'Success' : 'Failed'}`);
  } catch (e) {
    console.log('   Could not extract user token from login response');
  }

  // Test 3: Get Interviews (should be empty initially)
  results.push(await testEndpoint('/interviews', 'GET', null, 'Get All Interviews', userToken));

  // Test 4: Create Interview
  const interviewData = {
    candidate_id: '7d1b3d21-ea03-4132-812f-721fb4313c00',
    company_name: 'Google',
    job_title: 'Senior Frontend Developer',
    scheduled_date: '2025-08-28T14:00:00Z',
    duration: 90,
    status: 'scheduled',
    round: 1,
    interview_type: 'technical',
    location: 'Remote',
    notes: 'React and TypeScript focused interview',
    company_website: 'https://google.com',
    interviewer_name: 'Sarah Johnson',
    interviewer_email: 'sarah.johnson@google.com',
    interviewer_position: 'Senior Engineer'
  };
  
  const createResult = await testEndpoint('/interviews', 'POST', interviewData, 'Create Interview', userToken);
  results.push(createResult);

  // Extract interview ID from response
  let interviewId = null;
  try {
    const createResponse = JSON.parse(createResult.data);
    interviewId = createResponse.interview?.id;
  } catch (e) {
    console.log('   Could not extract interview ID');
  }

  // Test 5: Get Specific Interview
  if (interviewId) {
    results.push(await testEndpoint(`/interviews/${interviewId}`, 'GET', null, 'Get Specific Interview', userToken));
  }

  // Test 6: Update Interview
  if (interviewId) {
    const updateData = {
      status: 'completed',
      notes: 'Interview completed successfully. Candidate performed well.'
    };
    results.push(await testEndpoint(`/interviews/${interviewId}`, 'PUT', updateData, 'Update Interview', userToken));
  }

  // Test 7: Get Profile
  results.push(await testEndpoint('/users/profile', 'GET', null, 'Get User Profile', userToken));

  // Test 8: Update Profile
  const profileUpdateData = {
    id: '7d1b3d21-ea03-4132-812f-721fb4313c00',
    current_position: 'Senior Software Engineer',
    experience_years: 5,
    skills: 'JavaScript, React, Node.js, TypeScript, AWS'
  };
  results.push(await testEndpoint('/users/profile', 'PUT', profileUpdateData, 'Update User Profile', userToken));

  // Test 9: Get Interviews Again (should show the created interview)
  results.push(await testEndpoint('/interviews', 'GET', null, 'Get All Interviews (After Creation)', userToken));

  // Test 10: Delete Interview
  if (interviewId) {
    results.push(await testEndpoint(`/interviews/${interviewId}`, 'DELETE', null, 'Delete Interview', userToken));
  }

  // Test 11: Get Interviews Final (should be empty again)
  results.push(await testEndpoint('/interviews', 'GET', null, 'Get All Interviews (After Deletion)', userToken));

  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

  if (passed === total) {
    console.log('\n🎉 All tests passed! Your API is working perfectly!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the responses above for details.');
  }

  console.log('\n🔗 Your API is ready for frontend integration!');
  console.log('   Base URL: https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api');
}

runAllTests().catch(console.error); 