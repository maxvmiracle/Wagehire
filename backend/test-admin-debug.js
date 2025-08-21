const axios = require('axios');

// Configuration
const API_BASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';

async function testAdminDebug() {
  console.log('🔍 Debugging Admin Registration...\n');
  
  try {
    // Clean data first
    console.log('🧹 Cleaning data...');
    const { execSync } = require('child_process');
    execSync('node clean-supabase-data.js', { stdio: 'inherit' });
    
    // Register first user
    console.log('\n👑 Registering first user...');
    const userData = {
      name: 'Debug Admin',
      email: `debug-admin-${Date.now()}@example.com`,
      password: 'DebugAdmin123!',
      phone: '+1234567890',
      current_position: 'Debug Admin',
      experience_years: 5,
      skills: 'Debugging'
    };

    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Registration response:', JSON.stringify(response.data, null, 2));
    
    // Check if user is admin
    if (response.data.user.role === 'admin') {
      console.log('🎉 SUCCESS: First user is admin!');
      
      // Test admin dashboard
      console.log('\n📊 Testing admin dashboard...');
      const dashboardResponse = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'X-User-Token': response.data.token,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Admin dashboard working:', dashboardResponse.data);
      
    } else {
      console.log('❌ FAILED: First user is not admin!');
      console.log('Expected: admin, Got:', response.data.user.role);
    }
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testAdminDebug().catch(console.error); 