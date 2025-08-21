const axios = require('axios');

// Configuration
const API_BASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function testCompleteFunctionality() {
  console.log('🧪 Testing Complete Functionality...\n');
  
  // Clean data first
  console.log('🧹 Cleaning data first...');
  const { execSync } = require('child_process');
  execSync('node clean-supabase-data.js', { stdio: 'inherit' });
  
  let adminToken, candidateToken;
  
  try {
    // 1. Register Admin (First User)
    console.log('👑 1. Registering Admin (First User)...');
    const adminData = {
      name: 'Admin User',
      email: `admin-${Date.now()}@example.com`,
      password: 'AdminUser123!',
      phone: '+1234567890',
      current_position: 'System Administrator',
      experience_years: 5,
      skills: 'Management, Leadership'
    };

    const adminResponse = await axios.post(`${API_BASE_URL}/auth/register`, adminData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    adminToken = adminResponse.data.token;
    console.log('✅ Admin registered successfully, role:', adminResponse.data.user.role);
    
    // 2. Register Candidate
    console.log('\n👤 2. Registering Candidate...');
    const candidateData = {
      name: 'Test Candidate',
      email: `candidate-${Date.now()}@example.com`,
      password: 'Candidate123!',
      phone: '+0987654321',
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
    
    candidateToken = candidateResponse.data.token;
    console.log('✅ Candidate registered successfully, role:', candidateResponse.data.user.role);
    
    // 3. Test Admin Dashboard
    console.log('\n📊 3. Testing Admin Dashboard...');
    const adminDashboardResponse = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': adminToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Admin dashboard working:', adminDashboardResponse.data.stats);
    
    // 4. Test Admin Get All Users
    console.log('\n👥 4. Testing Admin Get All Users...');
    const adminUsersResponse = await axios.get(`${API_BASE_URL}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': adminToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Admin can see all users:', adminUsersResponse.data.users.length, 'users');
    
    // 5. Test Admin Get Candidates
    console.log('\n🎯 5. Testing Admin Get Candidates...');
    const adminCandidatesResponse = await axios.get(`${API_BASE_URL}/candidates`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': adminToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Admin can see candidates:', adminCandidatesResponse.data.candidates.length, 'candidates');
    
    // 6. Test Candidate Create Interview
    console.log('\n📅 6. Testing Candidate Create Interview...');
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
    
    const createInterviewResponse = await axios.post(`${API_BASE_URL}/interviews`, interviewData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Candidate created interview successfully');
    
    // 7. Test Candidate Get Interviews
    console.log('\n📋 7. Testing Candidate Get Interviews...');
    const candidateInterviewsResponse = await axios.get(`${API_BASE_URL}/interviews`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Candidate can see their interviews:', candidateInterviewsResponse.data.interviews.length, 'interviews');
    
    // 8. Test Admin Get All Interviews
    console.log('\n📊 8. Testing Admin Get All Interviews...');
    const adminInterviewsResponse = await axios.get(`${API_BASE_URL}/interviews`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': adminToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Admin can see all interviews:', adminInterviewsResponse.data.interviews.length, 'interviews');
    
    // 9. Test Profile Endpoints
    console.log('\n👤 9. Testing Profile Endpoints...');
    const candidateProfileResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Profile endpoint working for candidate');
    
    // 10. Test Profile Update
    console.log('\n✏️ 10. Testing Profile Update...');
    const updateData = {
      phone: '+1111111111',
      current_position: 'Updated Position',
      experience_years: 3,
      skills: 'Updated Skills'
    };
    
    const updateProfileResponse = await axios.put(`${API_BASE_URL}/users/profile`, updateData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Profile update working');
    
    console.log('\n🎉 ALL TESTS PASSED! Functionality is working correctly!');
    console.log('\n📋 Summary:');
    console.log('✅ Admin registration and dashboard');
    console.log('✅ Candidate registration');
    console.log('✅ Admin can see all users and candidates');
    console.log('✅ Candidate can create interviews');
    console.log('✅ Candidate can see their interviews');
    console.log('✅ Admin can see all interviews');
    console.log('✅ Profile management working');
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testCompleteFunctionality().catch(console.error); 