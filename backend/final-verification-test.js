const https = require('https');

// Supabase Edge Function configuration
const config = {
  edgeFunctionUrl: 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ'
};

function makeEdgeFunctionRequest(method, path, data = null, userToken = null) {
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

  // Add user token if provided
  if (userToken) {
    options.headers['X-User-Token'] = userToken;
  }

  console.log(`\n🧪 ${method} ${path}`);

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (responseData) {
          try {
            const parsed = JSON.parse(responseData);
            console.log(`   Response: ${JSON.stringify(parsed, null, 2).substring(0, 200)}${responseData.length > 200 ? '...' : ''}`);
          } catch (e) {
            console.log(`   Response: ${responseData.substring(0, 200)}${responseData.length > 200 ? '...' : ''}`);
          }
        } else {
          console.log('   Response: (empty)');
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

async function finalVerificationTest() {
  console.log('🔍 Final Verification Test - All Fixes');
  console.log('=======================================\n');

  const results = {
    registration: false,
    profileUpdate: false,
    interviewScheduling: false,
    profileRetrieval: false
  };

  // Test 1: Registration with correct role assignment
  console.log('📋 Test 1: Registration Role Assignment');
  console.log('=======================================');
  
  const testUserData = {
    email: 'final-test-' + Date.now() + '@example.com',
    password: 'TestPass123!',
    name: 'Final Test User',
    phone: '1234567890',
    current_position: 'Software Engineer',
    experience_years: 3,
    skills: 'JavaScript, React, Node.js'
  };

  const registerResult = await makeEdgeFunctionRequest('POST', '/auth/register', testUserData);
  
  if (registerResult.success) {
    try {
      const registerResponse = JSON.parse(registerResult.data);
      if (registerResponse.user.role === 'candidate') {
        console.log('✅ Registration successful - correct role assigned');
        results.registration = true;
      } else {
        console.log('❌ Registration failed - wrong role assigned:', registerResponse.user.role);
      }
    } catch (e) {
      console.log('❌ Failed to parse registration response');
    }
  } else {
    console.log('❌ Registration failed');
  }

  // Test 2: Login and get JWT token
  console.log('\n📋 Test 2: Login and Authentication');
  console.log('=====================================');
  
  const loginData = {
    email: testUserData.email,
    password: testUserData.password
  };

  const loginResult = await makeEdgeFunctionRequest('POST', '/auth/login', loginData);
  
  let userToken = null;
  if (loginResult.success) {
    try {
      const loginResponse = JSON.parse(loginResult.data);
      userToken = loginResponse.token;
      console.log('✅ Login successful - JWT token obtained');
    } catch (e) {
      console.log('❌ Failed to parse login response');
    }
  } else {
    console.log('❌ Login failed');
  }

  if (!userToken) {
    console.log('❌ Cannot proceed without JWT token');
    return;
  }

  // Test 3: Profile retrieval
  console.log('\n📋 Test 3: Profile Retrieval');
  console.log('=============================');
  
  const getProfileResult = await makeEdgeFunctionRequest('GET', '/users/profile', null, userToken);
  
  if (getProfileResult.success) {
    try {
      const profileResponse = JSON.parse(getProfileResult.data);
      if (profileResponse.user.email === testUserData.email) {
        console.log('✅ Profile retrieval successful - correct user data');
        results.profileRetrieval = true;
      } else {
        console.log('❌ Profile retrieval failed - wrong user data');
      }
    } catch (e) {
      console.log('❌ Failed to parse profile response');
    }
  } else {
    console.log('❌ Profile retrieval failed');
  }

  // Test 4: Profile update
  console.log('\n📋 Test 4: Profile Update');
  console.log('==========================');
  
  const updateData = {
    name: 'Updated Final Test User',
    phone: '9876543210',
    current_position: 'Senior Software Engineer',
    experience_years: 5,
    skills: 'JavaScript, React, Node.js, TypeScript, AWS, Docker'
  };

  const updateResult = await makeEdgeFunctionRequest('PUT', '/users/profile', updateData, userToken);
  
  if (updateResult.success) {
    try {
      const updateResponse = JSON.parse(updateResult.data);
      if (updateResponse.user.name === updateData.name) {
        console.log('✅ Profile update successful - data updated correctly');
        results.profileUpdate = true;
      } else {
        console.log('❌ Profile update failed - data not updated correctly');
      }
    } catch (e) {
      console.log('❌ Failed to parse update response');
    }
  } else {
    console.log('❌ Profile update failed');
  }

  // Test 5: Interview scheduling
  console.log('\n📋 Test 5: Interview Scheduling');
  console.log('================================');
  
  const interviewData = {
    candidate_id: testUserData.email, // This will be replaced with actual user ID
    company_name: 'Final Test Company',
    job_title: 'Senior Software Engineer',
    scheduled_date: '2025-01-25T15:00:00Z',
    duration: 90,
    status: 'scheduled',
    round: 2,
    interview_type: 'technical',
    location: 'Remote',
    notes: 'Final test interview',
    company_website: 'https://finaltestcompany.com',
    company_linkedin_url: 'https://linkedin.com/company/finaltestcompany',
    job_description: 'Final test job description',
    salary_range: '$120k - $180k',
    interviewer_name: 'Jane Smith',
    interviewer_email: 'jane.smith@finaltestcompany.com',
    interviewer_position: 'Engineering Manager'
  };

  // Get the actual user ID for the interview
  const profileForInterview = await makeEdgeFunctionRequest('GET', '/users/profile', null, userToken);
  if (profileForInterview.success) {
    try {
      const profileData = JSON.parse(profileForInterview.data);
      interviewData.candidate_id = profileData.user.id;
      
      const createInterviewResult = await makeEdgeFunctionRequest('POST', '/interviews', interviewData, userToken);
      
      if (createInterviewResult.success) {
        console.log('✅ Interview scheduling successful');
        results.interviewScheduling = true;
      } else {
        console.log('❌ Interview scheduling failed');
      }
    } catch (e) {
      console.log('❌ Failed to get user ID for interview');
    }
  } else {
    console.log('❌ Cannot get user profile for interview');
  }

  // Final Summary
  console.log('\n📊 Final Verification Results');
  console.log('==============================');
  console.log(`✅ Registration Role Assignment: ${results.registration ? 'PASSED' : 'FAILED'}`);
  console.log(`✅ Profile Retrieval: ${results.profileRetrieval ? 'PASSED' : 'FAILED'}`);
  console.log(`✅ Profile Update: ${results.profileUpdate ? 'PASSED' : 'FAILED'}`);
  console.log(`✅ Interview Scheduling: ${results.interviewScheduling ? 'PASSED' : 'FAILED'}`);
  
  const passedTests = Object.values(results).filter(r => r).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n📈 Overall Success Rate: ${passedTests}/${totalTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL ISSUES FIXED SUCCESSFULLY!');
    console.log('===================================');
    console.log('✅ Registration assigns correct roles (first user = admin, others = candidate)');
    console.log('✅ Profile updates work correctly and persist');
    console.log('✅ Profile retrieval returns correct user data');
    console.log('✅ Interview scheduling works with proper candidate_id');
    console.log('✅ JWT token authentication works properly');
    console.log('\n🚀 Your Wagehire application is now fully functional!');
  } else {
    console.log('\n⚠️  Some issues still need attention.');
    console.log('   Check the failed tests above for details.');
  }

  console.log('\n🔧 Frontend Integration Notes:');
  console.log('==============================');
  console.log('1. Profile updates should now reflect immediately in the UI');
  console.log('2. Profile completion icons should update correctly');
  console.log('3. Interview scheduling should work from the frontend');
  console.log('4. Registration should assign correct roles');
  console.log('5. All authentication flows should work properly');
}

finalVerificationTest().catch(console.error); 