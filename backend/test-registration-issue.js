const https = require('https');

// Supabase configuration
const config = {
  supabaseUrl: 'https://xzndkdqlsllwyygbniht.supabase.co',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcwNzY4MywiZXhwIjoyMDcxMjgzNjgzfQ.KQJrEg-zPQdgtHikT3wLO0JkQQV1kx8ngyJBAL-zS8k'
};

function makeSupabaseRequest(method, path, data = null) {
  const options = {
    hostname: 'xzndkdqlsllwyygbniht.supabase.co',
    port: 443,
    path: `/rest/v1${path}`,
    method: method,
    headers: {
      'Authorization': `Bearer ${config.serviceKey}`,
      'apikey': config.serviceKey,
      'Content-Type': 'application/json'
    }
  };

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
            console.log(`   Response: ${JSON.stringify(parsed, null, 2)}`);
          } catch (e) {
            console.log(`   Response: ${responseData}`);
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

async function testRegistrationIssue() {
  console.log('🔍 Testing Registration Role Assignment Issue');
  console.log('=============================================\n');

  // First, check current users
  console.log('📋 Step 1: Checking current users in database...');
  const usersResult = await makeSupabaseRequest('GET', '/users?select=id,email,name,role,created_at');
  
  if (!usersResult.success) {
    console.log('❌ Failed to get users');
    return;
  }

  let users = [];
  try {
    users = JSON.parse(usersResult.data);
  } catch (e) {
    console.log('❌ Failed to parse users response');
    return;
  }

  console.log(`📊 Found ${users.length} users in database:`);
  users.forEach((user, index) => {
    console.log(`   ${index + 1}. ${user.email} - Role: ${user.role} - Created: ${user.created_at}`);
  });

  // Test registration of a new candidate
  console.log('\n📋 Step 2: Testing new candidate registration...');
  const testCandidateData = {
    email: 'test-candidate-' + Date.now() + '@example.com',
    password: 'TestPass123!',
    name: 'Test Candidate',
    phone: '1234567890',
    current_position: 'Software Engineer',
    experience_years: 3,
    skills: 'JavaScript, React, Node.js'
  };

  const registerResult = await makeSupabaseRequest('POST', '/users', testCandidateData);
  
  if (registerResult.success) {
    console.log('✅ Registration successful');
    
    // Check the new user's role
    const newUserResult = await makeSupabaseRequest('GET', `/users?email=eq.${testCandidateData.email}&select=id,email,name,role,created_at`);
    
    if (newUserResult.success) {
      try {
        const newUsers = JSON.parse(newUserResult.data);
        if (newUsers.length > 0) {
          const newUser = newUsers[0];
          console.log(`📊 New user role: ${newUser.role}`);
          
          if (newUser.role === 'admin') {
            console.log('❌ ISSUE FOUND: New candidate is being assigned admin role!');
          } else if (newUser.role === 'candidate') {
            console.log('✅ CORRECT: New user is assigned candidate role');
          } else {
            console.log(`⚠️  UNEXPECTED: New user has role: ${newUser.role}`);
          }
        }
      } catch (e) {
        console.log('❌ Failed to parse new user response');
      }
    }
  } else {
    console.log('❌ Registration failed');
  }

  // Check total user count
  console.log('\n📋 Step 3: Checking total user count...');
  const countResult = await makeSupabaseRequest('GET', '/users?select=*', null);
  
  if (countResult.success) {
    try {
      const allUsers = JSON.parse(countResult.data);
      console.log(`📊 Total users in database: ${allUsers.length}`);
      
      if (allUsers.length === 1) {
        console.log('✅ CORRECT: Only one user, should be admin');
      } else if (allUsers.length > 1) {
        console.log('⚠️  Multiple users exist, checking roles...');
        const adminUsers = allUsers.filter(u => u.role === 'admin');
        const candidateUsers = allUsers.filter(u => u.role === 'candidate');
        
        console.log(`   Admin users: ${adminUsers.length}`);
        console.log(`   Candidate users: ${candidateUsers.length}`);
        
        if (adminUsers.length > 1) {
          console.log('❌ ISSUE: Multiple admin users found!');
        }
      }
    } catch (e) {
      console.log('❌ Failed to parse count response');
    }
  }

  console.log('\n🔍 Analysis Complete');
  console.log('===================');
  console.log('If you see "ISSUE FOUND" above, the registration logic needs fixing.');
  console.log('The first user should be admin, subsequent users should be candidates.');
}

testRegistrationIssue().catch(console.error); 