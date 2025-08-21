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

async function testDashboardUpcomingFix() {
  try {
    console.log('🚀 Testing Dashboard Upcoming (7 days) Fix\n');

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

    // Step 3: Create an interview for today
    console.log('\n📅 Step 3: Creating interview for today...');
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const currentTime = today.toTimeString().split(' ')[0];

    const todayInterviewResponse = await axios.post(`${SUPABASE_URL}/interviews`, {
      company_name: 'Today Company',
      job_title: 'Today Job',
      scheduled_date: todayString,
      scheduled_time: currentTime,
      location: 'Remote',
      notes: 'Interview for today'
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Today interview created successfully');

    // Step 4: Create an interview for tomorrow (within 7 days)
    console.log('\n📅 Step 4: Creating interview for tomorrow...');
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    const tomorrowInterviewResponse = await axios.post(`${SUPABASE_URL}/interviews`, {
      company_name: 'Tomorrow Company',
      job_title: 'Tomorrow Job',
      scheduled_date: tomorrowString,
      scheduled_time: currentTime,
      location: 'Office',
      notes: 'Interview for tomorrow'
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Tomorrow interview created successfully');

    // Step 5: Create an interview for next week (within 7 days)
    console.log('\n📅 Step 5: Creating interview for next week...');
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 5); // 5 days from now
    const nextWeekString = nextWeek.toISOString().split('T')[0];

    const nextWeekInterviewResponse = await axios.post(`${SUPABASE_URL}/interviews`, {
      company_name: 'Next Week Company',
      job_title: 'Next Week Job',
      scheduled_date: nextWeekString,
      scheduled_time: currentTime,
      location: 'Hybrid',
      notes: 'Interview for next week'
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Next week interview created successfully');

    // Step 6: Check dashboard after creating all interviews
    console.log('\n📊 Step 6: Checking dashboard after creating all interviews...');
    const finalDashboardResponse = await axios.get(`${SUPABASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Final dashboard stats:', finalDashboardResponse.data.stats);

    // Analysis
    console.log('\n🔍 ANALYSIS:');
    console.log('Expected totalInterviews: 3');
    console.log('Expected todaysInterviews: 1');
    console.log('Expected upcomingInterviews: 2 (tomorrow + next week)');
    console.log('Expected completedInterviews: 0');
    
    const stats = finalDashboardResponse.data.stats;
    console.log('\nActual results:');
    console.log('totalInterviews:', stats.totalInterviews);
    console.log('todaysInterviews:', stats.todaysInterviews);
    console.log('upcomingInterviews:', stats.upcomingInterviews);
    console.log('completedInterviews:', stats.completedInterviews);
    
    // Verify the fix
    const isCorrect = 
      stats.totalInterviews === 3 &&
      stats.todaysInterviews === 1 &&
      stats.upcomingInterviews === 2 &&
      stats.completedInterviews === 0;
    
    if (isCorrect) {
      console.log('\n✅ Dashboard upcoming (7 days) fix is working correctly!');
      console.log('✅ Today\'s interviews: Shows interviews scheduled for today');
      console.log('✅ Upcoming (7 days): Shows interviews scheduled for next 7 days (excluding today)');
    } else {
      console.log('\n❌ Dashboard fix issue detected!');
      console.log('The upcoming (7 days) calculation is not working correctly.');
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
  await testDashboardUpcomingFix();
}

main(); 