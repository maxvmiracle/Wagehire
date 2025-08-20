const axios = require('axios');

// Configuration
const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

let userToken = null;
let interviewId = null;

async function testInterviewUpdate() {
  console.log('🧪 Testing Interview Update Functionality');
  console.log('==========================================');

  try {
    // Step 1: Register a test user
    console.log('\n📝 Step 1: Registering test user...');
    const registerData = {
      email: `test-update-${Date.now()}@example.com`,
      password: 'TestPass123!',
      name: 'Test Update User',
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

    // Step 3: Create an interview to update
    console.log('\n📅 Step 3: Creating interview to update...');
    const createData = {
      candidate_id: loginResponse.data.user.id,
      company_name: 'Original Company',
      job_title: 'Original Job Title',
      scheduled_date: '2025-08-20T21:13:00.000Z',
      duration: 60,
      round: 1,
      status: 'scheduled',
      interview_type: 'technical',
      location: 'Remote',
      notes: 'Original notes',
      company_website: 'https://original.com',
      company_linkedin_url: 'https://linkedin.com/company/original',
      other_urls: 'https://original.com/careers',
      job_description: 'Original job description',
      salary_range: '50000',
      interviewer_name: 'Original Interviewer',
      interviewer_email: 'original@company.com',
      interviewer_position: 'Original Position',
      interviewer_linkedin_url: 'https://linkedin.com/in/original'
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

    // Step 4: Get the interview to verify it exists
    console.log('\n🔍 Step 4: Getting interview details...');
    const getResponse = await axios.get(`${SUPABASE_URL}/interviews/${interviewId}`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken
      }
    });

    console.log('✅ Interview retrieved:', getResponse.data.interview.company_name);

    // Step 5: Update the interview
    console.log('\n✏️ Step 5: Updating interview...');
    const updateData = {
      company_name: 'Updated Company Name',
      job_title: 'Updated Job Title',
      scheduled_date: '2025-08-25T15:30:00.000Z',
      duration: 90,
      round: 2,
      status: 'confirmed',
      interview_type: 'behavioral',
      location: 'On-site',
      notes: 'Updated interview notes with more details',
      company_website: 'https://updated.com',
      company_linkedin_url: 'https://linkedin.com/company/updated',
      other_urls: 'https://updated.com/careers',
      job_description: 'Updated job description with more requirements',
      salary_range: '75000',
      interviewer_name: 'Updated Interviewer',
      interviewer_email: 'updated@company.com',
      interviewer_position: 'Senior Manager',
      interviewer_linkedin_url: 'https://linkedin.com/in/updated'
    };

    console.log('📤 Sending update data:', JSON.stringify(updateData, null, 2));

    const updateResponse = await axios.put(`${SUPABASE_URL}/interviews/${interviewId}`, updateData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('✅ Interview update successful:', updateResponse.data);

    // Step 6: Verify the update
    console.log('\n🔍 Step 6: Verifying update...');
    const verifyResponse = await axios.get(`${SUPABASE_URL}/interviews/${interviewId}`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken
      }
    });

    const updatedInterview = verifyResponse.data.interview;
    console.log('✅ Updated interview details:');
    console.log('   Company:', updatedInterview.company_name);
    console.log('   Job Title:', updatedInterview.job_title);
    console.log('   Status:', updatedInterview.status);
    console.log('   Duration:', updatedInterview.duration);
    console.log('   Round:', updatedInterview.round);

    // Verify key changes
    const changes = [
      { field: 'company_name', expected: 'Updated Company Name', actual: updatedInterview.company_name },
      { field: 'job_title', expected: 'Updated Job Title', actual: updatedInterview.job_title },
      { field: 'status', expected: 'confirmed', actual: updatedInterview.status },
      { field: 'duration', expected: 90, actual: updatedInterview.duration },
      { field: 'round', expected: 2, actual: updatedInterview.round }
    ];

    let allChangesCorrect = true;
    changes.forEach(change => {
      if (change.actual !== change.expected) {
        console.log(`❌ ${change.field}: expected "${change.expected}", got "${change.actual}"`);
        allChangesCorrect = false;
      } else {
        console.log(`✅ ${change.field}: correctly updated to "${change.actual}"`);
      }
    });

    if (allChangesCorrect) {
      console.log('\n🎉 All interview update tests passed!');
    } else {
      console.log('\n❌ Some updates did not work correctly');
    }

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
    console.log('Interview ID:', interviewId);
  }
}

// Run the test
testInterviewUpdate().catch(console.error); 