const axios = require('axios');

// Configuration
const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function debugDashboard() {
  try {
    console.log('🔍 Debugging Dashboard Issue\n');

    // Step 1: Register a candidate
    console.log('📝 Step 1: Registering a candidate...');
    const candidateEmail = `debug-${Date.now()}@test.com`;
    const registerResponse = await axios.post(`${SUPABASE_URL}/auth/register`, {
      email: candidateEmail,
      password: 'Password123!',
      name: 'Debug User',
      phone: '1234567890',
      current_position: 'Developer',
      experience_years: '2',
      skills: 'JavaScript'
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Registration successful');
    const userToken = registerResponse.data.token;

    // Step 2: Create a completed interview for today
    console.log('\n📅 Step 2: Creating completed interview for today...');
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const currentTime = today.toTimeString().split(' ')[0];

    const interviewResponse = await axios.post(`${SUPABASE_URL}/interviews`, {
      company_name: 'Pinnacle Tek LLC',
      job_title: 'Full Stack Developer',
      scheduled_date: todayString,
      scheduled_time: currentTime,
      status: 'completed', // Mark as completed
      location: 'Remote',
      notes: 'Debug interview for today - completed'
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Interview created successfully');
    console.log('📅 Interview data:', interviewResponse.data.interview);

    // Step 3: Get all interviews to see the raw data
    console.log('\n📋 Step 3: Getting all interviews...');
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
      console.log('\n🔍 Interview Details:');
      console.log('ID:', interview.id);
      console.log('Status:', interview.status);
      console.log('Scheduled Date:', interview.scheduled_date);
      console.log('Company:', interview.company_name);
      console.log('Job Title:', interview.job_title);
      
      // Check date calculations
      const interviewDate = new Date(interview.scheduled_date);
      const interviewDateString = interviewDate.toISOString().split('T')[0];
      const todayStringCheck = today.toISOString().split('T')[0];
      
      console.log('\n📅 Date Analysis:');
      console.log('Interview date string:', interviewDateString);
      console.log('Today string:', todayStringCheck);
      console.log('Is interview today?', interviewDateString === todayStringCheck);
      console.log('Is interview completed?', interview.status === 'completed');
    }

    // Step 4: Check dashboard
    console.log('\n📊 Step 4: Checking dashboard...');
    const dashboardResponse = await axios.get(`${SUPABASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': userToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Dashboard stats:', dashboardResponse.data.stats);

    // Step 5: Manual calculation to verify
    console.log('\n🧮 Step 5: Manual calculation...');
    const interviews = interviewsResponse.data.interviews;
    const totalInterviews = interviews.length;
    const completedInterviews = interviews.filter(i => i.status === 'completed').length;
    
    const todayForCalc = new Date();
    const todayStringForCalc = todayForCalc.toISOString().split('T')[0];
    
    const todaysInterviews = interviews.filter(i => {
      if (!i.scheduled_date) return false;
      const interviewDate = new Date(i.scheduled_date);
      const interviewDateString = interviewDate.toISOString().split('T')[0];
      return interviewDateString === todayStringForCalc;
    }).length;

    const tomorrow = new Date(todayForCalc);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(todayForCalc);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingInterviews = interviews.filter(i => {
      if (!i.scheduled_date) return false;
      const interviewDate = new Date(i.scheduled_date);
      const interviewDateString = interviewDate.toISOString().split('T')[0];
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      const nextWeekString = nextWeek.toISOString().split('T')[0];
      return interviewDateString >= tomorrowString && interviewDateString <= nextWeekString;
    }).length;

    console.log('🧮 Manual calculation results:');
    console.log('Total interviews:', totalInterviews);
    console.log('Completed interviews:', completedInterviews);
    console.log('Today\'s interviews:', todaysInterviews);
    console.log('Upcoming interviews:', upcomingInterviews);

    // Step 6: Compare with API results
    const apiStats = dashboardResponse.data.stats;
    console.log('\n🔍 Comparison:');
    console.log('API Total:', apiStats.totalInterviews, 'Manual Total:', totalInterviews);
    console.log('API Completed:', apiStats.completedInterviews, 'Manual Completed:', completedInterviews);
    console.log('API Today:', apiStats.todaysInterviews, 'Manual Today:', todaysInterviews);
    console.log('API Upcoming:', apiStats.upcomingInterviews, 'Manual Upcoming:', upcomingInterviews);

    // Check for discrepancies
    if (apiStats.totalInterviews !== totalInterviews) {
      console.log('❌ Total interviews mismatch!');
    }
    if (apiStats.completedInterviews !== completedInterviews) {
      console.log('❌ Completed interviews mismatch!');
    }
    if (apiStats.todaysInterviews !== todaysInterviews) {
      console.log('❌ Today\'s interviews mismatch!');
    }
    if (apiStats.upcomingInterviews !== upcomingInterviews) {
      console.log('❌ Upcoming interviews mismatch!');
    }

    if (apiStats.totalInterviews === totalInterviews && 
        apiStats.completedInterviews === completedInterviews && 
        apiStats.todaysInterviews === todaysInterviews && 
        apiStats.upcomingInterviews === upcomingInterviews) {
      console.log('✅ All calculations match!');
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

debugDashboard(); 