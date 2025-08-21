const axios = require('axios');

// Configuration
const API_BASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function testInterviewUpdate() {
  console.log('✏️ Testing Interview Update Functionality...\n');
  
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
    
    // Test 1: Update interview with separate date and time
    console.log('\n✏️ Test 1: Updating interview with separate date and time...');
    const updateData1 = {
      company_name: 'Updated Tech Corp',
      job_title: 'Senior Full Stack Developer',
      scheduled_date: '2025-01-20',
      scheduled_time: '15:30',
      duration: 90,
      round: 2,
      status: 'scheduled',
      interview_type: 'behavioral',
      location: 'Office',
      notes: 'Updated interview notes',
      salary_range: '$90k-$130k'
    };
    
    const updateResponse1 = await axios.put(`${API_BASE_URL}/interviews/${interviewId}`, updateData1, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Interview updated successfully');
    console.log('Updated data:', {
      company: updateResponse1.data.interview.company_name,
      job_title: updateResponse1.data.interview.job_title,
      scheduled_date: updateResponse1.data.interview.scheduled_date,
      duration: updateResponse1.data.interview.duration,
      round: updateResponse1.data.interview.round
    });
    
    // Test 2: Update interview with combined timestamp
    console.log('\n✏️ Test 2: Updating interview with combined timestamp...');
    const updateData2 = {
      company_name: 'Final Tech Corp',
      job_title: 'Lead Developer',
      scheduled_date: '2025-01-25T16:00:00.000Z',
      duration: 120,
      round: 3,
      status: 'scheduled',
      interview_type: 'final',
      location: 'Hybrid',
      notes: 'Final round interview'
    };
    
    const updateResponse2 = await axios.put(`${API_BASE_URL}/interviews/${interviewId}`, updateData2, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Interview updated successfully');
    console.log('Updated data:', {
      company: updateResponse2.data.interview.company_name,
      job_title: updateResponse2.data.interview.job_title,
      scheduled_date: updateResponse2.data.interview.scheduled_date,
      duration: updateResponse2.data.interview.duration,
      round: updateResponse2.data.interview.round
    });
    
    // Test 3: Update interview status to uncertain
    console.log('\n✏️ Test 3: Updating interview status to uncertain...');
    const updateData3 = {
      status: 'uncertain',
      notes: 'Interview details to be confirmed'
    };
    
    const updateResponse3 = await axios.put(`${API_BASE_URL}/interviews/${interviewId}`, updateData3, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Interview status updated to uncertain');
    console.log('Updated data:', {
      status: updateResponse3.data.interview.status,
      scheduled_date: updateResponse3.data.interview.scheduled_date,
      duration: updateResponse3.data.interview.duration
    });
    
    // Test 4: Get updated interview to verify
    console.log('\n📋 Test 4: Getting updated interview to verify...');
    const getResponse = await axios.get(`${API_BASE_URL}/interviews/${interviewId}`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': candidateToken,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Interview retrieved successfully');
    console.log('Final interview data:', {
      company: getResponse.data.interview.company_name,
      job_title: getResponse.data.interview.job_title,
      status: getResponse.data.interview.status,
      scheduled_date: getResponse.data.interview.scheduled_date,
      duration: getResponse.data.interview.duration,
      round: getResponse.data.interview.round
    });
    
    console.log('\n🎉 ALL INTERVIEW UPDATE TESTS PASSED!');
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testInterviewUpdate().catch(console.error); 