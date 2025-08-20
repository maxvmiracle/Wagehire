const axios = require('axios');

// Configuration
const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

let userToken = null;

async function testInterviewCreation() {
  console.log('🧪 Testing Interview Creation with Debug Logging');
  console.log('================================================');

  try {
    // Step 1: Register a test user
    console.log('\n📝 Step 1: Registering test user...');
    const registerData = {
      email: `test-interview-${Date.now()}@example.com`,
      password: 'TestPass123!',
      name: 'Test Interview User',
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

    console.log('✅ Registration successful:', registerResponse.data);

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

    // Step 3: Test interview creation
    console.log('\n📅 Step 3: Creating interview...');
    const interviewData = {
      candidate_id: loginResponse.data.user.id,
      company_name: 'Test Company',
      job_title: 'Software Engineer',
      scheduled_date: '2025-08-20T21:13:00.000Z',
      duration: 60,
      round: 1,
      status: 'scheduled',
      interview_type: 'technical',
      location: 'Remote',
      notes: 'Test interview',
      company_website: 'https://testcompany.com',
      company_linkedin_url: 'https://linkedin.com/company/test',
      other_urls: 'https://testcompany.com/careers',
      job_description: 'Test job description',
      salary_range: '60000',
      interviewer_name: 'John Doe',
      interviewer_email: 'john.doe@testcompany.com',
      interviewer_position: 'Senior Engineer',
      interviewer_linkedin_url: 'https://linkedin.com/in/johndoe'
    };

    console.log('📤 Sending interview data:', JSON.stringify(interviewData, null, 2));

    const interviewResponse = await axios.post(`${SUPABASE_URL}/interviews`, interviewData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });

    console.log('✅ Interview creation successful:', interviewResponse.data);

    // Step 4: Verify interview was created
    console.log('\n🔍 Step 4: Verifying interview creation...');
    const getInterviewsResponse = await axios.get(`${SUPABASE_URL}/interviews`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken
      }
    });

    console.log('✅ Interviews retrieved:', getInterviewsResponse.data);

    console.log('\n🎉 All tests passed! Interview creation is working correctly.');

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request error - no response received');
      console.error('Request details:', error.request);
    } else {
      console.error('Error details:', error);
    }

    // Additional debugging
    console.log('\n🔍 Additional Debug Info:');
    console.log('SUPABASE_URL:', SUPABASE_URL);
    console.log('User token exists:', !!userToken);
    console.log('User token length:', userToken ? userToken.length : 0);
  }
}

// Run the test
testInterviewCreation().catch(console.error); 