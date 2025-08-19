// Test script to verify Supabase connection
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://stgtlwqszoxpquikadwn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Z3Rsd3Fzem94cHF1aWthZHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzE2NTcsImV4cCI6MjA3MTIwNzY1N30.qE9hG1RAMQfjHvgbDrCf6gm3SOOvax2Ug0GJCPDBnA4';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test 1: Check if we can connect to Supabase
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log('   ⚠️  Connection test result:', error.message);
      console.log('   ℹ️  This might be expected if tables don\'t exist yet');
    } else {
      console.log('   ✅ Connection successful!');
    }

    // Test 2: Check if tables exist
    console.log('\n2. Checking database tables...');
    
    const tables = ['users', 'candidates', 'interviews', 'interview_submissions'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          console.log(`   ❌ Table '${table}': ${error.message}`);
        } else {
          console.log(`   ✅ Table '${table}': Exists`);
        }
      } catch (err) {
        console.log(`   ❌ Table '${table}': ${err.message}`);
      }
    }

    // Test 3: Check authentication
    console.log('\n3. Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('   ❌ Authentication test failed:', authError.message);
    } else {
      console.log('   ✅ Authentication working (no active session)');
    }

    console.log('\n🎉 Supabase connection test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Make sure you\'ve run the database schema in Supabase SQL Editor');
    console.log('2. Configure authentication settings in Supabase Dashboard');
    console.log('3. Test user registration and login in your app');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSupabaseConnection(); 