const https = require('https');

// Supabase configuration
const config = {
  supabaseUrl: 'https://xzndkdqlsllwyygbniht.supabase.co',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcwNzY4MywiZXhwIjoyMDcxMjgzNjgzfQ.KQJrEg-zPQdgtHikT3wLO0JkQQV1kx8ngyJBAL-zS8k'
};

function makeSupabaseRequest(method, path, data = null, headers = {}) {
  const options = {
    hostname: 'xzndkdqlsllwyygbniht.supabase.co',
    port: 443,
    path: `/rest/v1${path}`,
    method: method,
    headers: {
      'Authorization': `Bearer ${config.serviceKey}`,
      'apikey': config.serviceKey,
      'Content-Type': 'application/json',
      ...headers
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

async function testProfileUpdateIssue() {
  console.log('🔍 Testing Profile Update Issue');
  console.log('===============================\n');

  // First, get a user to test with
  console.log('📋 Step 1: Getting a test user...');
  const usersResult = await makeSupabaseRequest('GET', '/users?select=id,email,name,role&limit=1');
  
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

  if (users.length === 0) {
    console.log('❌ No users found in database');
    return;
  }

  const testUser = users[0];
  console.log(`📊 Using test user: ${testUser.email} (${testUser.role})`);

  // Test profile update
  console.log('\n📋 Step 2: Testing profile update...');
  const updateData = {
    name: 'Updated Test User',
    phone: '9876543210',
    current_position: 'Senior Software Engineer',
    experience_years: 5,
    skills: 'JavaScript, React, Node.js, TypeScript, AWS, Docker'
  };

  const updateResult = await makeSupabaseRequest('PUT', `/users?id=eq.${testUser.id}`, updateData);
  
  if (updateResult.success) {
    console.log('✅ Profile update successful');
    
    // Get the updated user to verify changes
    const updatedUserResult = await makeSupabaseRequest('GET', `/users?id=eq.${testUser.id}&select=id,email,name,role,phone,current_position,experience_years,skills,updated_at`);
    
    if (updatedUserResult.success) {
      try {
        const updatedUsers = JSON.parse(updatedUserResult.data);
        if (updatedUsers.length > 0) {
          const updatedUser = updatedUsers[0];
          console.log('📊 Updated user data:');
          console.log(`   Name: ${updatedUser.name}`);
          console.log(`   Phone: ${updatedUser.phone}`);
          console.log(`   Position: ${updatedUser.current_position}`);
          console.log(`   Experience: ${updatedUser.experience_years} years`);
          console.log(`   Skills: ${updatedUser.skills}`);
          console.log(`   Updated at: ${updatedUser.updated_at}`);
          
          // Check if the update was successful
          const isUpdated = 
            updatedUser.name === updateData.name &&
            updatedUser.phone === updateData.phone &&
            updatedUser.current_position === updateData.current_position &&
            updatedUser.experience_years === updateData.experience_years &&
            updatedUser.skills === updateData.skills;
          
          if (isUpdated) {
            console.log('✅ Profile update verified - all fields updated correctly');
          } else {
            console.log('❌ Profile update verification failed - some fields not updated');
          }
        }
      } catch (e) {
        console.log('❌ Failed to parse updated user response');
      }
    }
  } else {
    console.log('❌ Profile update failed');
  }

  console.log('\n🔍 Analysis Complete');
  console.log('===================');
  console.log('If profile update is working in backend but not in frontend,');
  console.log('the issue might be in frontend caching or state management.');
}

testProfileUpdateIssue().catch(console.error); 