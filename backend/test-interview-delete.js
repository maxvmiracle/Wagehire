const axios = require('axios');

// Configuration
const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

let userToken = null;
let interviewId = null;

async function testInterviewDelete() {
  console.log('🧪 Testing Interview Delete Functionality');
  console.log('==========================================');

  try {
    // Step 1: Register a test user
    console.log('\n📝 Step 1: Registering test user...');
    const registerData = {
      email: `test-delete-${Date.now()}@example.com`,
      password: 'TestPass123!',
      name: 'Test Delete User',
      phone: '1234567890',
      current_position: 'Software Engineer',
      experience_years: 3,
      skills: 'JavaScript, React, Node.js'
    };

    const registerResponse = await axios.post(`${SUPABASE_URL}/auth/register`, registerData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Registration successful');

    // Step 2: Login to get JWT token
    console.log('\n🔐 Step 2: Logging in...');
    const loginData = {
      email: registerData.email,
      password: registerData.password
    };

    const loginResponse = await axios.post(`${SUPABASE_URL}/auth/login`, loginData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    userToken = loginResponse.data.token;
    console.log('✅ Login successful, got token');

    // Step 3: Create an interview to delete
    console.log('\n📅 Step 3: Creating interview to delete...');
    const createData = {
      candidate_id: loginResponse.data.user.id,
      company_name: 'Delete Test Company',
      job_title: 'Delete Test Job',
      scheduled_date: '2025-08-20T21:13:00.000Z',
      duration: 60,
      round: 1,
      status: 'scheduled',
      interview_type: 'technical',
      location: 'Remote',
      notes: 'Interview to be deleted',
      company_website: 'https://deletetest.com',
      company_linkedin_url: 'https://linkedin.com/company/deletetest',
      other_urls: 'https://deletetest.com/careers',
      job_description: 'Test job description',
      salary_range: '50000',
      interviewer_name: 'Test Interviewer',
      interviewer_email: 'test@deletetest.com',
      interviewer_position: 'Test Position',
      interviewer_linkedin_url: 'https://linkedin.com/in/test'
    };

    const createResponse = await axios.post(`${SUPABASE_URL}/interviews`, createData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    interviewId = createResponse.data.interview.id;
    console.log('✅ Interview created with ID:', interviewId);

    // Step 4: Verify interview exists
    console.log('\n🔍 Step 4: Verifying interview exists...');
    try {
      const getResponse = await axios.get(`${SUPABASE_URL}/interviews/${interviewId}`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': userToken,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Interview found:', getResponse.data.interview.company_name);
    } catch (error) {
      console.error('❌ Failed to get interview:', error.response?.data?.error || error.message);
    }

    // Step 5: Test delete interview
    console.log('\n🗑️ Step 5: Testing delete interview...');
    
    try {
      console.log('📤 Sending DELETE request for interview ID:', interviewId);
      
      const deleteResponse = await axios.delete(`${SUPABASE_URL}/interviews/${interviewId}`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': userToken,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Delete interview successful!');
      console.log('   Response:', deleteResponse.data);
      console.log('   Status:', deleteResponse.status);

    } catch (error) {
      console.error('❌ Delete interview failed:');
      console.error('   Error:', error.response?.data?.error || error.message);
      console.error('   Status:', error.response?.status);
      console.error('   Details:', error.response?.data?.details);
      console.error('   Code:', error.response?.data?.code);
      console.error('   Full response:', error.response?.data);
    }

    // Step 6: Verify interview was deleted
    console.log('\n🔍 Step 6: Verifying interview was deleted...');
    try {
      const getResponse = await axios.get(`${SUPABASE_URL}/interviews/${interviewId}`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': userToken,
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ Interview still exists:', getResponse.data.interview.company_name);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Interview successfully deleted (404 Not Found)');
      } else {
        console.error('❌ Unexpected error when checking deleted interview:', error.response?.data?.error || error.message);
      }
    }

    // Step 7: Test delete non-existent interview
    console.log('\n🔍 Step 7: Testing delete non-existent interview...');
    try {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const deleteResponse = await axios.delete(`${SUPABASE_URL}/interviews/${fakeId}`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': userToken,
          'Content-Type': 'application/json'
        }
      });
      console.log('⚠️ Delete non-existent interview succeeded (unexpected):', deleteResponse.data);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Correctly returned 404 for non-existent interview');
      } else {
        console.error('❌ Unexpected error for non-existent interview:', error.response?.data?.error || error.message);
      }
    }

    console.log('\n🎉 Interview delete test completed!');

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
testInterviewDelete().catch(console.error); 