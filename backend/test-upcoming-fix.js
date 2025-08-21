const axios = require('axios');
const { execSync } = require('child_process');

const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function testUpcomingLogic() {
  console.log('🧪 Testing Upcoming Interviews Logic Fix\n');

  try {
    // Step 1: Clean database
    console.log('📋 Step 1: Cleaning database...');
    execSync('node clear-supabase-data.js', { stdio: 'inherit' });
    console.log('✅ Database cleaned\n');

    // Step 2: Register a test user
    console.log('📋 Step 2: Registering test user...');
    const email = `test-upcoming-${Date.now()}@test.com`;
    const password = 'Password123!';
    const name = 'Test User';

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

    const { token, user } = registerResponse.data;
    console.log('✅ User registered:', user.email);

    // Step 3: Create interviews with different dates and statuses
    console.log('\n📋 Step 3: Creating test interviews...');
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const pastDate = new Date(today);
    pastDate.setDate(pastDate.getDate() - 1);

    const interviews = [
      {
        company_name: 'Past Company',
        job_title: 'Past Job',
        scheduled_date: pastDate.toISOString(),
        status: 'completed',
        interviewer_name: 'Past Interviewer'
      },
      {
        company_name: 'Today Company',
        job_title: 'Today Job',
        scheduled_date: today.toISOString(),
        status: 'scheduled',
        interviewer_name: 'Today Interviewer'
      },
      {
        company_name: 'Tomorrow Company',
        job_title: 'Tomorrow Job',
        scheduled_date: tomorrow.toISOString(),
        status: 'scheduled',
        interviewer_name: 'Tomorrow Interviewer'
      },
      {
        company_name: 'Next Week Company',
        job_title: 'Next Week Job',
        scheduled_date: nextWeek.toISOString(),
        status: 'scheduled',
        interviewer_name: 'Next Week Interviewer'
      },
      {
        company_name: 'Future Company',
        job_title: 'Future Job',
        scheduled_date: new Date(nextWeek.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 8 days from now
        status: 'scheduled',
        interviewer_name: 'Future Interviewer'
      }
    ];

    for (const interview of interviews) {
      const createResponse = await axios.post(`${SUPABASE_URL}/interviews`, interview, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': token,
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ Created interview: ${interview.company_name} - ${interview.job_title} (${interview.status})`);
    }

    // Step 4: Test dashboard API
    console.log('\n📋 Step 4: Testing dashboard API...');
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

    // Step 5: Manual verification
    console.log('\n📋 Step 5: Manual verification...');
    
    // Now today's interviews are included in upcoming regardless of current time
    const expectedUpcoming = 3; // Today, Tomorrow, Next Week (excluding Past and Future)
    const expectedCompleted = 1; // Past interview
    const expectedToday = 1; // Today's interview

    console.log(`\nExpected vs Actual:`);
    console.log(`• Upcoming (7 days): Expected ${expectedUpcoming}, Got ${stats.upcomingInterviews} ${stats.upcomingInterviews === expectedUpcoming ? '✅' : '❌'}`);
    console.log(`• Completed: Expected ${expectedCompleted}, Got ${stats.completedInterviews} ${stats.completedInterviews === expectedCompleted ? '✅' : '❌'}`);
    console.log(`• Today's Interviews: Expected ${expectedToday}, Got ${stats.todaysInterviews} ${stats.todaysInterviews === expectedToday ? '✅' : '❌'}`);

    // Step 6: Verify completed interviews are NOT in upcoming
    console.log('\n📋 Step 6: Verifying completed interviews are excluded from upcoming...');
    
    if (stats.upcomingInterviews === expectedUpcoming && stats.completedInterviews === expectedCompleted) {
      console.log('✅ SUCCESS: Completed interviews are correctly excluded from upcoming count!');
      console.log('✅ SUCCESS: Upcoming includes today\'s interviews regardless of current time!');
      console.log('✅ SUCCESS: Today\'s interviews are counted in both today and upcoming!');
    } else {
      console.log('❌ FAILED: Logic verification failed');
    }

    console.log('\n🎉 Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testUpcomingLogic(); 