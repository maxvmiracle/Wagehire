const axios = require('axios');

// Configuration
const API_BASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function testHealth() {
  console.log('🏥 Testing API health...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Health check successful!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Health check failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    return false;
  }
}

async function testRegistration() {
  console.log('\n👑 Testing registration...');
  
  try {
    const userData = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'TestUser123!',
      phone: '+1234567890',
      current_position: 'Test Position',
      experience_years: 1,
      skills: 'Testing'
    };

    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Registration successful!');
    console.log('Status:', response.status);
    console.log('User role:', response.data.user?.role);
    console.log('Is admin:', response.data.isAdmin);
    return true;
  } catch (error) {
    console.error('❌ Registration failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Running diagnostic tests...\n');
  
  const healthOk = await testHealth();
  if (healthOk) {
    await testRegistration();
  }
  
  console.log('\n🏁 Diagnostic tests completed!');
}

runTests().catch(console.error); 