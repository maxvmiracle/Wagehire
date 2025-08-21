const axios = require('axios');

// Configuration
const API_BASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function testProfileEndpoint() {
  console.log('👤 Testing profile endpoint...');
  
  try {
    // First, register a user to get a token
    const userData = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'TestUser123!',
      phone: '+1234567890',
      current_position: 'Test Position',
      experience_years: 1,
      skills: 'Testing'
    };

    console.log('📝 Registering user...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, userData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const token = registerResponse.data.token;
    console.log('✅ Registration successful, token received');
    
    // Test profile endpoint with token
    console.log('🔍 Testing profile endpoint...');
    const profileResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': token,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Profile endpoint successful!');
    console.log('Profile data:', JSON.stringify(profileResponse.data, null, 2));
    
    // Test update profile
    console.log('✏️ Testing profile update...');
    const updateData = {
      phone: '+0987654321',
      current_position: 'Updated Position',
      experience_years: 2,
      skills: 'Updated Skills'
    };
    
    const updateResponse = await axios.put(`${API_BASE_URL}/users/profile`, updateData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'X-User-Token': token,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Profile update successful!');
    console.log('Updated profile:', JSON.stringify(updateResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testProfileEndpoint().catch(console.error); 