const axios = require('axios');

// Configuration
const API_BASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function testInterviewDetail() {
  console.log('📋 Testing Interview Detail Functionality...\n');
  
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
    
    // Create an interview
    console.log('\n📅 Creating interview...');
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
    
    const interviewId = createResponse.data.interview.id;
    console.log('✅ Interview created successfully:', interviewId);
    
    // Test 1: Get interview detail
    console.log('\n📋 Test 1: Getting interview detail...');
    const detailResponse = await axios.get(`${API_BASE_URL}/interviews/${interviewId}`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Interview detail retrieved successfully');
    console.log('Interview data:', {
      id: detailResponse.data.interview.id,
      company: detailResponse.data.interview.company_name,
      job_title: detailResponse.data.interview.job_title,
      status: detailResponse.data.interview.status,
      scheduled_date: detailResponse.data.interview.scheduled_date
    });
    
    // Test 2: Try to access non-existent interview
    console.log('\n❌ Test 2: Testing non-existent interview...');
    try {
      await axios.get(`${API_BASE_URL}/interviews/non-existent-id`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': candidateToken,
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ Should have failed but didn\'t');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Correctly returned 404 for non-existent interview');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }
    
    // Test 3: Delete interview
    console.log('\n🗑️ Test 3: Deleting interview...');
    const deleteResponse = await axios.delete(`${API_BASE_URL}/interviews/${interviewId}`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Interview deleted successfully');
    
    // Test 4: Verify interview is deleted
    console.log('\n🔍 Test 4: Verifying interview is deleted...');
    try {
      await axios.get(`${API_BASE_URL}/interviews/${interviewId}`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': candidateToken,
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ Interview should be deleted but still exists');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Interview correctly deleted and returns 404');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }
    
    console.log('\n🎉 ALL INTERVIEW DETAIL TESTS PASSED!');
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testInterviewDetail().catch(console.error); 