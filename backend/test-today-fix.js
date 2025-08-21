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

async function testTodayFix() {
  try {
    console.log('🚀 Testing Today\'s Interviews Fix\n');

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

    console.log('✅ Registration successful');
    const userToken = registerResponse.data.token;

    // Step 2: Check initial dashboard
    console.log('\n📊 Step 2: Checking initial dashboard...');
    const initialDashboardResponse = await axios.get(`${SUPABASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Initial dashboard stats:', initialDashboardResponse.data.stats);

    // Step 3: Create an interview for today (Aug 21)
    console.log('\n📅 Step 3: Creating interview for today (Aug 21)...');
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    const currentTime = today.toTimeString().split(' ')[0]; // HH:MM:SS format
    
    console.log('📅 Today\'s date:', todayString);
    console.log('🕐 Current time:', currentTime);
    console.log('📅 Full today timestamp:', today.toISOString());

    const interviewResponse = await axios.post(`${SUPABASE_URL}/interviews`, {
      company_name: 'Linkerus',
      job_title: 'Senior Software Engineer',
      scheduled_date: todayString,
      scheduled_time: currentTime,
      location: 'Remote',
      notes: 'Test interview for today (Aug 21)'
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Interview created successfully');
    console.log('📅 Interview scheduled_date:', interviewResponse.data.interview.scheduled_date);

    // Step 4: Check dashboard after creating interview
    console.log('\n📊 Step 4: Checking dashboard after creating interview...');
    const dashboardResponse = await axios.get(`${SUPABASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Dashboard stats after creating interview:', dashboardResponse.data.stats);

    // Step 5: Get all interviews to verify the data
    console.log('\n📋 Step 5: Getting all interviews to verify...');
    const interviewsResponse = await axios.get(`${SUPABASE_URL}/interviews`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    if (interviewsResponse.data.interviews.length > 0) {
      const interview = interviewsResponse.data.interviews[0];
      console.log('📅 Interview scheduled_date:', interview.scheduled_date);
      console.log('📅 Interview scheduled_date type:', typeof interview.scheduled_date);
      
      // Check if the interview date matches today
      const interviewDate = new Date(interview.scheduled_date);
      const interviewDateString = interviewDate.toISOString().split('T')[0];
      const todayStringCheck = today.toISOString().split('T')[0];
      
      console.log('📅 Interview date string:', interviewDateString);
      console.log('📅 Today string:', todayStringCheck);
      console.log('📅 Is interview today?', interviewDateString === todayStringCheck);
    }

    // Analysis
    console.log('\n🔍 ANALYSIS:');
    const stats = dashboardResponse.data.stats;
    console.log('Expected totalInterviews: 1');
    console.log('Expected todaysInterviews: 1');
    console.log('Expected upcomingInterviews: 0');
    console.log('Expected completedInterviews: 0');
    
    console.log('\nActual results:');
    console.log('totalInterviews:', stats.totalInterviews);
    console.log('todaysInterviews:', stats.todaysInterviews);
    console.log('upcomingInterviews:', stats.upcomingInterviews);
    console.log('completedInterviews:', stats.completedInterviews);
    
    // Verify the fix
    const isCorrect = 
      stats.totalInterviews === 1 &&
      stats.todaysInterviews === 1 &&
      stats.upcomingInterviews === 0 &&
      stats.completedInterviews === 0;
    
    if (isCorrect) {
      console.log('\n✅ Today\'s interviews fix is working correctly!');
      console.log('✅ Interview scheduled for today is showing in "Today\'s Interviews"');
      console.log('✅ Upcoming (7 days) correctly shows 0 since it\'s today');
    } else {
      console.log('\n❌ Today\'s interviews fix issue detected!');
      if (stats.todaysInterviews !== 1) {
        console.log('❌ Today\'s interviews should be 1 but is:', stats.todaysInterviews);
      }
      if (stats.upcomingInterviews !== 0) {
        console.log('❌ Upcoming interviews should be 0 but is:', stats.upcomingInterviews);
      }
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
  await testTodayFix();
}

main(); 