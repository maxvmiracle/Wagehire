const axios = require('axios');

// Configuration
const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function testFrontendDashboard() {
  try {
    console.log('🚀 Testing Frontend Dashboard Data\n');

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

    // Step 2: Create an interview for today
    console.log('\n📅 Step 2: Creating interview for today...');
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const currentTime = today.toTimeString().split(' ')[0];

    await axios.post(`${SUPABASE_URL}/interviews`, {
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

    // Step 3: Test the exact API call the frontend makes
    console.log('\n📊 Step 3: Testing frontend dashboard API call...');
    console.log('API URL:', `${SUPABASE_URL}/users/me/dashboard`);
    console.log('Headers:', {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'X-User-Token': userToken,
      'Content-Type': 'application/json'
    });

    const dashboardResponse = await axios.get(`${SUPABASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('\n📊 Frontend Dashboard Response:');
    console.log('Status:', dashboardResponse.status);
    console.log('Data:', JSON.stringify(dashboardResponse.data, null, 2));

    // Step 4: Check what the frontend should display
    const stats = dashboardResponse.data.stats;
    console.log('\n🎯 Frontend Should Display:');
    console.log('Today\'s Interviews:', stats.todaysInterviews);
    console.log('Upcoming (7 days):', stats.upcomingInterviews);
    console.log('Completed:', stats.completedInterviews);
    console.log('Total Interviews:', stats.totalInterviews);

    if (stats.todaysInterviews > 0) {
      console.log('\n✅ SUCCESS: Today\'s interviews should show:', stats.todaysInterviews);
    } else {
      console.log('\n❌ ISSUE: Today\'s interviews showing 0');
    }

    if (stats.upcomingInterviews >= 0) {
      console.log('✅ SUCCESS: Upcoming interviews showing:', stats.upcomingInterviews);
    } else {
      console.log('❌ ISSUE: Upcoming interviews not working');
    }

    console.log('\n🔍 If frontend is still showing 0, try:');
    console.log('1. Hard refresh the browser (Ctrl+F5)');
    console.log('2. Clear browser cache');
    console.log('3. Check browser console for errors');
    console.log('4. Verify the frontend is deployed with latest changes');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testFrontendDashboard(); 