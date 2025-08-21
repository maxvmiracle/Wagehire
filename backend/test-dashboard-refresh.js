const axios = require('axios');

// Configuration
const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

// Clean database first
async function cleanDatabase() {
  console.log('🧹 Cleaning database first...');
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = 'https://xzndkdqlsllwyygbniht.supabase.co';
  const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcwNzY4MywiZXhwIjoyMDcxMjgzNjgzfQ.KQJrEg-zPQdgtHikT3wLO0JkQQV1kx8ngyJBAL-zS8k';
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  await supabase.from('interview_feedback').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('interviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('candidates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Database cleaned');
}

async function testDashboardRefresh() {
  try {
    console.log('🚀 Testing Dashboard Refresh Functionality\n');

    // Step 1: Register a candidate
    console.log('📝 Step 1: Registering a candidate...');
    const candidateEmail = `candidate-${Date.now()}@test.com`;
    const registerResponse = await axios.post(`${SUPABASE_URL}/auth/register`, {
      email: candidateEmail,
      password: 'Password123!',
      name: 'Test Candidate',
      phone: '1234567890',
      current_position: 'Software Developer',
      experience_years: '3',
      skills: 'JavaScript, React, Node.js'
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Registration successful:', registerResponse.data.message);
    const userToken = registerResponse.data.token;

    // Step 2: Check initial dashboard (should be empty)
    console.log('\n📊 Step 2: Checking initial dashboard...');
    const initialDashboardResponse = await axios.get(`${SUPABASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Initial dashboard stats:', initialDashboardResponse.data.stats);
    console.log('Expected: todaysInterviews = 0');

    // Step 3: Create an interview for today
    console.log('\n📅 Step 3: Creating interview for today...');
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const currentTime = today.toTimeString().split(' ')[0];

    const interviewResponse = await axios.post(`${SUPABASE_URL}/interviews`, {
      company_name: 'Test Company',
      job_title: 'Software Engineer',
      scheduled_date: todayString,
      scheduled_time: currentTime,
      location: 'Remote',
      notes: 'Test interview for today'
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Interview created successfully');

    // Step 4: Check dashboard after creating interview (simulating user navigating back to dashboard)
    console.log('\n📊 Step 4: Checking dashboard after creating interview...');
    const dashboardResponse = await axios.get(`${SUPABASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Dashboard stats after creating interview:', dashboardResponse.data.stats);
    console.log('Expected: todaysInterviews = 1');

    // Step 5: Create another interview for today
    console.log('\n📅 Step 5: Creating second interview for today...');
    const interview2Response = await axios.post(`${SUPABASE_URL}/interviews`, {
      company_name: 'Another Company',
      job_title: 'Senior Developer',
      scheduled_date: todayString,
      scheduled_time: currentTime,
      location: 'Office',
      notes: 'Second test interview for today'
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Second interview created successfully');

    // Step 6: Check dashboard again (simulating refresh)
    console.log('\n📊 Step 6: Checking dashboard after creating second interview...');
    const dashboard2Response = await axios.get(`${SUPABASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Dashboard stats after second interview:', dashboard2Response.data.stats);
    console.log('Expected: todaysInterviews = 2');

    // Analysis
    console.log('\n🔍 ANALYSIS:');
    console.log('Initial todaysInterviews:', initialDashboardResponse.data.stats.todaysInterviews);
    console.log('After first interview:', dashboardResponse.data.stats.todaysInterviews);
    console.log('After second interview:', dashboard2Response.data.stats.todaysInterviews);
    
    const expectedSequence = [0, 1, 2];
    const actualSequence = [
      initialDashboardResponse.data.stats.todaysInterviews,
      dashboardResponse.data.stats.todaysInterviews,
      dashboard2Response.data.stats.todaysInterviews
    ];
    
    console.log('\nExpected sequence:', expectedSequence);
    console.log('Actual sequence:', actualSequence);
    
    if (JSON.stringify(expectedSequence) === JSON.stringify(actualSequence)) {
      console.log('✅ Dashboard refresh is working correctly!');
      console.log('✅ New interviews are showing up in dashboard stats immediately.');
    } else {
      console.log('❌ Dashboard refresh issue detected!');
      console.log('The dashboard stats are not updating correctly after creating new interviews.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Run the test
async function main() {
  await cleanDatabase();
  await testDashboardRefresh();
}

main(); 