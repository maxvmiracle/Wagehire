const axios = require('axios');

const API_BASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function testDashboardUpdateSync() {
  console.log('🧪 Testing Dashboard Update Synchronization\n');

  try {
    // Step 1: Register a candidate
    console.log('📝 Step 1: Registering a candidate...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: 'Test Candidate',
      email: `candidate-${Date.now()}@test.com`,
      password: 'Password123!',
      role: 'candidate'
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (registerResponse.data.error) {
      throw new Error(`Registration failed: ${registerResponse.data.error}`);
    }

    console.log('✅ Registration response:', JSON.stringify(registerResponse.data, null, 2));
    
    const { token, user } = registerResponse.data;
    console.log('✅ Candidate registered successfully');
    console.log(`   User ID: ${user.id}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Token: ${token ? 'Present' : 'Missing'}`);

    // Step 2: Check initial dashboard stats
    console.log('\n📊 Step 2: Checking initial dashboard stats...');
    const initialDashboardResponse = await axios.get(`${API_BASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': token,
        'Content-Type': 'application/json'
      }
    });

    const initialStats = initialDashboardResponse.data.stats;
    console.log('📈 Initial Dashboard Stats:');
    console.log(`   Total Interviews: ${initialStats.totalInterviews}`);
    console.log(`   Completed: ${initialStats.completedInterviews}`);
    console.log(`   Upcoming: ${initialStats.upcomingInterviews}`);
    console.log(`   Today's: ${initialStats.todaysInterviews}`);

    // Step 3: Create an interview for tomorrow
    console.log('\n📅 Step 3: Creating an interview for tomorrow...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    const tomorrowTime = '14:00';

    const createInterviewResponse = await axios.post(`${API_BASE_URL}/interviews`, {
      company_name: 'Test Company',
      job_title: 'Software Engineer',
      scheduled_date: tomorrowDate,
      scheduled_time: tomorrowTime,
      status: 'scheduled'
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': token,
        'Content-Type': 'application/json'
      }
    });

    if (createInterviewResponse.data.error) {
      throw new Error(`Interview creation failed: ${createInterviewResponse.data.error}`);
    }

    const interview = createInterviewResponse.data.interview;
    console.log('✅ Interview created successfully');
    console.log(`   Interview ID: ${interview.id}`);
    console.log(`   Scheduled Date: ${interview.scheduled_date}`);

    // Step 4: Check dashboard after creating interview
    console.log('\n📊 Step 4: Checking dashboard after creating interview...');
    const afterCreateResponse = await axios.get(`${API_BASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': token,
        'Content-Type': 'application/json'
      }
    });

    const afterCreateStats = afterCreateResponse.data.stats;
    console.log('📈 Dashboard Stats After Creating Interview:');
    console.log(`   Total Interviews: ${afterCreateStats.totalInterviews}`);
    console.log(`   Completed: ${afterCreateStats.completedInterviews}`);
    console.log(`   Upcoming: ${afterCreateStats.upcomingInterviews}`);
    console.log(`   Today's: ${afterCreateStats.todaysInterviews}`);

    // Step 5: Update interview to today's date
    console.log('\n🔄 Step 5: Updating interview to today\'s date...');
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];
    const todayTime = '15:00';

    const updateResponse = await axios.put(`${API_BASE_URL}/interviews/${interview.id}`, {
      company_name: 'Test Company Updated',
      job_title: 'Software Engineer',
      scheduled_date: todayDate,
      scheduled_time: todayTime,
      status: 'scheduled'
    }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': token,
        'Content-Type': 'application/json'
      }
    });

    if (updateResponse.data.error) {
      throw new Error(`Interview update failed: ${updateResponse.data.error}`);
    }

    const updatedInterview = updateResponse.data.interview;
    console.log('✅ Interview updated successfully');
    console.log(`   Updated Date: ${updatedInterview.scheduled_date}`);

    // Step 6: Check dashboard after updating interview
    console.log('\n📊 Step 6: Checking dashboard after updating interview...');
    const afterUpdateResponse = await axios.get(`${API_BASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': token,
        'Content-Type': 'application/json'
      }
    });

    const afterUpdateStats = afterUpdateResponse.data.stats;
    console.log('📈 Dashboard Stats After Updating Interview:');
    console.log(`   Total Interviews: ${afterUpdateStats.totalInterviews}`);
    console.log(`   Completed: ${afterUpdateStats.completedInterviews}`);
    console.log(`   Upcoming: ${afterUpdateStats.upcomingInterviews}`);
    console.log(`   Today's: ${afterUpdateStats.todaysInterviews}`);

    // Step 7: Verify the synchronization
    console.log('\n🔍 Step 7: Verifying synchronization...');
    
    if (afterUpdateStats.todaysInterviews === 1) {
      console.log('✅ SUCCESS: Dashboard correctly shows 1 interview for today!');
    } else {
      console.log('❌ ISSUE: Dashboard should show 1 interview for today but shows:', afterUpdateStats.todaysInterviews);
    }

    if (afterUpdateStats.upcomingInterviews === 1) {
      console.log('✅ SUCCESS: Dashboard correctly shows 1 upcoming interview!');
    } else {
      console.log('❌ ISSUE: Dashboard should show 1 upcoming interview but shows:', afterUpdateStats.upcomingInterviews);
    }

    if (afterUpdateStats.totalInterviews === 1) {
      console.log('✅ SUCCESS: Dashboard correctly shows 1 total interview!');
    } else {
      console.log('❌ ISSUE: Dashboard should show 1 total interview but shows:', afterUpdateStats.totalInterviews);
    }

    console.log('\n🎯 Test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testDashboardUpdateSync(); 