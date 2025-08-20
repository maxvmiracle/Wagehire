const axios = require('axios');

// Configuration
const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

let userToken = null;
let interviewId = null;

async function testUncertainStatusFix() {
  console.log('🧪 Testing Uncertain Status Fix');
  console.log('================================');

  try {
    // Step 1: Register a test user
    console.log('\n📝 Step 1: Registering test user...');
    const registerData = {
      email: `test-uncertain-${Date.now()}@example.com`,
      password: 'TestPass123!',
      name: 'Test Uncertain User',
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

    // Step 3: Create an interview with scheduled status
    console.log('\n📅 Step 3: Creating interview with scheduled status...');
    const createData = {
      candidate_id: loginResponse.data.user.id,
      company_name: 'Uncertain Test Company',
      job_title: 'Uncertain Test Job',
      scheduled_date: '2025-08-20T21:13:00.000Z',
      duration: 60,
      round: 1,
      status: 'scheduled',
      interview_type: 'technical',
      location: 'Remote',
      notes: 'Initial scheduled interview',
      company_website: 'https://uncertaintest.com',
      company_linkedin_url: 'https://linkedin.com/company/uncertaintest',
      other_urls: 'https://uncertaintest.com/careers',
      job_description: 'Test job description',
      salary_range: '50000',
      interviewer_name: 'Test Interviewer',
      interviewer_email: 'test@uncertaintest.com',
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
    console.log('   Initial status:', createResponse.data.interview.status);
    console.log('   Initial scheduled_date:', createResponse.data.interview.scheduled_date);
    console.log('   Initial duration:', createResponse.data.interview.duration);

    // Step 4: Test changing to uncertain status (this was causing the error)
    console.log('\n🔄 Step 4: Testing change to uncertain status...');
    
    try {
      const updateData = {
        status: 'uncertain',
        // This should be filtered out by the backend
        scheduled_time: '15:30',
        // These should be cleared by the backend
        scheduled_date: null,
        duration: null
      };

      console.log('📤 Sending update data:', updateData);

      const updateResponse = await axios.put(`${SUPABASE_URL}/interviews/${interviewId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': userToken,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Uncertain status update successful!');
      console.log('   New status:', updateResponse.data.interview.status);
      console.log('   New scheduled_date:', updateResponse.data.interview.scheduled_date);
      console.log('   New duration:', updateResponse.data.interview.duration);
      console.log('   Status Changed:', updateResponse.data.statusChanged);
      console.log('   Message:', updateResponse.data.message);

      // Verify that fields were cleared correctly
      if (updateResponse.data.interview.scheduled_date === null && 
          updateResponse.data.interview.duration === null) {
        console.log('✅ Fields cleared correctly for uncertain status');
      } else {
        console.log('❌ Fields not cleared correctly');
      }

    } catch (error) {
      console.error('❌ Uncertain status update failed:');
      console.error('   Error:', error.response?.data?.error || error.message);
      console.error('   Status:', error.response?.status);
      console.error('   Details:', error.response?.data?.details);
      console.error('   Code:', error.response?.data?.code);
    }

    // Step 5: Test changing back to scheduled status
    console.log('\n🔄 Step 5: Testing change back to scheduled status...');
    
    try {
      const updateData = {
        status: 'scheduled',
        scheduled_date: '2025-08-25T15:30:00.000Z',
        duration: 90
      };

      console.log('📤 Sending update data:', updateData);

      const updateResponse = await axios.put(`${SUPABASE_URL}/interviews/${interviewId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': userToken,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Scheduled status update successful!');
      console.log('   New status:', updateResponse.data.interview.status);
      console.log('   New scheduled_date:', updateResponse.data.interview.scheduled_date);
      console.log('   New duration:', updateResponse.data.interview.duration);
      console.log('   Status Changed:', updateResponse.data.statusChanged);
      console.log('   Message:', updateResponse.data.message);

    } catch (error) {
      console.error('❌ Scheduled status update failed:');
      console.error('   Error:', error.response?.data?.error || error.message);
    }

    // Step 6: Test with invalid fields (should be filtered out)
    console.log('\n🔍 Step 6: Testing with invalid fields...');
    
    try {
      const updateData = {
        status: 'confirmed',
        scheduled_date: '2025-08-26T16:00:00.000Z',
        duration: 120,
        // These fields don't exist in the database schema
        invalid_field_1: 'should be filtered out',
        invalid_field_2: 'should be filtered out',
        scheduled_time: '16:00' // This was causing the original error
      };

      console.log('📤 Sending update data with invalid fields:', updateData);

      const updateResponse = await axios.put(`${SUPABASE_URL}/interviews/${interviewId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': userToken,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Update with invalid fields successful!');
      console.log('   Status:', updateResponse.data.interview.status);
      console.log('   Message:', updateResponse.data.message);
      console.log('   Invalid fields were filtered out correctly');

    } catch (error) {
      console.error('❌ Update with invalid fields failed:');
      console.error('   Error:', error.response?.data?.error || error.message);
    }

    console.log('\n🎉 Uncertain status fix test completed!');

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
testUncertainStatusFix().catch(console.error); 