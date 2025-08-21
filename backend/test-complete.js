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

let adminToken = null;
let candidateToken = null;

const logTest = (testName, success, message = '') => {
  const status = success ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${testName}${message ? `: ${message}` : ''}`);
};

async function testAdminRegistration() {
  console.log('👑 Testing admin registration (first user)...');
  
  try {
    const adminData = {
      name: 'System Administrator',
      email: 'admin@wagehire.com',
      password: 'AdminSecure123!',
      phone: '+1234567890',
      current_position: 'System Administrator',
      experience_years: 10,
      skills: 'System Administration, Security, Management'
    };

    const response = await api.post('/auth/register', adminData);
    
    if (response.data.user && response.data.user.role === 'admin') {
      logTest('Admin Registration', true, `User role: ${response.data.user.role}`);
      
      // Login to get token
      const loginResponse = await api.post('/auth/login', {
        email: adminData.email,
        password: adminData.password
      });
      
      if (loginResponse.data.token) {
        adminToken = loginResponse.data.token;
        logTest('Admin Login', true, 'Token received');
        return true;
      } else {
        logTest('Admin Login', false, 'No token received');
        return false;
      }
    } else {
      logTest('Admin Registration', false, `Expected admin role, got: ${response.data.user?.role}`);
      return false;
    }
  } catch (error) {
    logTest('Admin Registration', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testCandidateRegistration() {
  console.log('\n👤 Testing candidate registration...');
  
  try {
    const candidateData = {
      name: 'John Candidate',
      email: 'candidate@wagehire.com',
      password: 'CandidateSecure123!',
      phone: '+0987654321',
      current_position: 'Software Engineer',
      experience_years: 3,
      skills: 'JavaScript, React, Node.js'
    };

    const response = await api.post('/auth/register', candidateData);
    
    if (response.data.user && response.data.user.role === 'candidate') {
      logTest('Candidate Registration', true, `User role: ${response.data.user.role}`);
      
      // Login to get token
      const loginResponse = await api.post('/auth/login', {
        email: candidateData.email,
        password: candidateData.password
      });
      
      if (loginResponse.data.token) {
        candidateToken = loginResponse.data.token;
        logTest('Candidate Login', true, 'Token received');
        return true;
      } else {
        logTest('Candidate Login', false, 'No token received');
        return false;
      }
    } else {
      logTest('Candidate Registration', false, `Expected candidate role, got: ${response.data.user?.role}`);
      return false;
    }
  } catch (error) {
    logTest('Candidate Registration', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testAdminDashboard() {
  console.log('\n📊 Testing admin dashboard...');
  
  if (!adminToken) {
    logTest('Admin Dashboard', false, 'No admin token available');
    return false;
  }
  
  try {
    api.defaults.headers['X-User-Token'] = adminToken;
    
    const response = await api.get('/admin/dashboard');
    
    if (response.data.stats) {
      const stats = response.data.stats;
      logTest('Admin Dashboard', true, 
        `Users: ${stats.totalUsers}, Candidates: ${stats.totalCandidates}, Interviews: ${stats.totalInterviews}`);
      return true;
    } else {
      logTest('Admin Dashboard', false, 'No stats received');
      return false;
    }
  } catch (error) {
    logTest('Admin Dashboard', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testGetAllUsers() {
  console.log('\n👥 Testing get all users (admin only)...');
  
  if (!adminToken) {
    logTest('Get All Users', false, 'No admin token available');
    return false;
  }
  
  try {
    api.defaults.headers['X-User-Token'] = adminToken;
    
    const response = await api.get('/admin/users');
    
    if (response.data.users && Array.isArray(response.data.users)) {
      logTest('Get All Users', true, `Found ${response.data.users.length} users`);
      return true;
    } else {
      logTest('Get All Users', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logTest('Get All Users', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testGetCandidates() {
  console.log('\n🎯 Testing get candidates...');
  
  if (!adminToken) {
    logTest('Get Candidates', false, 'No admin token available');
    return false;
  }
  
  try {
    api.defaults.headers['X-User-Token'] = adminToken;
    
    const response = await api.get('/candidates');
    
    if (response.data.candidates && Array.isArray(response.data.candidates)) {
      logTest('Get Candidates', true, `Found ${response.data.candidates.length} candidates`);
      return true;
    } else {
      logTest('Get Candidates', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logTest('Get Candidates', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function testCandidateAccess() {
  console.log('\n🔒 Testing candidate access restrictions...');
  
  if (!candidateToken) {
    logTest('Candidate Access Test', false, 'No candidate token available');
    return false;
  }
  
  try {
    api.defaults.headers['X-User-Token'] = candidateToken;
    
    // Candidate should NOT be able to access admin dashboard
    try {
      await api.get('/admin/dashboard');
      logTest('Candidate Access Restriction', false, 'Candidate should not access admin dashboard');
      return false;
    } catch (error) {
      if (error.response?.status === 403) {
        logTest('Candidate Access Restriction', true, 'Correctly blocked admin access');
        return true;
      } else {
        logTest('Candidate Access Restriction', false, `Unexpected error: ${error.response?.status}`);
        return false;
      }
    }
  } catch (error) {
    logTest('Candidate Access Test', false, error.message);
    return false;
  }
}

async function testInterviews() {
  console.log('\n📅 Testing interview functionality...');
  
  if (!adminToken) {
    logTest('Interview Test', false, 'No admin token available');
    return false;
  }
  
  try {
    api.defaults.headers['X-User-Token'] = adminToken;
    
    const response = await api.get('/interviews');
    
    if (response.data.interviews && Array.isArray(response.data.interviews)) {
      logTest('Get Interviews', true, `Found ${response.data.interviews.length} interviews`);
      return true;
    } else {
      logTest('Get Interviews', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logTest('Get Interviews', false, error.response?.data?.error || error.message);
    return false;
  }
}

async function runCompleteTest() {
  console.log('🚀 Starting complete API test suite...\n');
  
  const tests = [
    { name: 'Admin Registration', fn: testAdminRegistration },
    { name: 'Candidate Registration', fn: testCandidateRegistration },
    { name: 'Admin Dashboard', fn: testAdminDashboard },
    { name: 'Get All Users', fn: testGetAllUsers },
    { name: 'Get Candidates', fn: testGetCandidates },
    { name: 'Candidate Access Restrictions', fn: testCandidateAccess },
    { name: 'Interview Functionality', fn: testInterviews }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    const success = await test.fn();
    if (success) {
      passedTests++;
    }
    
    // Add small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 Final Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! The API is fully functional.');
    console.log('✅ Registration system working correctly');
    console.log('✅ Admin functions working correctly'); 
    console.log('✅ Candidate management working correctly');
    console.log('✅ Authentication and authorization working correctly');
  } else {
    console.log('⚠️  Some tests failed. Check the details above.');
  }
  
  console.log('='.repeat(60));
}

runCompleteTest().catch(console.error); 