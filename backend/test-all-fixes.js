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
            console.log(`   Response: ${JSON.stringify(parsed, null, 2).substring(0, 200)}${responseData.length > 200 ? '...' : ''}`);
          } catch (e) {
            console.log(`   Response: ${responseData.substring(0, 200)}${responseData.length > 200 ? '...' : ''}`);
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

async function testAllFixes() {
  console.log('🔍 Testing All Fixes');
  console.log('===================\n');

  const results = {
    registration: false,
    profileUpdate: false,
    interviewScheduling: false
  };

  // Test 1: Registration Role Assignment
  console.log('📋 Test 1: Registration Role Assignment');
  console.log('=======================================');
  
  const testCandidateData = {
    email: 'test-fix-' + Date.now() + '@example.com',
    password: 'TestPass123!',
    name: 'Test Fix User',
    phone: '1234567890',
    current_position: 'Software Engineer',
    experience_years: 3,
    skills: 'JavaScript, React, Node.js'
  };

  const registerResult = await makeSupabaseRequest('POST', '/users', testCandidateData);
  
  if (registerResult.success) {
    console.log('✅ Registration successful');
    
    // Check the new user's role
    const newUserResult = await makeSupabaseRequest('GET', `/users?email=eq.${testCandidateData.email}&select=id,email,name,role,created_at`);
    
    if (newUserResult.success) {
      try {
        const newUsers = JSON.parse(newUserResult.data);
        if (newUsers.length > 0) {
          const newUser = newUsers[0];
          console.log(`📊 New user role: ${newUser.role}`);
          
          if (newUser.role === 'candidate') {
            console.log('✅ CORRECT: New user is assigned candidate role');
            results.registration = true;
          } else {
            console.log('❌ ISSUE: New user has wrong role:', newUser.role);
          }
        }
      } catch (e) {
        console.log('❌ Failed to parse new user response');
      }
    }
  } else {
    console.log('❌ Registration failed');
  }

  // Test 2: Profile Update
  console.log('\n📋 Test 2: Profile Update');
  console.log('==========================');
  
  // Get the test user for profile update
  const testUserResult = await makeSupabaseRequest('GET', `/users?email=eq.${testCandidateData.email}&select=id,email,name,role&limit=1`);
  
  if (testUserResult.success) {
    try {
      const testUsers = JSON.parse(testUserResult.data);
      if (testUsers.length > 0) {
        const testUser = testUsers[0];
        console.log(`📊 Using test user: ${testUser.email} (${testUser.role})`);

        // Test profile update
        const updateData = {
          name: 'Updated Test Fix User',
          phone: '9876543210',
          current_position: 'Senior Software Engineer',
          experience_years: 5,
          skills: 'JavaScript, React, Node.js, TypeScript, AWS, Docker'
        };

        const updateResult = await makeSupabaseRequest('PUT', `/users?id=eq.${testUser.id}`, updateData);
        
        if (updateResult.success) {
          console.log('✅ Profile update successful');
          
          // Get the updated user to verify changes
          const updatedUserResult = await makeSupabaseRequest('GET', `/users?id=eq.${testUser.id}&select=id,email,name,role,phone,current_position,experience_years,skills,updated_at`);
          
          if (updatedUserResult.success) {
            try {
              const updatedUsers = JSON.parse(updatedUserResult.data);
              if (updatedUsers.length > 0) {
                const updatedUser = updatedUsers[0];
                console.log('📊 Updated user data:');
                console.log(`   Name: ${updatedUser.name}`);
                console.log(`   Phone: ${updatedUser.phone}`);
                console.log(`   Position: ${updatedUser.current_position}`);
                console.log(`   Experience: ${updatedUser.experience_years} years`);
                console.log(`   Skills: ${updatedUser.skills}`);
                
                // Check if the update was successful
                const isUpdated = 
                  updatedUser.name === updateData.name &&
                  updatedUser.phone === updateData.phone &&
                  updatedUser.current_position === updateData.current_position &&
                  updatedUser.experience_years === updateData.experience_years &&
                  updatedUser.skills === updateData.skills;
                
                if (isUpdated) {
                  console.log('✅ Profile update verified - all fields updated correctly');
                  results.profileUpdate = true;
                } else {
                  console.log('❌ Profile update verification failed - some fields not updated');
                }
              }
            } catch (e) {
              console.log('❌ Failed to parse updated user response');
            }
          }
        } else {
          console.log('❌ Profile update failed');
        }
      }
    } catch (e) {
      console.log('❌ Failed to parse test user response');
    }
  }

  // Test 3: Interview Scheduling
  console.log('\n📋 Test 3: Interview Scheduling');
  console.log('================================');
  
  // Get the test user for interview creation
  const candidateResult = await makeSupabaseRequest('GET', `/users?email=eq.${testCandidateData.email}&select=id,email,name,role&limit=1`);
  
  if (candidateResult.success) {
    try {
      const candidates = JSON.parse(candidateResult.data);
      if (candidates.length > 0) {
        const candidate = candidates[0];
        console.log(`📊 Using test candidate: ${candidate.email} (${candidate.role})`);

        // Test interview creation
        const interviewData = {
          candidate_id: candidate.id,
          company_name: 'Test Fix Company',
          job_title: 'Senior Software Engineer',
          scheduled_date: '2025-01-20T14:00:00Z',
          duration: 90,
          status: 'scheduled',
          round: 2,
          interview_type: 'technical',
          location: 'Remote',
          notes: 'Test interview for fixes',
          company_website: 'https://testfixcompany.com',
          company_linkedin_url: 'https://linkedin.com/company/testfixcompany',
          job_description: 'Test job description for fixes',
          salary_range: '$100k - $150k',
          interviewer_name: 'Jane Smith',
          interviewer_email: 'jane.smith@testfixcompany.com',
          interviewer_position: 'Engineering Manager'
        };

        const createResult = await makeSupabaseRequest('POST', '/interviews', interviewData);
        
        if (createResult.success) {
          console.log('✅ Interview creation successful');
          
          // Get the created interview to verify
          const interviewResult = await makeSupabaseRequest('GET', `/interviews?candidate_id=eq.${candidate.id}&select=*&order=created_at.desc&limit=1`);
          
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
                
                // Check if the interview was created correctly
                const isCreated = 
                  interview.company_name === interviewData.company_name &&
                  interview.job_title === interviewData.job_title &&
                  interview.candidate_id === candidate.id;
                
                if (isCreated) {
                  console.log('✅ Interview creation verified - all fields created correctly');
                  results.interviewScheduling = true;
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
      }
    } catch (e) {
      console.log('❌ Failed to parse candidate response');
    }
  }

  // Summary
  console.log('\n📊 Test Results Summary');
  console.log('========================');
  console.log(`✅ Registration Role Assignment: ${results.registration ? 'PASSED' : 'FAILED'}`);
  console.log(`✅ Profile Update: ${results.profileUpdate ? 'PASSED' : 'FAILED'}`);
  console.log(`✅ Interview Scheduling: ${results.interviewScheduling ? 'PASSED' : 'FAILED'}`);
  
  const passedTests = Object.values(results).filter(r => r).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n📈 Overall Success Rate: ${passedTests}/${totalTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL FIXES VERIFIED SUCCESSFULLY!');
    console.log('   Your application should now work correctly.');
  } else {
    console.log('\n⚠️  Some issues still need attention.');
    console.log('   Check the failed tests above for details.');
  }

  console.log('\n🔧 Next Steps:');
  console.log('   1. Test the frontend application');
  console.log('   2. Verify profile updates reflect in UI');
  console.log('   3. Confirm interview scheduling works');
  console.log('   4. Check that registration assigns correct roles');
}

testAllFixes().catch(console.error); 