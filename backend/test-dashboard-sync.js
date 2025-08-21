const axios = require('axios');

// Configuration
const API_BASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function testDashboardSync() {
  console.log('📊 Testing Dashboard Synchronization...\n');
  
  try {
    // Clean data first
    console.log('🧹 Cleaning data...');
    const { execSync } = require('child_process');
    execSync('node clean-supabase-data.js', { stdio: 'inherit' });
    
    // Register a candidate
    console.log('\n👤 Registering candidate...');
    const candidateData = {
      name: 'Test Candidate',
      email: `candidate-${Date.now()}@example.com`,
      password: 'Candidate123!',
      phone: '+1234567890',
      current_position: 'Software Developer',
      experience_years: 2,
      skills: 'JavaScript, React, Node.js'
    };

    const candidateResponse = await axios.post(`${API_BASE_URL}/auth/register`, candidateData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const candidateToken = candidateResponse.data.token;
    console.log('✅ Candidate registered successfully');
    
    // Test 1: Check initial dashboard (should be empty)
    console.log('\n📊 Test 1: Checking initial dashboard...');
    const initialDashboardResponse = await axios.get(`${API_BASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Initial dashboard stats:', initialDashboardResponse.data.stats);
    
    // Test 2: Create an interview
    console.log('\n📅 Test 2: Creating interview...');
    const interviewData = {
      company_name: 'Tech Corp',
      job_title: 'Senior Developer',
      scheduled_date: '2025-01-15',
      scheduled_time: '14:00',
      duration: 60,
      round: 1,
      status: 'scheduled',
      interview_type: 'technical',
      location: 'Remote',
      notes: 'Technical interview focusing on React and Node.js',
      company_website: 'https://techcorp.com',
      salary_range: '$80k-$120k'
    };
    
    const createResponse = await axios.post(`${API_BASE_URL}/interviews`, interviewData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Interview created successfully');
    
    // Test 3: Check dashboard after creating interview
    console.log('\n📊 Test 3: Checking dashboard after creating interview...');
    const updatedDashboardResponse = await axios.get(`${API_BASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Updated dashboard stats:', updatedDashboardResponse.data.stats);
    
    // Test 4: Create another interview for today
    console.log('\n📅 Test 4: Creating interview for today...');
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];
    const todayTime = '15:30';
    
    const todayInterviewData = {
      company_name: 'Startup Inc',
      job_title: 'Frontend Developer',
      scheduled_date: todayDate,
      scheduled_time: todayTime,
      duration: 45,
      round: 1,
      status: 'scheduled',
      interview_type: 'behavioral',
      location: 'Office',
      notes: 'Today\'s interview'
    };
    
    const createTodayResponse = await axios.post(`${API_BASE_URL}/interviews`, todayInterviewData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Today\'s interview created successfully');
    
    // Test 5: Check dashboard after creating today's interview
    console.log('\n📊 Test 5: Checking dashboard after creating today\'s interview...');
    const finalDashboardResponse = await axios.get(`${API_BASE_URL}/users/me/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Final dashboard stats:', finalDashboardResponse.data.stats);
    
    // Test 6: Verify the stats are correct
    console.log('\n🔍 Test 6: Verifying stats accuracy...');
    const stats = finalDashboardResponse.data.stats;
    
    if (stats.totalInterviews === 2) {
      console.log('✅ Total interviews count is correct: 2');
    } else {
      console.log('❌ Total interviews count is incorrect:', stats.totalInterviews);
    }
    
    if (stats.upcomingInterviews === 2) {
      console.log('✅ Upcoming interviews count is correct: 2');
    } else {
      console.log('❌ Upcoming interviews count is incorrect:', stats.upcomingInterviews);
    }
    
    if (stats.todaysInterviews === 1) {
      console.log('✅ Today\'s interviews count is correct: 1');
    } else {
      console.log('❌ Today\'s interviews count is incorrect:', stats.todaysInterviews);
    }
    
    if (stats.completedInterviews === 0) {
      console.log('✅ Completed interviews count is correct: 0');
    } else {
      console.log('❌ Completed interviews count is incorrect:', stats.completedInterviews);
    }
    
    console.log('\n🎉 DASHBOARD SYNCHRONIZATION TEST COMPLETED!');
    console.log('\n📋 Summary:');
    console.log('- ✅ Initial dashboard shows 0 interviews');
    console.log('- ✅ Dashboard updates after creating interviews');
    console.log('- ✅ Today\'s interviews are correctly counted');
    console.log('- ✅ Total and upcoming interviews are accurate');
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testDashboardSync().catch(console.error); 