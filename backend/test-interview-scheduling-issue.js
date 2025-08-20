const https = require('https');

// Supabase configuration
const config = {
  supabaseUrl: 'https://xzndkdqlsllwyygbniht.supabase.co',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcwNzY4MywiZXhwIjoyMDcxMjgzNjgzfQ.KQJrEg-zPQdgtHikT3wLO0JkQQV1kx8ngyJBAL-zS8k'
};

function makeSupabaseRequest(method, path, data = null, headers = {}) {
  const options = {
    hostname: 'xzndkdqlsllwyygbniht.supabase.co',
    port: 443,
    path: `/rest/v1${path}`,
    method: method,
    headers: {
      'Authorization': `Bearer ${config.serviceKey}`,
      'apikey': config.serviceKey,
      'Content-Type': 'application/json',
      ...headers
    }
  };

  console.log(`\n🧪 ${method} ${path}`);

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (responseData) {
          try {
            const parsed = JSON.parse(responseData);
            console.log(`   Response: ${JSON.stringify(parsed, null, 2)}`);
          } catch (e) {
            console.log(`   Response: ${responseData}`);
          }
        } else {
          console.log('   Response: (empty)');
        }
        
        const result = {
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300,
          data: responseData
        };
        
        resolve(result);
      });
    });

    req.on('error', (e) => {
      console.error(`   Error: ${e.message}`);
      resolve({ status: 0, success: false, error: e.message });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testInterviewSchedulingIssue() {
  console.log('🔍 Testing Interview Scheduling Issue');
  console.log('=====================================\n');

  // First, get a candidate user to test with
  console.log('📋 Step 1: Getting a candidate user...');
  const usersResult = await makeSupabaseRequest('GET', '/users?select=id,email,name,role&role=eq.candidate&limit=1');
  
  if (!usersResult.success) {
    console.log('❌ Failed to get candidate users');
    return;
  }

  let users = [];
  try {
    users = JSON.parse(usersResult.data);
  } catch (e) {
    console.log('❌ Failed to parse users response');
    return;
  }

  if (users.length === 0) {
    console.log('❌ No candidate users found in database');
    return;
  }

  const testCandidate = users[0];
  console.log(`📊 Using test candidate: ${testCandidate.email} (${testCandidate.role})`);

  // Test interview creation
  console.log('\n📋 Step 2: Testing interview creation...');
  const interviewData = {
    candidate_id: testCandidate.id,
    company_name: 'Test Company',
    job_title: 'Software Engineer',
    scheduled_date: '2025-01-15T10:00:00Z',
    duration: 60,
    status: 'scheduled',
    round: 1,
    interview_type: 'technical',
    location: 'Remote',
    notes: 'Test interview',
    company_website: 'https://testcompany.com',
    company_linkedin_url: 'https://linkedin.com/company/testcompany',
    job_description: 'Test job description',
    salary_range: '$80k - $120k',
    interviewer_name: 'John Doe',
    interviewer_email: 'john.doe@testcompany.com',
    interviewer_position: 'Senior Engineer'
  };

  const createResult = await makeSupabaseRequest('POST', '/interviews', interviewData);
  
  if (createResult.success) {
    console.log('✅ Interview creation successful');
    
    // Get the created interview to verify
    const interviewResult = await makeSupabaseRequest('GET', `/interviews?candidate_id=eq.${testCandidate.id}&select=*&order=created_at.desc&limit=1`);
    
    if (interviewResult.success) {
      try {
        const interviews = JSON.parse(interviewResult.data);
        if (interviews.length > 0) {
          const interview = interviews[0];
          console.log('📊 Created interview data:');
          console.log(`   Company: ${interview.company_name}`);
          console.log(`   Job Title: ${interview.job_title}`);
          console.log(`   Status: ${interview.status}`);
          console.log(`   Round: ${interview.round}`);
          console.log(`   Interviewer: ${interview.interviewer_name}`);
          console.log(`   Created at: ${interview.created_at}`);
          
          // Check if the interview was created correctly
          const isCreated = 
            interview.company_name === interviewData.company_name &&
            interview.job_title === interviewData.job_title &&
            interview.candidate_id === testCandidate.id;
          
          if (isCreated) {
            console.log('✅ Interview creation verified - all fields created correctly');
          } else {
            console.log('❌ Interview creation verification failed - some fields not created correctly');
          }
        }
      } catch (e) {
        console.log('❌ Failed to parse interview response');
      }
    }
  } else {
    console.log('❌ Interview creation failed');
  }

  // Test getting all interviews for the candidate
  console.log('\n📋 Step 3: Testing interview retrieval...');
  const allInterviewsResult = await makeSupabaseRequest('GET', `/interviews?candidate_id=eq.${testCandidate.id}&select=*`);
  
  if (allInterviewsResult.success) {
    try {
      const allInterviews = JSON.parse(allInterviewsResult.data);
      console.log(`📊 Found ${allInterviews.length} interviews for candidate`);
      
      allInterviews.forEach((interview, index) => {
        console.log(`   ${index + 1}. ${interview.company_name} - ${interview.job_title} (${interview.status})`);
      });
    } catch (e) {
      console.log('❌ Failed to parse all interviews response');
    }
  } else {
    console.log('❌ Failed to get all interviews');
  }

  console.log('\n🔍 Analysis Complete');
  console.log('===================');
  console.log('If interview creation is working in backend but not in frontend,');
  console.log('the issue might be in frontend API calls or authentication.');
}

testInterviewSchedulingIssue().catch(console.error); 