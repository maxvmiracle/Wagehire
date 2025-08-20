const axios = require('axios');

// Configuration
const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

let adminToken = null;
let verificationToken = null;

async function testEmailConfiguration() {
  console.log('🧪 Testing Email Configuration and Registration');
  console.log('===============================================');

  try {
    // Step 1: Register admin user (first user - auto-verified)
    console.log('\n👑 Step 1: Registering admin user (first user)...');
    const adminData = {
      email: `admin-${Date.now()}@example.com`,
      password: 'AdminPass123!',
      name: 'Admin User',
      phone: '1234567890',
      current_position: 'System Administrator',
      experience_years: 5,
      skills: 'Management, Administration, System Design'
    };

    const adminResponse = await axios.post(`${SUPABASE_URL}/auth/register`, adminData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Admin registration successful');
    console.log('   Message:', adminResponse.data.message);
    console.log('   Is Admin:', adminResponse.data.isAdmin);
    console.log('   Requires Verification:', adminResponse.data.requiresVerification);
    console.log('   Email Verification Sent:', adminResponse.data.emailVerificationSent);

    // Step 2: Login as admin
    console.log('\n🔐 Step 2: Logging in as admin...');
    const adminLoginData = {
      email: adminData.email,
      password: adminData.password
    };

    const adminLoginResponse = await axios.post(`${SUPABASE_URL}/auth/login`, adminLoginData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin login successful');
    console.log('   Token received:', adminToken ? 'Yes' : 'No');

    // Step 3: Register candidate user (second user - requires verification)
    console.log('\n👤 Step 3: Registering candidate user (requires email verification)...');
    const candidateData = {
      email: `candidate-${Date.now()}@example.com`,
      password: 'CandidatePass123!',
      name: 'Test Candidate',
      phone: '9876543210',
      current_position: 'Software Engineer',
      experience_years: 3,
      skills: 'JavaScript, React, Node.js'
    };

    const candidateResponse = await axios.post(`${SUPABASE_URL}/auth/register`, candidateData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Candidate registration successful');
    console.log('   Message:', candidateResponse.data.message);
    console.log('   Is Admin:', candidateResponse.data.isAdmin);
    console.log('   Requires Verification:', candidateResponse.data.requiresVerification);
    console.log('   Email Verification Sent:', candidateResponse.data.emailVerificationSent);
    console.log('   Verification Token:', candidateResponse.data.verificationToken);

    verificationToken = candidateResponse.data.verificationToken;

    // Step 4: Try to login as unverified candidate (should fail)
    console.log('\n🚫 Step 4: Trying to login as unverified candidate...');
    const candidateLoginData = {
      email: candidateData.email,
      password: candidateData.password
    };

    try {
      const candidateLoginResponse = await axios.post(`${SUPABASE_URL}/auth/login`, candidateLoginData, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ Login should have failed but succeeded');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Login correctly failed for unverified user');
        console.log('   Error:', error.response.data.error);
        console.log('   Requires Verification:', error.response.data.requiresVerification);
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.error || error.message);
      }
    }

    // Step 5: Verify email
    console.log('\n✅ Step 5: Verifying email...');
    const verifyData = {
      token: verificationToken
    };

    const verifyResponse = await axios.post(`${SUPABASE_URL}/auth/verify-email`, verifyData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Email verification successful');
    console.log('   Message:', verifyResponse.data.message);
    console.log('   User ID:', verifyResponse.data.user.id);
    console.log('   Email Verified:', verifyResponse.data.user.email_verified);

    // Step 6: Try to login as verified candidate (should succeed)
    console.log('\n🔐 Step 6: Logging in as verified candidate...');
    try {
      const verifiedLoginResponse = await axios.post(`${SUPABASE_URL}/auth/login`, candidateLoginData, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Verified candidate login successful');
      console.log('   Token received:', verifiedLoginResponse.data.token ? 'Yes' : 'No');
      console.log('   User role:', verifiedLoginResponse.data.user.role);
    } catch (error) {
      console.log('❌ Login failed for verified user:', error.response?.data?.error || error.message);
    }

    // Step 7: Test invalid verification token
    console.log('\n🚫 Step 7: Testing invalid verification token...');
    const invalidVerifyData = {
      token: 'invalid-token-123'
    };

    try {
      const invalidVerifyResponse = await axios.post(`${SUPABASE_URL}/auth/verify-email`, invalidVerifyData, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ Invalid token verification should have failed but succeeded');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Invalid token correctly rejected');
        console.log('   Error:', error.response.data.error);
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.error || error.message);
      }
    }

    console.log('\n🎉 Email configuration test completed!');

  } catch (error) {
    console.error('\n❌ Test failed with error:');
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

// Run the test
testEmailConfiguration().catch(console.error); 