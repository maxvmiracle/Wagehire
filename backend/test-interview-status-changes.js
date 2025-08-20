const axios = require('axios');

// Configuration
const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

let userToken = null;
let interviewId = null;

async function testInterviewStatusChanges() {
  console.log('🧪 Testing Interview Status Changes and Edge Cases');
  console.log('==================================================');

  try {
    // Step 1: Register a test user
    console.log('\n📝 Step 1: Registering test user...');
    const registerData = {
      email: `test-status-${Date.now()}@example.com`,
      password: 'TestPass123!',
      name: 'Test Status User',
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

    // Step 3: Create an interview to test with
    console.log('\n📅 Step 3: Creating test interview...');
    const createData = {
      candidate_id: loginResponse.data.user.id,
      company_name: 'Status Test Company',
      job_title: 'Status Test Job',
      scheduled_date: '2025-08-20T21:13:00.000Z',
      duration: 60,
      round: 1,
      status: 'scheduled',
      interview_type: 'technical',
      location: 'Remote',
      notes: 'Initial test interview',
      company_website: 'https://statustest.com',
      company_linkedin_url: 'https://linkedin.com/company/statustest',
      other_urls: 'https://statustest.com/careers',
      job_description: 'Test job description',
      salary_range: '50000',
      interviewer_name: 'Test Interviewer',
      interviewer_email: 'test@statustest.com',
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

    // Step 4: Test Status Changes
    console.log('\n🔄 Step 4: Testing Status Changes...');

    const statusTests = [
      {
        name: 'Change to Confirmed',
        status: 'confirmed',
        expectedFields: ['scheduled_date', 'duration'],
        shouldSucceed: true
      },
      {
        name: 'Change to Completed',
        status: 'completed',
        expectedFields: ['scheduled_date'],
        shouldSucceed: true
      },
      {
        name: 'Change to Cancelled',
        status: 'cancelled',
        expectedFields: [],
        shouldSucceed: true
      },
      {
        name: 'Change to Uncertain (should clear date/duration)',
        status: 'uncertain',
        expectedFields: [],
        shouldSucceed: true
      },
      {
        name: 'Change back to Scheduled',
        status: 'scheduled',
        expectedFields: ['scheduled_date', 'duration'],
        shouldSucceed: true
      }
    ];

    for (const test of statusTests) {
      console.log(`\n📋 Testing: ${test.name}`);
      
      try {
        const updateData = {
          status: test.status,
          scheduled_date: test.status === 'uncertain' ? null : '2025-08-25T15:30:00.000Z',
          duration: test.status === 'uncertain' ? null : 90
        };

        const updateResponse = await axios.put(`${SUPABASE_URL}/interviews/${interviewId}`, updateData, {
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'X-User-Token': userToken,
            'Content-Type': 'application/json'
          }
        });

        console.log(`✅ ${test.name} - Success`);
        console.log(`   Status: ${updateResponse.data.interview.status}`);
        console.log(`   Scheduled Date: ${updateResponse.data.interview.scheduled_date}`);
        console.log(`   Duration: ${updateResponse.data.interview.duration}`);
        console.log(`   Status Changed: ${updateResponse.data.statusChanged}`);
        console.log(`   Message: ${updateResponse.data.message}`);

        // Verify expected behavior
        if (test.status === 'uncertain') {
          if (updateResponse.data.interview.scheduled_date !== null || updateResponse.data.interview.duration !== null) {
            console.log(`❌ ${test.name} - Expected null values for uncertain status`);
          }
        }

      } catch (error) {
        if (test.shouldSucceed) {
          console.log(`❌ ${test.name} - Failed unexpectedly:`, error.response?.data?.error || error.message);
        } else {
          console.log(`✅ ${test.name} - Failed as expected:`, error.response?.data?.error);
        }
      }
    }

    // Step 5: Test Edge Cases
    console.log('\n🔍 Step 5: Testing Edge Cases...');

    const edgeCases = [
      {
        name: 'Invalid Status',
        data: { status: 'invalid_status' },
        shouldSucceed: false,
        expectedError: 'Invalid status'
      },
      {
        name: 'Missing Company Name',
        data: { company_name: '' },
        shouldSucceed: false,
        expectedError: 'Company name is required'
      },
      {
        name: 'Missing Job Title',
        data: { job_title: '' },
        shouldSucceed: false,
        expectedError: 'Job title is required'
      },
      {
        name: 'Invalid Duration (too short)',
        data: { duration: 10 },
        shouldSucceed: false,
        expectedError: 'Duration must be between 15 and 480 minutes'
      },
      {
        name: 'Invalid Duration (too long)',
        data: { duration: 500 },
        shouldSucceed: false,
        expectedError: 'Duration must be between 15 and 480 minutes'
      },
      {
        name: 'Invalid Round (too low)',
        data: { round: 0 },
        shouldSucceed: false,
        expectedError: 'Round must be between 1 and 10'
      },
      {
        name: 'Invalid Round (too high)',
        data: { round: 11 },
        shouldSucceed: false,
        expectedError: 'Round must be between 1 and 10'
      },
      {
        name: 'Invalid URL',
        data: { company_website: 'not-a-url' },
        shouldSucceed: false,
        expectedError: 'Invalid URL format'
      },
      {
        name: 'Invalid Email',
        data: { interviewer_email: 'not-an-email' },
        shouldSucceed: false,
        expectedError: 'Invalid interviewer email format'
      },
      {
        name: 'Notes Too Long',
        data: { notes: 'a'.repeat(1001) },
        shouldSucceed: false,
        expectedError: 'Notes must be less than 1000 characters'
      }
    ];

    for (const test of edgeCases) {
      console.log(`\n📋 Testing: ${test.name}`);
      
      try {
        const updateResponse = await axios.put(`${SUPABASE_URL}/interviews/${interviewId}`, test.data, {
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'X-User-Token': userToken,
            'Content-Type': 'application/json'
          }
        });

        if (test.shouldSucceed) {
          console.log(`✅ ${test.name} - Success`);
        } else {
          console.log(`❌ ${test.name} - Should have failed but succeeded`);
        }

      } catch (error) {
        if (test.shouldSucceed) {
          console.log(`❌ ${test.name} - Failed unexpectedly:`, error.response?.data?.error || error.message);
        } else {
          const errorMessage = error.response?.data?.error || error.message;
          if (errorMessage.includes(test.expectedError)) {
            console.log(`✅ ${test.name} - Failed as expected:`, errorMessage);
          } else {
            console.log(`⚠️ ${test.name} - Failed with different error:`, errorMessage);
          }
        }
      }
    }

    // Step 6: Test Valid Updates
    console.log('\n✅ Step 6: Testing Valid Updates...');

    const validUpdates = [
      {
        name: 'Update Company Name',
        data: { company_name: 'Updated Company Name' }
      },
      {
        name: 'Update Job Title',
        data: { job_title: 'Updated Job Title' }
      },
      {
        name: 'Update Location',
        data: { location: 'On-site' }
      },
      {
        name: 'Update Notes',
        data: { notes: 'Updated notes with more details' }
      },
      {
        name: 'Update Salary Range',
        data: { salary_range: '$80k - $120k' }
      },
      {
        name: 'Update Interviewer Info',
        data: {
          interviewer_name: 'Updated Interviewer',
          interviewer_email: 'updated@company.com',
          interviewer_position: 'Senior Manager'
        }
      }
    ];

    for (const test of validUpdates) {
      console.log(`\n📋 Testing: ${test.name}`);
      
      try {
        const updateResponse = await axios.put(`${SUPABASE_URL}/interviews/${interviewId}`, test.data, {
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'X-User-Token': userToken,
            'Content-Type': 'application/json'
          }
        });

        console.log(`✅ ${test.name} - Success`);
        console.log(`   Message: ${updateResponse.data.message}`);

      } catch (error) {
        console.log(`❌ ${test.name} - Failed:`, error.response?.data?.error || error.message);
      }
    }

    console.log('\n🎉 All interview status change tests completed!');

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
testInterviewStatusChanges().catch(console.error); 