const axios = require('axios');

// Configuration
const API_BASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function testInterviewCreation() {
  console.log('📅 Testing Interview Creation...\n');
  
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
    
    // Test 1: Create interview with separate date and time
    console.log('\n📅 Test 1: Creating interview with separate date and time...');
    const interviewData1 = {
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
    
    const createResponse1 = await axios.post(`${API_BASE_URL}/interviews`, interviewData1, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Interview 1 created successfully:', createResponse1.data.interview.id);
    
    // Test 2: Create interview with combined timestamp
    console.log('\n📅 Test 2: Creating interview with combined timestamp...');
    const interviewData2 = {
      company_name: 'Startup Inc',
      job_title: 'Frontend Developer',
      scheduled_date: '2025-01-20T10:30:00.000Z',
      duration: 45,
      round: 2,
      status: 'scheduled',
      interview_type: 'behavioral',
      location: 'Office',
      notes: 'Behavioral interview'
    };
    
    const createResponse2 = await axios.post(`${API_BASE_URL}/interviews`, interviewData2, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Interview 2 created successfully:', createResponse2.data.interview.id);
    
    // Test 3: Create interview with uncertain status
    console.log('\n📅 Test 3: Creating interview with uncertain status...');
    const interviewData3 = {
      company_name: 'Big Corp',
      job_title: 'Full Stack Developer',
      status: 'uncertain',
      round: 1,
      interview_type: 'technical',
      location: 'TBD',
      notes: 'Interview details to be confirmed'
    };
    
    const createResponse3 = await axios.post(`${API_BASE_URL}/interviews`, interviewData3, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Interview 3 created successfully:', createResponse3.data.interview.id);
    
    // Get all interviews to verify
    console.log('\n📋 Getting all interviews...');
    const getInterviewsResponse = await axios.get(`${API_BASE_URL}/interviews`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Retrieved interviews:', getInterviewsResponse.data.interviews.length, 'interviews');
    getInterviewsResponse.data.interviews.forEach((interview, index) => {
      console.log(`  Interview ${index + 1}: ${interview.company_name} - ${interview.job_title} (${interview.status})`);
    });
    
    console.log('\n🎉 ALL INTERVIEW CREATION TESTS PASSED!');
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testInterviewCreation().catch(console.error); 