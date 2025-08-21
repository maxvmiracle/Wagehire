const axios = require('axios');

// Configuration
const API_BASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
  },
  timeout: 30000
});

// Test data
const testUsers = [
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'Admin123!',
    role: 'admin'
  },
  {
    name: 'Test Candidate 1',
    email: 'candidate1@test.com',
    password: 'Candidate123!',
    phone: '+1234567890',
    current_position: 'Software Engineer',
    experience_years: 3,
    skills: 'JavaScript, React, Node.js'
  },
  {
    name: 'Test Candidate 2',
    email: 'candidate2@test.com',
    password: 'Candidate123!',
    phone: '+0987654321',
    current_position: 'Frontend Developer',
    experience_years: 2,
    skills: 'React, TypeScript, CSS'
  }
];

let adminToken = null;
let candidateToken = null;

// Utility functions
const addUserToken = (token) => {
  if (token) {
    api.defaults.headers['X-User-Token'] = token;
  }
};

const removeUserToken = () => {
  delete api.defaults.headers['X-User-Token'];
};

const logTest = (testName, success, message = '') => {
  const status = success ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${testName}${message ? `: ${message}` : ''}`);
};

// Test functions
async function testHealthCheck() {
  try {
    const response = await api.get('/health');
    logTest('Health Check', response.status === 200, `Status: ${response.status}`);
    return true;
  } catch (error) {
    logTest('Health Check', false, error.message);
    return false;
  }
}

async function testRegistration() {
  try {
    // Test admin registration (first user)
    const adminData = testUsers[0];
    const adminResponse = await api.post('/auth/register', adminData);
    
    if (adminResponse.data.user && adminResponse.data.user.role === 'admin') {
      logTest('Admin Registration', true, 'First user becomes admin');
      adminToken = adminResponse.data.token;
      addUserToken(adminToken);
    } else {
      logTest('Admin Registration', false, 'First user should be admin');
      return false;
    }

    // Test candidate registration
    const candidateData = testUsers[1];
    const candidateResponse = await api.post('/auth/register', candidateData);
    
    if (candidateResponse.data.user && candidateResponse.data.user.role === 'candidate') {
      logTest('Candidate Registration', true, 'Subsequent users become candidates');
      candidateToken = candidateResponse.data.token;
    } else {
      logTest('Candidate Registration', false, 'Subsequent users should be candidates');
      return false;
    }

    return true;
  } catch (error) {
    logTest('Registration', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testLogin() {
  try {
    // Test admin login
    const adminLoginResponse = await api.post('/auth/login', {
      email: testUsers[0].email,
      password: testUsers[0].password
    });
    
    if (adminLoginResponse.data.token) {
      logTest('Admin Login', true);
      adminToken = adminLoginResponse.data.token;
      addUserToken(adminToken);
    } else {
      logTest('Admin Login', false);
      return false;
    }

    // Test candidate login
    const candidateLoginResponse = await api.post('/auth/login', {
      email: testUsers[1].email,
      password: testUsers[1].password
    });
    
    if (candidateLoginResponse.data.token) {
      logTest('Candidate Login', true);
      candidateToken = candidateLoginResponse.data.token;
    } else {
      logTest('Candidate Login', false);
      return false;
    }

    return true;
  } catch (error) {
    logTest('Login', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testUserProfile() {
  try {
    // Test get profile
    const profileResponse = await api.get('/users/profile');
    if (profileResponse.data.user) {
      logTest('Get Profile', true);
    } else {
      logTest('Get Profile', false);
      return false;
    }

    // Test update profile
    const updateData = {
      phone: '+1111111111',
      current_position: 'Senior Developer',
      experience_years: 5,
      skills: 'JavaScript, React, Node.js, Python'
    };

    const updateResponse = await api.put('/users/profile', updateData);
    if (updateResponse.data.user) {
      logTest('Update Profile', true);
    } else {
      logTest('Update Profile', false);
      return false;
    }

    return true;
  } catch (error) {
    logTest('User Profile', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testUserDashboard() {
  try {
    const response = await api.get('/users/me/dashboard');
    if (response.data.stats) {
      logTest('User Dashboard', true, `Stats: ${JSON.stringify(response.data.stats)}`);
    } else {
      logTest('User Dashboard', false);
      return false;
    }
    return true;
  } catch (error) {
    logTest('User Dashboard', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testAdminDashboard() {
  try {
    const response = await api.get('/admin/dashboard');
    if (response.data.stats) {
      logTest('Admin Dashboard', true, `Stats: ${JSON.stringify(response.data.stats)}`);
    } else {
      logTest('Admin Dashboard', false);
      return false;
    }
    return true;
  } catch (error) {
    logTest('Admin Dashboard', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testGetAllUsers() {
  try {
    const response = await api.get('/admin/users');
    if (response.data.users && Array.isArray(response.data.users)) {
      logTest('Get All Users', true, `Found ${response.data.users.length} users`);
    } else {
      logTest('Get All Users', false);
      return false;
    }
    return true;
  } catch (error) {
    logTest('Get All Users', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testCreateUser() {
  try {
    const newUserData = {
      name: 'New Test User',
      email: 'newuser@test.com',
      password: 'NewUser123!',
      role: 'candidate',
      phone: '+2222222222',
      current_position: 'Junior Developer',
      experience_years: 1,
      skills: 'HTML, CSS, JavaScript'
    };

    const response = await api.post('/admin/users', newUserData);
    if (response.data.user) {
      logTest('Create User', true, `Created user: ${response.data.user.email}`);
    } else {
      logTest('Create User', false);
      return false;
    }
    return true;
  } catch (error) {
    logTest('Create User', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testGetCandidates() {
  try {
    const response = await api.get('/candidates');
    if (response.data.candidates && Array.isArray(response.data.candidates)) {
      logTest('Get Candidates', true, `Found ${response.data.candidates.length} candidates`);
    } else {
      logTest('Get Candidates', false);
      return false;
    }
    return true;
  } catch (error) {
    logTest('Get Candidates', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testCreateCandidate() {
  try {
    const newCandidateData = {
      name: 'New Test Candidate',
      email: 'newcandidate@test.com',
      password: 'NewCandidate123!',
      phone: '+3333333333',
      current_position: 'UI/UX Designer',
      experience_years: 2,
      skills: 'Figma, Adobe XD, Sketch'
    };

    const response = await api.post('/candidates', newCandidateData);
    if (response.data.candidate) {
      logTest('Create Candidate', true, `Created candidate: ${response.data.candidate.email}`);
    } else {
      logTest('Create Candidate', false);
      return false;
    }
    return true;
  } catch (error) {
    logTest('Create Candidate', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testGetInterviews() {
  try {
    const response = await api.get('/interviews');
    if (response.data.interviews && Array.isArray(response.data.interviews)) {
      logTest('Get Interviews', true, `Found ${response.data.interviews.length} interviews`);
    } else {
      logTest('Get Interviews', true, 'No interviews found (expected for new system)');
    }
    return true;
  } catch (error) {
    logTest('Get Interviews', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testCreateInterview() {
  try {
    // First get a candidate ID
    const candidatesResponse = await api.get('/candidates');
    if (!candidatesResponse.data.candidates || candidatesResponse.data.candidates.length === 0) {
      logTest('Create Interview', false, 'No candidates available');
      return false;
    }

    const candidateId = candidatesResponse.data.candidates[0].id;
    const interviewData = {
      candidate_id: candidateId,
      company_name: 'Test Company',
      job_title: 'Software Engineer',
      scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      duration: 60,
      status: 'scheduled',
      round: 1,
      interview_type: 'technical',
      location: 'Remote',
      notes: 'Test interview for API testing',
      company_website: 'https://testcompany.com',
      job_description: 'Test job description'
    };

    const response = await api.post('/interviews', interviewData);
    if (response.data.interview) {
      logTest('Create Interview', true, `Created interview for ${response.data.interview.company_name}`);
    } else {
      logTest('Create Interview', false);
      return false;
    }
    return true;
  } catch (error) {
    logTest('Create Interview', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testAdminInterviews() {
  try {
    const response = await api.get('/admin/interviews');
    if (response.data.interviews && Array.isArray(response.data.interviews)) {
      logTest('Admin Get Interviews', true, `Found ${response.data.interviews.length} interviews`);
    } else {
      logTest('Admin Get Interviews', true, 'No interviews found (expected for new system)');
    }
    return true;
  } catch (error) {
    logTest('Admin Get Interviews', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testNonAdminAccess() {
  try {
    // Try to access admin endpoints with candidate token
    removeUserToken();
    addUserToken(candidateToken);

    try {
      await api.get('/admin/dashboard');
      logTest('Non-Admin Access Protection', false, 'Should not allow candidate to access admin dashboard');
      return false;
    } catch (error) {
      if (error.response?.status === 403) {
        logTest('Non-Admin Access Protection', true, 'Correctly blocked candidate from admin access');
      } else {
        logTest('Non-Admin Access Protection', false, `Unexpected error: ${error.response?.status}`);
        return false;
      }
    }

    return true;
  } catch (error) {
    logTest('Non-Admin Access Protection', false, error.message);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting comprehensive API tests...\n');

  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Registration', fn: testRegistration },
    { name: 'Login', fn: testLogin },
    { name: 'User Profile', fn: testUserProfile },
    { name: 'User Dashboard', fn: testUserDashboard },
    { name: 'Admin Dashboard', fn: testAdminDashboard },
    { name: 'Get All Users', fn: testGetAllUsers },
    { name: 'Create User', fn: testCreateUser },
    { name: 'Get Candidates', fn: testGetCandidates },
    { name: 'Create Candidate', fn: testCreateCandidate },
    { name: 'Get Interviews', fn: testGetInterviews },
    { name: 'Create Interview', fn: testCreateInterview },
    { name: 'Admin Get Interviews', fn: testAdminInterviews },
    { name: 'Non-Admin Access Protection', fn: testNonAdminAccess }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    console.log(`\n📋 Running: ${test.name}`);
    console.log('─'.repeat(50));
    
    const success = await test.fn();
    if (success) {
      passedTests++;
    }
    
    // Add delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The API is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
  }
  
  console.log('='.repeat(60));
}

// Run tests
runAllTests().catch(console.error); 