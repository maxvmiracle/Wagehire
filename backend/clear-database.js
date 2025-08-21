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

async function clearDatabase() {
  console.log('🗑️  Clearing database...');
  
  try {
    // This would require a direct database connection or admin endpoint
    // For now, let's just test with a completely new email
    console.log('⚠️  Cannot directly clear database via API');
    console.log('💡 Using a unique email for testing...');
    
    const uniqueEmail = `admin-${Date.now()}@example.com`;
    console.log(`📧 Using email: ${uniqueEmail}`);
    
    return uniqueEmail;
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    return null;
  }
}

async function testFirstUserAdmin(email) {
  console.log('\n👑 Testing first user admin logic...');
  
  try {
    const userData = {
      name: 'First Admin User',
      email: email,
      password: 'FirstAdmin123!',
      phone: '+1234567890',
      current_position: 'System Administrator',
      experience_years: 10,
      skills: 'System Administration, Security, Management'
    };

    console.log('Sending registration request...');
    const response = await api.post('/auth/register', userData);
    
    console.log('Registration response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.user && response.data.user.role === 'admin') {
      console.log('✅ SUCCESS: First user correctly became admin!');
      return response.data.token;
    } else {
      console.log('❌ FAILED: First user should be admin but got role:', response.data.user?.role);
      return null;
    }
  } catch (error) {
    console.error('❌ Registration failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    return null;
  }
}

async function testAdminFunctions(token) {
  if (!token) {
    console.log('\n❌ No admin token available for testing admin functions');
    return;
  }
  
  console.log('\n🔧 Testing admin functions...');
  
  // Add token to headers
  api.defaults.headers['X-User-Token'] = token;
  
  try {
    console.log('Testing admin dashboard...');
    const dashboardResponse = await api.get('/admin/dashboard');
    console.log('Dashboard response:', JSON.stringify(dashboardResponse.data, null, 2));
    
    console.log('Testing get all users...');
    const usersResponse = await api.get('/admin/users');
    console.log('Users response:', JSON.stringify(usersResponse.data, null, 2));
    
    console.log('✅ Admin functions tested successfully!');
  } catch (error) {
    console.error('❌ Admin functions failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
  }
}

async function runTest() {
  console.log('🚀 Starting first user admin test...\n');
  
  const uniqueEmail = await clearDatabase();
  if (!uniqueEmail) {
    console.log('❌ Cannot proceed without unique email');
    return;
  }
  
  const adminToken = await testFirstUserAdmin(uniqueEmail);
  await testAdminFunctions(adminToken);
  
  console.log('\n🏁 Test completed!');
}

runTest().catch(console.error); 