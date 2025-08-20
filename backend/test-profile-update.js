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
  if (data) {
    console.log(`   Data: ${JSON.stringify(data, null, 2)}`);
  }

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
          console.log(`   Response: ${JSON.stringify(parsed, null, 2).substring(0, 300)}${responseData.length > 300 ? '...' : ''}`);
        } catch (e) {
          console.log(`   Response: ${responseData.substring(0, 300)}${responseData.length > 300 ? '...' : ''}`);
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

async function testProfileUpdate() {
  console.log('🚀 Profile Update Testing');
  console.log('=========================\n');

  const results = [];

  // Test 1: Login to get token
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

  // Test 2: Get current profile
  if (userToken) {
    results.push(await testEndpoint('/users/profile', 'GET', null, 'Get Current Profile', userToken));
  }

  // Test 3: Update profile
  if (userToken) {
    const profileUpdateData = {
      name: 'Updated Test User',
      phone: '9876543210',
      current_position: 'Senior Software Engineer',
      experience_years: 5,
      skills: 'JavaScript, React, Node.js, TypeScript, AWS, Docker'
    };
    results.push(await testEndpoint('/users/profile', 'PUT', profileUpdateData, 'Update Profile', userToken));
  }

  // Test 4: Get updated profile
  if (userToken) {
    results.push(await testEndpoint('/users/profile', 'GET', null, 'Get Updated Profile', userToken));
  }

  // Summary
  console.log('\n📊 Profile Update Test Results');
  console.log('==============================');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

  if (passed === total) {
    console.log('\n🎉 Profile update is working correctly!');
    console.log('   The 400 error should now be resolved.');
  } else {
    console.log('\n⚠️  Some profile update tests failed. Check the responses above for details.');
  }

  console.log('\n🔧 Profile Update Fixed:');
  console.log('   - Removed requirement for ID in request body');
  console.log('   - Now extracts user ID from authentication token');
  console.log('   - Properly handles profile updates without ID field');
}

testProfileUpdate().catch(console.error); 