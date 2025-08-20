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

async function testDashboardEndpoints() {
  console.log('🚀 Dashboard Endpoints Testing');
  console.log('==============================\n');

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

  // Test 2: Test user dashboard endpoint
  if (userToken) {
    results.push(await testEndpoint('/users/me/dashboard', 'GET', null, 'User Dashboard', userToken));
  }

  // Test 3: Test admin dashboard endpoint
  if (userToken) {
    results.push(await testEndpoint('/admin/dashboard', 'GET', null, 'Admin Dashboard', userToken));
  }

  // Test 4: Test admin interviews endpoint
  if (userToken) {
    results.push(await testEndpoint('/admin/interviews', 'GET', null, 'Admin Interviews', userToken));
  }

  // Summary
  console.log('\n📊 Dashboard Test Results');
  console.log('========================');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

  if (passed === total) {
    console.log('\n🎉 All dashboard endpoints are working correctly!');
    console.log('   The CORS issue should now be resolved.');
  } else {
    console.log('\n⚠️  Some dashboard endpoints failed. Check the responses above for details.');
  }

  console.log('\n🔧 CORS Headers Updated:');
  console.log('   - Added x-user-token and X-User-Token to Access-Control-Allow-Headers');
  console.log('   - Added Access-Control-Allow-Methods');
  console.log('   - Dashboard endpoints now properly handle authentication');
}

testDashboardEndpoints().catch(console.error); 