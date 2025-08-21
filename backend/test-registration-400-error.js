const axios = require('axios');

// Configuration
const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function testRegistration400Error() {
  console.log('🔍 Testing Registration 400 Error');
  console.log('==================================');

  try {
    // Test 1: Basic registration with all required fields
    console.log('\n🧪 Test 1: Basic registration with all required fields');
    
    const testUser1 = {
      email: `test-400-${Date.now()}@example.com`,
      password: 'TestPass123!',
      name: 'Test User',
      phone: '1234567890',
      current_position: 'Software Engineer',
      experience_years: 3,
      skills: 'JavaScript, React, Node.js'
    };

    console.log('📤 Sending registration data:', JSON.stringify(testUser1, null, 2));

    try {
      const response1 = await axios.post(`${SUPABASE_URL}/functions/v1/api/auth/register`, testUser1, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('✅ Test 1 SUCCESS:');
      console.log('   Status:', response1.status);
      console.log('   Response:', JSON.stringify(response1.data, null, 2));

      // Clean up
      if (response1.data.user?.id) {
        try {
          await axios.delete(`${SUPABASE_URL}/rest/v1/users?id=eq.${response1.data.user.id}`, {
            headers: {
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'apikey': SUPABASE_ANON_KEY
            }
          });
          console.log('   ✅ Test user cleaned up');
        } catch (cleanupError) {
          console.log('   ⚠️ Could not clean up test user');
        }
      }

    } catch (error1) {
      console.log('❌ Test 1 FAILED:');
      console.log('   Status:', error1.response?.status);
      console.log('   Error:', error1.response?.data?.error || error1.message);
      console.log('   Full Response:', JSON.stringify(error1.response?.data, null, 2));
    }

    // Test 2: Registration with minimal fields
    console.log('\n🧪 Test 2: Registration with minimal fields');
    
    const testUser2 = {
      email: `minimal-${Date.now()}@example.com`,
      password: 'TestPass123!',
      name: 'Minimal User'
    };

    console.log('📤 Sending registration data:', JSON.stringify(testUser2, null, 2));

    try {
      const response2 = await axios.post(`${SUPABASE_URL}/functions/v1/api/auth/register`, testUser2, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('✅ Test 2 SUCCESS:');
      console.log('   Status:', response2.status);
      console.log('   Response:', JSON.stringify(response2.data, null, 2));

      // Clean up
      if (response2.data.user?.id) {
        try {
          await axios.delete(`${SUPABASE_URL}/rest/v1/users?id=eq.${response2.data.user.id}`, {
            headers: {
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'apikey': SUPABASE_ANON_KEY
            }
          });
          console.log('   ✅ Test user cleaned up');
        } catch (cleanupError) {
          console.log('   ⚠️ Could not clean up test user');
        }
      }

    } catch (error2) {
      console.log('❌ Test 2 FAILED:');
      console.log('   Status:', error2.response?.status);
      console.log('   Error:', error2.response?.data?.error || error2.message);
      console.log('   Full Response:', JSON.stringify(error2.response?.data, null, 2));
    }

    // Test 3: Test with missing required fields
    console.log('\n🧪 Test 3: Registration with missing required fields');
    
    const testUser3 = {
      email: `missing-${Date.now()}@example.com`,
      password: 'TestPass123!'
      // Missing name field
    };

    console.log('📤 Sending registration data:', JSON.stringify(testUser3, null, 2));

    try {
      const response3 = await axios.post(`${SUPABASE_URL}/functions/v1/api/auth/register`, testUser3, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('✅ Test 3 SUCCESS (unexpected):');
      console.log('   Status:', response3.status);
      console.log('   Response:', JSON.stringify(response3.data, null, 2));

    } catch (error3) {
      console.log('❌ Test 3 FAILED (expected):');
      console.log('   Status:', error3.response?.status);
      console.log('   Error:', error3.response?.data?.error || error3.message);
      console.log('   Full Response:', JSON.stringify(error3.response?.data, null, 2));
    }

    // Test 4: Test with invalid email format
    console.log('\n🧪 Test 4: Registration with invalid email format');
    
    const testUser4 = {
      email: 'invalid-email-format',
      password: 'TestPass123!',
      name: 'Invalid Email User'
    };

    console.log('📤 Sending registration data:', JSON.stringify(testUser4, null, 2));

    try {
      const response4 = await axios.post(`${SUPABASE_URL}/functions/v1/api/auth/register`, testUser4, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('✅ Test 4 SUCCESS (unexpected):');
      console.log('   Status:', response4.status);
      console.log('   Response:', JSON.stringify(response4.data, null, 2));

    } catch (error4) {
      console.log('❌ Test 4 FAILED (expected):');
      console.log('   Status:', error4.response?.status);
      console.log('   Error:', error4.response?.data?.error || error4.message);
      console.log('   Full Response:', JSON.stringify(error4.response?.data, null, 2));
    }

    // Test 5: Test with weak password
    console.log('\n🧪 Test 5: Registration with weak password');
    
    const testUser5 = {
      email: `weak-pass-${Date.now()}@example.com`,
      password: '123',
      name: 'Weak Password User'
    };

    console.log('📤 Sending registration data:', JSON.stringify(testUser5, null, 2));

    try {
      const response5 = await axios.post(`${SUPABASE_URL}/functions/v1/api/auth/register`, testUser5, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('✅ Test 5 SUCCESS (unexpected):');
      console.log('   Status:', response5.status);
      console.log('   Response:', JSON.stringify(response5.data, null, 2));

    } catch (error5) {
      console.log('❌ Test 5 FAILED (expected):');
      console.log('   Status:', error5.response?.status);
      console.log('   Error:', error5.response?.data?.error || error5.message);
      console.log('   Full Response:', JSON.stringify(error5.response?.data, null, 2));
    }

    console.log('\n🎉 Registration 400 Error Testing Completed!');

  } catch (error) {
    console.error('\n❌ Test script failed:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('Request error - no response received');
    } else {
      console.error('Error details:', error);
    }
  }
}

// Run the script
testRegistration400Error().catch(console.error); 