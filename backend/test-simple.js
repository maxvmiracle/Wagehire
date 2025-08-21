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

async function testRegistration() {
  console.log('Testing registration...');
  
  try {
      const userData = {
    name: 'Test Admin 2',
    email: 'testadmin2@example.com',
    password: 'TestAdmin123!',
    phone: '+1234567890',
    current_position: 'Admin',
    experience_years: 5,
    skills: 'Management, Leadership'
  };

    console.log('Sending registration request...');
    const response = await api.post('/auth/register', userData);
    
    console.log('Registration response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.user) {
      console.log('✅ Registration successful!');
      console.log('User role:', response.data.user.role);
      console.log('Token received:', !!response.data.token);
      return response.data.token;
    }
  } catch (error) {
    console.error('❌ Registration failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
  
  return null;
}

async function testLogin() {
  console.log('\nTesting login...');
  
  try {
    const loginData = {
      email: 'testadmin2@example.com',
      password: 'TestAdmin123!'
    };

    console.log('Sending login request...');
    const response = await api.post('/auth/login', loginData);
    
    console.log('Login response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.token) {
      console.log('✅ Login successful!');
      return response.data.token;
    }
  } catch (error) {
    console.error('❌ Login failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
  
  return null;
}

async function testAdminAccess(token) {
  if (!token) {
    console.log('\n❌ No token available for admin access test');
    return;
  }
  
  console.log('\nTesting admin access...');
  
  // Add token to headers
  api.defaults.headers['X-User-Token'] = token;
  
  try {
    console.log('Testing admin dashboard...');
    const dashboardResponse = await api.get('/admin/dashboard');
    console.log('Dashboard response:', JSON.stringify(dashboardResponse.data, null, 2));
    
    console.log('Testing get all users...');
    const usersResponse = await api.get('/admin/users');
    console.log('Users response:', JSON.stringify(usersResponse.data, null, 2));
    
    console.log('✅ Admin access successful!');
  } catch (error) {
    console.error('❌ Admin access failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting simple API tests...\n');
  
  const token = await testRegistration();
  const loginToken = await testLogin();
  await testAdminAccess(loginToken || token);
  
  console.log('\n🏁 Tests completed!');
}

runTests().catch(console.error); 