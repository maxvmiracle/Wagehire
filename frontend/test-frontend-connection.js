const axios = require('axios');

// Test frontend connection to backend
async function testFrontendConnection() {
  console.log('🧪 Testing Frontend Connection to Backend');
  console.log('==========================================');

  const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

  try {
    // Test 1: Health check
    console.log('\n📋 Test 1: Health Check');
    const healthResponse = await axios.get(`${SUPABASE_URL}/health`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    console.log('✅ Health check successful:', healthResponse.data);

    // Test 2: Register a user
    console.log('\n📋 Test 2: User Registration');
    const registerData = {
      email: `frontend-test-${Date.now()}@example.com`,
      password: 'TestPass123!',
      name: 'Frontend Test User',
      phone: '1234567890',
      current_position: 'Software Engineer',
      experience_years: 3,
      skills: 'JavaScript, React, Node.js'
    };

    const registerResponse = await axios.post(`${SUPABASE_URL}/auth/register`, registerData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    console.log('✅ Registration successful:', registerResponse.data);

    // Test 3: Login
    console.log('\n📋 Test 3: User Login');
    const loginData = {
      email: registerData.email,
      password: registerData.password
    };

    const loginResponse = await axios.post(`${SUPABASE_URL}/auth/login`, loginData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    console.log('✅ Login successful, got token');

    const userToken = loginResponse.data.token;

    // Test 4: Create interview (simulating frontend request)
    console.log('\n📋 Test 4: Interview Creation (Frontend Style)');
    const interviewData = {
      candidate_id: loginResponse.data.user.id,
      company_name: 'Frontend Test Company',
      job_title: 'Frontend Developer',
      scheduled_date: '2025-08-20T21:13:00.000Z',
      duration: 60,
      round: 1,
      status: 'scheduled',
      interview_type: 'technical',
      location: 'Remote',
      notes: 'Frontend test interview',
      company_website: 'https://frontendtest.com',
      company_linkedin_url: 'https://linkedin.com/company/frontendtest',
      other_urls: 'https://frontendtest.com/careers',
      job_description: 'Frontend test job description',
      salary_range: '60000',
      interviewer_name: 'John Doe',
      interviewer_email: 'john.doe@frontendtest.com',
      interviewer_position: 'Senior Engineer',
      interviewer_linkedin_url: 'https://linkedin.com/in/johndoe'
    };

    const interviewResponse = await axios.post(`${SUPABASE_URL}/interviews`, interviewData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      },
      timeout: 20000
    });
    console.log('✅ Interview creation successful:', interviewResponse.data);

    console.log('\n🎉 All frontend connection tests passed!');
    console.log('The backend is accessible and working correctly.');

  } catch (error) {
    console.error('\n❌ Frontend connection test failed:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('Request error - no response received');
      console.error('This might indicate a network connectivity issue');
    } else {
      console.error('Error details:', error);
    }

    console.log('\n🔍 Troubleshooting suggestions:');
    console.log('1. Check if the Supabase Edge Function is deployed');
    console.log('2. Verify the API URL is correct');
    console.log('3. Check network connectivity');
    console.log('4. Verify the Supabase anon key is valid');
  }
}

// Run the test
testFrontendConnection().catch(console.error); 