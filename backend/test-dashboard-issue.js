const axios = require('axios');
const crypto = require('crypto');

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

async function testDashboardIssue() {
  try {
    console.log('🚀 Testing Dashboard Issue - New Interview for Today Not Showing\n');

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
    const userId = registerResponse.data.user.id;

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
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    const currentTime = today.toTimeString().split(' ')[0]; // HH:MM:SS format
    
    console.log('📅 Today\'s date:', todayString);
    console.log('🕐 Current time:', currentTime);
    console.log('📅 Full today timestamp:', today.toISOString());

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

    console.log('✅ Interview created:', interviewResponse.data);
    const interviewId = interviewResponse.data.interview.id;

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

    // Step 5: Get all interviews to verify the interview was created
    console.log('\n📋 Step 5: Getting all interviews to verify...');
    const interviewsResponse = await axios.get(`${SUPABASE_URL}/interviews`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('📋 All interviews:', interviewsResponse.data.interviews);
    
    if (interviewsResponse.data.interviews.length > 0) {
      const interview = interviewsResponse.data.interviews[0];
      console.log('📅 Interview scheduled_date:', interview.scheduled_date);
      console.log('📅 Interview scheduled_date type:', typeof interview.scheduled_date);
      
      // Check if the interview date matches today
      const interviewDate = new Date(interview.scheduled_date);
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
      console.log('📅 Interview date:', interviewDate);
      console.log('📅 Today start:', todayStart);
      console.log('📅 Today end:', todayEnd);
      console.log('📅 Is interview today?', interviewDate >= todayStart && interviewDate < todayEnd);
    }

    // Step 6: Check dashboard again
    console.log('\n📊 Step 6: Final dashboard check...');
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
    console.log('Expected todaysInterviews: 1');
    console.log('Actual todaysInterviews:', finalDashboardResponse.data.stats.todaysInterviews);
    
    if (finalDashboardResponse.data.stats.todaysInterviews === 1) {
      console.log('✅ Dashboard is working correctly!');
    } else {
      console.log('❌ Dashboard issue detected!');
      console.log('The interview was created but todaysInterviews count is incorrect.');
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
  await testDashboardIssue();
}

main(); 