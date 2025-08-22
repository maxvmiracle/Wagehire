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
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    }
  };

  console.log(`\n🧹 ${method} ${path}`);

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

async function clearSupabaseData() {
  console.log('🗑️  Clearing Supabase Database Data');
  console.log('===================================\n');

  const results = [];

  // Clear data from all tables in the correct order (respecting foreign key constraints)
  
  // 1. Clear interview_feedback (depends on interviews)
  console.log('📋 Step 1: Clearing interview_feedback table...');
  results.push(await makeSupabaseRequest('DELETE', '/interview_feedback?not.is=null'));

  // 2. Clear interviews (depends on users)
  console.log('📋 Step 2: Clearing interviews table...');
  results.push(await makeSupabaseRequest('DELETE', '/interviews?not.is=null'));

  // 3. Clear users (base table)
  console.log('📋 Step 3: Clearing users table...');
  results.push(await makeSupabaseRequest('DELETE', '/users?not.is=null'));

  // Summary
  console.log('\n📊 Data Clearing Results');
  console.log('========================');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Successfully cleared: ${passed}/${total} tables`);
  console.log(`❌ Failed to clear: ${total - passed}/${total} tables`);
  console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

  if (passed === total) {
    console.log('\n🎉 All Supabase data has been cleared successfully!');
    console.log('   Your database is now clean and ready for fresh data.');
  } else {
    console.log('\n⚠️  Some tables could not be cleared. Check the responses above for details.');
  }

  console.log('\n🔧 Next Steps:');
  console.log('   1. Register a new admin user (first user becomes admin)');
  console.log('   2. Test the application with fresh data');
  console.log('   3. All previous test data has been removed');

  console.log('\n📋 Tables Cleared:');
  console.log('   - interview_feedback');
  console.log('   - interviews');
  console.log('   - users');

  console.log('\n🚀 Your Supabase database is now clean!');
}

clearSupabaseData().catch(console.error); 