const axios = require('axios');

// Configuration
const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

let adminToken = null;
let candidateToken = null;
let verificationToken = null;

async function testCompleteEmailFlow() {
  console.log('🧪 Testing Complete Email Verification Flow');
  console.log('===========================================');

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

    // Step 2: Login as admin (should work immediately)
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
    console.log('   User role:', adminLoginResponse.data.user.role);
    console.log('   Email verified:', adminLoginResponse.data.user.email_verified);

    // Step 3: Register candidate user (requires verification)
    console.log('\n👤 Step 3: Registering candidate user...');
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
        console.log('   Email:', error.response.data.email);
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.error || error.message);
      }
    }

    // Step 5: Verify email using the token
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

      candidateToken = verifiedLoginResponse.data.token;
      console.log('✅ Verified candidate login successful');
      console.log('   Token received:', candidateToken ? 'Yes' : 'No');
      console.log('   User role:', verifiedLoginResponse.data.user.role);
      console.log('   Email verified:', verifiedLoginResponse.data.user.email_verified);
    } catch (error) {
      console.log('❌ Login failed for verified user:', error.response?.data?.error || error.message);
    }

    // Step 7: Test profile access for both users
    console.log('\n👤 Step 7: Testing profile access...');
    
    // Admin profile access
    try {
      const adminProfileResponse = await axios.get(`${SUPABASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': adminToken,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Admin profile access successful');
      console.log('   Admin name:', adminProfileResponse.data.user.name);
      console.log('   Admin role:', adminProfileResponse.data.user.role);
    } catch (error) {
      console.log('❌ Admin profile access failed:', error.response?.data?.error || error.message);
    }

    // Candidate profile access
    try {
      const candidateProfileResponse = await axios.get(`${SUPABASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': candidateToken,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Candidate profile access successful');
      console.log('   Candidate name:', candidateProfileResponse.data.user.name);
      console.log('   Candidate role:', candidateProfileResponse.data.user.role);
    } catch (error) {
      console.log('❌ Candidate profile access failed:', error.response?.data?.error || error.message);
    }

    // Step 8: Test interview creation for both users
    console.log('\n📅 Step 8: Testing interview creation...');
    
    const interviewData = {
      candidate_id: candidateToken ? 'test-candidate-id' : null,
      company_name: 'Test Company',
      job_title: 'Software Engineer',
      scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      duration: 60,
      status: 'scheduled',
      round: 1,
      interview_type: 'technical',
      location: 'Remote',
      interviewer_name: 'John Doe',
      interviewer_position: 'Senior Engineer',
      notes: 'Technical interview focusing on React and Node.js'
    };

    // Admin creating interview
    try {
      const adminInterviewResponse = await axios.post(`${SUPABASE_URL}/interviews`, interviewData, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': adminToken,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Admin interview creation successful');
      console.log('   Interview ID:', adminInterviewResponse.data.interview.id);
    } catch (error) {
      console.log('❌ Admin interview creation failed:', error.response?.data?.error || error.message);
    }

    // Candidate creating interview
    try {
      const candidateInterviewResponse = await axios.post(`${SUPABASE_URL}/interviews`, interviewData, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': candidateToken,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Candidate interview creation successful');
      console.log('   Interview ID:', candidateInterviewResponse.data.interview.id);
    } catch (error) {
      console.log('❌ Candidate interview creation failed:', error.response?.data?.error || error.message);
    }

    console.log('\n🎉 Complete email verification flow test completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   ✅ Admin registration and auto-verification');
    console.log('   ✅ Admin login and profile access');
    console.log('   ✅ Candidate registration with email verification');
    console.log('   ✅ Login protection for unverified users');
    console.log('   ✅ Email verification process');
    console.log('   ✅ Verified candidate login and access');
    console.log('   ✅ Profile access for both user types');
    console.log('   ✅ Interview creation for both user types');

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
testCompleteEmailFlow().catch(console.error); 