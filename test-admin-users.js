const axios = require('axios');

const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function testAdminUsers() {
  console.log('🔍 Testing Admin Users Endpoint...\n');

  try {
    // Step 1: Login with existing admin user
    console.log('📋 Step 1: Logging in with existing admin user...');
    const loginResponse = await axios.post(`${SUPABASE_URL}/auth/login`, {
      email: 'test-admin-1755792762618@test.com',
      password: 'Password123!'
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const { token } = loginResponse.data;
    console.log('✅ Logged in successfully');

    // Step 2: Test admin users endpoint
    console.log('\n📋 Step 2: Testing admin users endpoint...');
    const usersResponse = await axios.get(`${SUPABASE_URL}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': token
      }
    });

    const users = usersResponse.data.users;
    console.log(`✅ Found ${users.length} users:`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Step 3: Test regular users endpoint (should fail for admin)
    console.log('\n📋 Step 3: Testing regular users endpoint...');
    try {
      const regularUsersResponse = await axios.get(`${SUPABASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': token
        }
      });
      console.log('❌ Regular users endpoint should not work for admin users');
    } catch (error) {
      console.log('✅ Regular users endpoint correctly rejected admin access');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAdminUsers(); 