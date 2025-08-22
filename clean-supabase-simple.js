const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://xzndkdqlsllwyygbniht.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcwNzY4MywiZXhwIjoyMDcxMjgzNjgzfQ.KQJrEg-zPQdgtHikT3wLO0JkQQV1kx8ngyJBAL-zS8k';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanAllData() {
  console.log('🧹 Cleaning All Supabase Data');
  console.log('==============================\n');

  try {
    // 1. Delete all interview feedback
    console.log('1. Deleting interview feedback...');
    const { error: feedbackError } = await supabase
      .from('interview_feedback')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (feedbackError) {
      console.log('❌ Error deleting feedback:', feedbackError.message);
    } else {
      console.log('✅ Interview feedback deleted');
    }

    // 2. Delete all interviews
    console.log('\n2. Deleting interviews...');
    const { error: interviewsError } = await supabase
      .from('interviews')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (interviewsError) {
      console.log('❌ Error deleting interviews:', interviewsError.message);
    } else {
      console.log('✅ Interviews deleted');
    }

    // 3. Delete all users
    console.log('\n3. Deleting users...');
    const { error: usersError } = await supabase
      .from('users')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (usersError) {
      console.log('❌ Error deleting users:', usersError.message);
    } else {
      console.log('✅ Users deleted');
    }

    // 4. Verify all tables are empty
    console.log('\n4. Verifying tables are empty...');
    
    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    const { count: interviewsCount } = await supabase
      .from('interviews')
      .select('*', { count: 'exact', head: true });
    
    const { count: feedbackCount } = await supabase
      .from('interview_feedback')
      .select('*', { count: 'exact', head: true });

    console.log('📊 Final Table Counts:');
    console.log('   Users:', usersCount || 0);
    console.log('   Interviews:', interviewsCount || 0);
    console.log('   Interview Feedback:', feedbackCount || 0);

    if (usersCount === 0 && interviewsCount === 0 && feedbackCount === 0) {
      console.log('\n🎉 SUCCESS: All Supabase data has been cleaned!');
      console.log('   - All users deleted');
      console.log('   - All interviews deleted');
      console.log('   - All feedback deleted');
      console.log('\n🔄 Next Steps:');
      console.log('   1. Register a new admin user (first user becomes admin)');
      console.log('   2. Test the "Unknown Candidate" fix');
      console.log('   3. Create new interviews to verify the fix works');
    } else {
      console.log('\n⚠️  WARNING: Some data may still exist');
      console.log('   You may need to manually clean the remaining data');
    }

  } catch (error) {
    console.error('\n❌ Error during data cleaning:', error.message);
    console.log('\n💡 If you get permission errors, make sure:');
    console.log('   - The service key is correct');
    console.log('   - The service key has proper permissions');
    console.log('   - The tables exist in your Supabase project');
  }
}

// Run the cleaning process
cleanAllData(); 