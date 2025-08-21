const axios = require('axios');

const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function testTodayInUpcoming() {
  console.log('🧪 Testing Today in Upcoming Logic\n');

  try {
    // Register a new user
    const email = `test-today-${Date.now()}@test.com`;
    const password = 'Password123!';
    const name = 'Test User';

    console.log('📋 Step 1: Registering test user...');
    const registerResponse = await axios.post(`${SUPABASE_URL}/auth/register`, {
      email,
      password,
      name
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const { token } = registerResponse.data;
    console.log('✅ User registered:', email);

    // Create a today interview
    console.log('\n📋 Step 2: Creating today\'s interview...');
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    const todayInterview = {
      company_name: 'Today Company',
      job_title: 'Today Job',
      scheduled_date: `${todayString}T00:00:00.000Z`, // Today at midnight
      status: 'scheduled',
      interviewer_name: 'Today Interviewer'
    };

    const createResponse = await axios.post(`${SUPABASE_URL}/interviews`, todayInterview, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': token,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Created today\'s interview');

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

    // Verify the logic
    console.log('\n📋 Step 4: Verifying logic...');
    
    const isTodayInUpcoming = stats.upcomingInterviews >= 1;
    const isTodayCounted = stats.todaysInterviews === 1;
    
    console.log(`• Today's interview in upcoming: ${isTodayInUpcoming ? '✅ YES' : '❌ NO'}`);
    console.log(`• Today's interview counted in today: ${isTodayCounted ? '✅ YES' : '❌ NO'}`);
    
    if (isTodayInUpcoming && isTodayCounted) {
      console.log('\n🎉 SUCCESS: Today\'s interviews are correctly included in upcoming!');
    } else {
      console.log('\n❌ FAILED: Today\'s interviews are not correctly included in upcoming');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testTodayInUpcoming(); 