const axios = require('axios');

const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function checkUsers() {
  console.log('🔍 Checking Users in Database...\n');

  try {
    // Step 1: Register a new user (should be admin if first user)
    console.log('📋 Step 1: Registering a new user...');
    const registerResponse = await axios.post(`${SUPABASE_URL}/auth/register`, {
      email: 'admin-check-1755792762618@test.com',
      password: 'Password123!',
      name: 'Admin Check User'
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Registration response:', JSON.stringify(registerResponse.data, null, 2));

    // Step 2: Login with the new user
    console.log('\n📋 Step 2: Logging in with the new user...');
    const loginResponse = await axios.post(`${SUPABASE_URL}/auth/login`, {
      email: 'admin-check-1755792762618@test.com',
      password: 'Password123!'
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const { token, user } = loginResponse.data;
    console.log('Login response:', JSON.stringify(loginResponse.data, null, 2));

    // Step 3: Try to access admin users endpoint
    console.log('\n📋 Step 3: Testing admin access...');
    try {
      const usersResponse = await axios.get(`${SUPABASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': token
        }
      });

      console.log('✅ Admin access successful!');
      console.log('Users found:', usersResponse.data.users.length);
    } catch (error) {
      console.log('❌ Admin access failed:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

checkUsers(); 