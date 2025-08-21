const axios = require('axios');

// Configuration - exactly what frontend uses
const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function testFrontendRegistration() {
  console.log('🔍 Testing Frontend Registration Simulation');
  console.log('===========================================');

  try {
    // Test 1: Simulate frontend registration with typical data
    console.log('\n🧪 Test 1: Frontend registration simulation');
    
    const frontendUserData = {
      name: 'John Doe',
      email: `frontend-test-${Date.now()}@example.com`,
      phone: '1234567890',
      current_position: 'Software Engineer',
      experience_years: 3,
      skills: 'JavaScript, React, Node.js',
      password: 'TestPass123!'
    };

    console.log('📤 Frontend sending data:', JSON.stringify(frontendUserData, null, 2));

    try {
      const response = await axios.post(`${SUPABASE_URL}/functions/v1/api/auth/register`, frontendUserData, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('✅ Frontend registration SUCCESS:');
      console.log('   Status:', response.status);
      console.log('   Response:', JSON.stringify(response.data, null, 2));

      // Clean up
      if (response.data.user?.id) {
        try {
          await axios.delete(`${SUPABASE_URL}/rest/v1/users?id=eq.${response.data.user.id}`, {
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

    } catch (error) {
      console.log('❌ Frontend registration FAILED:');
      console.log('   Status:', error.response?.status);
      console.log('   Error:', error.response?.data?.error || error.message);
      console.log('   Full Response:', JSON.stringify(error.response?.data, null, 2));
    }

    // Test 2: Test with empty optional fields (as frontend might send)
    console.log('\n🧪 Test 2: Frontend registration with empty optional fields');
    
    const frontendUserData2 = {
      name: 'Jane Smith',
      email: `frontend-test2-${Date.now()}@example.com`,
      phone: '',
      current_position: '',
      experience_years: '',
      skills: '',
      password: 'TestPass123!'
    };

    console.log('📤 Frontend sending data:', JSON.stringify(frontendUserData2, null, 2));

    try {
      const response2 = await axios.post(`${SUPABASE_URL}/functions/v1/api/auth/register`, frontendUserData2, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('✅ Frontend registration SUCCESS:');
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
      console.log('❌ Frontend registration FAILED:');
      console.log('   Status:', error2.response?.status);
      console.log('   Error:', error2.response?.data?.error || error2.message);
      console.log('   Full Response:', JSON.stringify(error2.response?.data, null, 2));
    }

    // Test 3: Test with null optional fields
    console.log('\n🧪 Test 3: Frontend registration with null optional fields');
    
    const frontendUserData3 = {
      name: 'Bob Wilson',
      email: `frontend-test3-${Date.now()}@example.com`,
      phone: null,
      current_position: null,
      experience_years: null,
      skills: null,
      password: 'TestPass123!'
    };

    console.log('📤 Frontend sending data:', JSON.stringify(frontendUserData3, null, 2));

    try {
      const response3 = await axios.post(`${SUPABASE_URL}/functions/v1/api/auth/register`, frontendUserData3, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('✅ Frontend registration SUCCESS:');
      console.log('   Status:', response3.status);
      console.log('   Response:', JSON.stringify(response3.data, null, 2));

      // Clean up
      if (response3.data.user?.id) {
        try {
          await axios.delete(`${SUPABASE_URL}/rest/v1/users?id=eq.${response3.data.user.id}`, {
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

    } catch (error3) {
      console.log('❌ Frontend registration FAILED:');
      console.log('   Status:', error3.response?.status);
      console.log('   Error:', error3.response?.data?.error || error3.message);
      console.log('   Full Response:', JSON.stringify(error3.response?.data, null, 2));
    }

    console.log('\n🎉 Frontend Registration Testing Completed!');

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
testFrontendRegistration().catch(console.error); 