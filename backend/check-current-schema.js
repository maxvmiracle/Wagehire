const axios = require('axios');

// Configuration
const SUPABASE_URL = 'https://xzndkdqlsllwyygbniht.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcwNzY4MywiZXhwIjoyMDcxMjgzNjgzfQ.KQJrEg-zPQdgtHikT3wLO0JkQQV1kx8ngyJBAL-zS8k';

async function checkCurrentSchema() {
  console.log('🔍 Checking Current Database Schema');
  console.log('====================================');

  try {
    // Check users table structure
    console.log('\n📋 Checking users table structure...');
    
    try {
      const response = await axios.get(`${SUPABASE_URL}/rest/v1/users?select=*&limit=1`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY
        }
      });
      
      if (response.data && response.data.length > 0) {
        const columns = Object.keys(response.data[0]);
        console.log('✅ Users table columns:');
        columns.forEach((column, index) => {
          console.log(`   ${index + 1}. ${column}`);
        });
        
        // Check for email verification fields
        const emailVerificationFields = [
          'email_verified',
          'email_verification_token',
          'email_verification_expires',
          'password_reset_token',
          'password_reset_expires'
        ];
        
        console.log('\n🔍 Email verification fields status:');
        emailVerificationFields.forEach(field => {
          if (columns.includes(field)) {
            console.log(`   ⚠️  ${field} - EXISTS`);
          } else {
            console.log(`   ✅ ${field} - REMOVED`);
          }
        });
      } else {
        console.log('📊 Users table is empty, checking structure via SQL...');
      }
    } catch (error) {
      console.error('❌ Could not check users table:', error.response?.data?.error || error.message);
    }

    // Check all tables
    console.log('\n📊 Checking all tables...');
    
    const tables = ['users', 'interviews', 'candidates', 'interview_feedback'];
    
    for (const table of tables) {
      try {
        const response = await axios.get(`${SUPABASE_URL}/rest/v1/${table}?select=count`, {
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY
          }
        });
        console.log(`✅ Table '${table}' is accessible`);
      } catch (error) {
        console.error(`❌ Table '${table}' access failed: ${error.response?.data?.error || error.message}`);
      }
    }

    // Test registration to see what happens
    console.log('\n🧪 Testing registration with current schema...');
    
    try {
      const testUser = {
        email: `test-schema-${Date.now()}@example.com`,
        password: 'TestPass123!',
        name: 'Test Schema User',
        phone: '1234567890',
        current_position: 'Software Engineer',
        experience_years: 3,
        skills: 'JavaScript, React, Node.js'
      };

      const response = await axios.post('https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api/auth/register', testUser, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Registration test successful!');
      console.log('   Response status:', response.status);
      console.log('   User created:', response.data.user ? 'Yes' : 'No');
      console.log('   Email verified:', response.data.user?.email_verified);
      
      // Clean up test user
      if (response.data.user?.id) {
        try {
          await axios.delete(`${SUPABASE_URL}/rest/v1/users?id=eq.${response.data.user.id}`, {
            headers: {
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'apikey': SUPABASE_SERVICE_ROLE_KEY
            }
          });
          console.log('   ✅ Test user cleaned up');
        } catch (cleanupError) {
          console.log('   ⚠️ Could not clean up test user');
        }
      }

    } catch (error) {
      console.error('❌ Registration test failed:');
      console.error('   Error:', error.response?.data?.error || error.message);
      console.error('   Status:', error.response?.status);
    }

    console.log('\n🎉 Schema check completed!');

  } catch (error) {
    console.error('\n❌ Failed to check schema:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('Request error - no response received');
    } else {
      console.error('Error details:', error);
    }
  }
}

// Run the script
checkCurrentSchema().catch(console.error); 