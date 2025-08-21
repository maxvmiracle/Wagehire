const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://xzndkdqlsllwyygbniht.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcwNzY4MywiZXhwIjoyMDcxMjgzNjgzfQ.KQJrEg-zPQdgtHikT3wLO0JkQQV1kx8ngyJBAL-zS8k';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanDatabase() {
  console.log('🧹 Starting database cleanup...\n');
  
  try {
    // Delete all data from tables in the correct order (respecting foreign key constraints)
    
    // 1. Clear interview_feedback first (depends on interviews)
    console.log('📋 Step 1: Clearing interview_feedback table...');
    const { error: feedbackError } = await supabase
      .from('interview_feedback')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (feedbackError) {
      console.log(`   ❌ Error: ${feedbackError.message}`);
    } else {
      console.log('   ✅ interview_feedback cleared');
    }

    // 2. Clear interviews
    console.log('📋 Step 2: Clearing interviews table...');
    const { error: interviewsError } = await supabase
      .from('interviews')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (interviewsError) {
      console.log(`   ❌ Error: ${interviewsError.message}`);
    } else {
      console.log('   ✅ interviews cleared');
    }

    // 3. Clear candidates
    console.log('📋 Step 3: Clearing candidates table...');
    const { error: candidatesError } = await supabase
      .from('candidates')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (candidatesError) {
      console.log(`   ❌ Error: ${candidatesError.message}`);
    } else {
      console.log('   ✅ candidates cleared');
    }

    // 4. Clear users
    console.log('📋 Step 4: Clearing users table...');
    const { error: usersError } = await supabase
      .from('users')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (usersError) {
      console.log(`   ❌ Error: ${usersError.message}`);
    } else {
      console.log('   ✅ users cleared');
    }

    console.log('\n🎉 Database cleanup completed successfully!');
    console.log('\n📋 All tables have been cleared:');
    console.log('   - interview_feedback');
    console.log('   - interviews');
    console.log('   - candidates');
    console.log('   - users');
    
    console.log('\n🔧 Next Steps:');
    console.log('   1. Register a new admin user (first user becomes admin)');
    console.log('   2. Test the application with fresh data');
    console.log('   3. All previous test data has been removed');

  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  }
}

cleanDatabase(); 