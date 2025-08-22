const axios = require('axios');

const API_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';

async function testCandidateData() {
  console.log('🧪 Testing Candidate Data Fix');
  console.log('==============================\n');

  try {
    // First, let's register a test user to get a token
    console.log('1. Registering test user...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test Candidate',
      email: `test-candidate-${Date.now()}@example.com`,
      password: 'TestPass123!',
      phone: '+1234567890',
      current_position: 'Software Engineer',
      experience_years: 3,
      skills: 'JavaScript, React, Node.js'
    });

    const token = registerResponse.data.token;
    console.log('✅ Test user registered successfully');
    console.log('Token received:', token ? 'Yes' : 'No');

    // Now let's create an interview for this user
    console.log('\n2. Creating test interview...');
    const interviewResponse = await axios.post(`${API_URL}/interviews`, {
      company_name: 'Test Company',
      job_title: 'Senior Developer',
      scheduled_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      interviewer_name: 'Test Interviewer',
      interviewer_email: 'interviewer@test.com',
      interview_type: 'Technical',
      interview_round: 'R1',
      status: 'scheduled'
    }, {
      headers: {
        'X-User-Token': token
      }
    });

    console.log('✅ Test interview created successfully');

    // Now let's fetch interviews to see the candidate data
    console.log('\n3. Fetching interviews to check candidate data...');
    const interviewsResponse = await axios.get(`${API_URL}/interviews`, {
      headers: {
        'X-User-Token': token
      }
    });

    const interviews = interviewsResponse.data.interviews;
    console.log(`✅ Found ${interviews.length} interviews`);

    if (interviews.length > 0) {
      const interview = interviews[0];
      console.log('\n📊 Interview Data Analysis:');
      console.log('==========================');
      console.log('Company:', interview.company_name);
      console.log('Job Title:', interview.job_title);
      console.log('Candidate Name:', interview.candidate_name);
      console.log('Candidate Email:', interview.candidate_email);
      console.log('Candidate Phone:', interview.candidate_phone);
      console.log('Candidate Position:', interview.candidate_position);
      console.log('Candidate Experience:', interview.candidate_experience);
      console.log('Candidate Skills:', interview.candidate_skills);
      
      console.log('\n🔍 Data Structure Check:');
      console.log('Has candidate_name:', !!interview.candidate_name);
      console.log('Has candidate_email:', !!interview.candidate_email);
      console.log('Is Unknown Candidate:', interview.candidate_name === 'Unknown Candidate');
      console.log('Is No email:', interview.candidate_email === 'No email');
      
      if (interview.candidate_name && interview.candidate_name !== 'Unknown Candidate') {
        console.log('\n✅ SUCCESS: Candidate data is being returned correctly!');
      } else {
        console.log('\n❌ ISSUE: Still showing "Unknown Candidate" - Supabase function needs deployment');
      }
    } else {
      console.log('\n❌ No interviews found');
    }

  } catch (error) {
    console.error('\n❌ Error during testing:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Tip: Try logging in first to get a valid token');
    }
  }
}

testCandidateData(); 