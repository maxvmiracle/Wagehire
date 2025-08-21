const axios = require('axios');

const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function testCurrentDeployment() {
  console.log('🔍 Testing Current Deployed Version\n');

  try {
    // Login with existing user
    const email = 'test-today-1755792350787@test.com';
    const password = 'Password123!';

    console.log('📋 Step 1: Logging in...');
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
    console.log('\n📋 Step 2: Getting all interviews...');
    const interviewsResponse = await axios.get(`${SUPABASE_URL}/interviews`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': token
      }
    });

    const interviews = interviewsResponse.data.interviews;
    console.log(`📊 Found ${interviews.length} interviews:`);

    interviews.forEach((interview, index) => {
      console.log(`${index + 1}. ${interview.company_name} - ${interview.job_title}`);
      console.log(`   Date: ${interview.scheduled_date}`);
      console.log(`   Status: ${interview.status}`);
    });

    // Test dashboard
    console.log('\n📋 Step 3: Testing dashboard...');
    const dashboardResponse = await axios.get(`${SUPABASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': token
      }
    });

    const stats = dashboardResponse.data.stats;
    console.log('\n📊 Dashboard Stats:');
    console.log(`• Total Interviews: ${stats.totalInterviews}`);
    console.log(`• Today's Interviews: ${stats.todaysInterviews}`);
    console.log(`• Upcoming (7 days): ${stats.upcomingInterviews}`);
    console.log(`• Completed: ${stats.completedInterviews}`);

    // Manual calculation
    console.log('\n📋 Step 4: Manual calculation...');
    const now = new Date();
    const todayString = now.toISOString().split('T')[0];
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    console.log(`⏰ Current time: ${now.toISOString()}`);
    console.log(`📅 Today: ${todayString}`);
    console.log(`📅 Next week: ${nextWeek.toISOString()}`);

    let manualUpcoming = 0;
    let manualToday = 0;
    let manualCompleted = 0;

    interviews.forEach((interview) => {
      const interviewDate = new Date(interview.scheduled_date);
      const interviewDateString = interviewDate.toISOString().split('T')[0];
      const isCompleted = interview.status === 'completed';
      const isToday = interviewDateString === todayString;
      const isUpcoming = !isCompleted && interviewDateString >= todayString && interviewDate <= nextWeek;

      if (isCompleted) manualCompleted++;
      if (isToday) manualToday++;
      if (isUpcoming) manualUpcoming++;

      console.log(`\n${interview.company_name}:`);
      console.log(`  Date: ${interviewDateString}`);
      console.log(`  Status: ${interview.status}`);
      console.log(`  Is Today: ${isToday}`);
      console.log(`  Is Upcoming: ${isUpcoming}`);
      console.log(`  Is Completed: ${isCompleted}`);
    });

    console.log(`\n📈 Manual Counts:`);
    console.log(`• Today: ${manualToday}`);
    console.log(`• Upcoming: ${manualUpcoming}`);
    console.log(`• Completed: ${manualCompleted}`);

    console.log(`\n🔍 Comparison:`);
    console.log(`• Today - Manual vs API: ${manualToday} vs ${stats.todaysInterviews} ${manualToday === stats.todaysInterviews ? '✅' : '❌'}`);
    console.log(`• Upcoming - Manual vs API: ${manualUpcoming} vs ${stats.upcomingInterviews} ${manualUpcoming === stats.upcomingInterviews ? '✅' : '❌'}`);
    console.log(`• Completed - Manual vs API: ${manualCompleted} vs ${stats.completedInterviews} ${manualCompleted === stats.completedInterviews ? '✅' : '❌'}`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testCurrentDeployment(); 