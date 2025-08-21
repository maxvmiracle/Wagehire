const axios = require('axios');

const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function debugUpcoming() {
  console.log('🔍 Debugging Upcoming Interviews Logic\n');

  try {
    // Get the latest user token (assuming we have a user)
    const email = 'test-upcoming-1755790996765@test.com';
    const password = 'Password123!';

    const loginResponse = await axios.post(`${SUPABASE_URL}/auth/login`, {
      email,
      password
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const { token } = loginResponse.data;
    console.log('✅ Logged in successfully');

    // Get all interviews to see what we have
    const interviewsResponse = await axios.get(`${SUPABASE_URL}/interviews`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': token
      }
    });

    const interviews = interviewsResponse.data.interviews;
    console.log(`\n📊 Found ${interviews.length} interviews:`);

    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    console.log(`\n⏰ Current time: ${now.toISOString()}`);
    console.log(`📅 Next week: ${nextWeek.toISOString()}`);

    let upcomingCount = 0;
    let todayCount = 0;
    let completedCount = 0;

    interviews.forEach((interview, index) => {
      const interviewDate = new Date(interview.scheduled_date);
      const isCompleted = interview.status === 'completed';
      const isUpcoming = !isCompleted && interviewDate >= now && interviewDate <= nextWeek;
      const isToday = interviewDate.toISOString().split('T')[0] === now.toISOString().split('T')[0];

      console.log(`\n${index + 1}. ${interview.company_name} - ${interview.job_title}`);
      console.log(`   Date: ${interview.scheduled_date}`);
      console.log(`   Status: ${interview.status}`);
      console.log(`   Is Completed: ${isCompleted}`);
      console.log(`   Is Upcoming: ${isUpcoming}`);
      console.log(`   Is Today: ${isToday}`);

      if (isCompleted) completedCount++;
      if (isUpcoming) upcomingCount++;
      if (isToday) todayCount++;
    });

    console.log(`\n📈 Manual Counts:`);
    console.log(`• Completed: ${completedCount}`);
    console.log(`• Upcoming: ${upcomingCount}`);
    console.log(`• Today: ${todayCount}`);

    // Now test the API
    const dashboardResponse = await axios.get(`${SUPABASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': token
      }
    });

    const stats = dashboardResponse.data.stats;
    console.log(`\n📊 API Response:`);
    console.log(`• Total Interviews: ${stats.totalInterviews}`);
    console.log(`• Today's Interviews: ${stats.todaysInterviews}`);
    console.log(`• Upcoming (7 days): ${stats.upcomingInterviews}`);
    console.log(`• Completed: ${stats.completedInterviews}`);

    console.log(`\n🔍 Comparison:`);
    console.log(`• Manual vs API - Completed: ${completedCount} vs ${stats.completedInterviews} ${completedCount === stats.completedInterviews ? '✅' : '❌'}`);
    console.log(`• Manual vs API - Upcoming: ${upcomingCount} vs ${stats.upcomingInterviews} ${upcomingCount === stats.upcomingInterviews ? '✅' : '❌'}`);
    console.log(`• Manual vs API - Today: ${todayCount} vs ${stats.todaysInterviews} ${todayCount === stats.todaysInterviews ? '✅' : '❌'}`);

  } catch (error) {
    console.error('❌ Debug failed:', error.response?.data || error.message);
  }
}

debugUpcoming(); 