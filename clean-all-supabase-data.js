const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://xzndkdqlsllwyygbniht.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzE5NzI5OSwiZXhwIjoyMDUyNzczMjk5fQ.eW91ci1zZWNyZXQta2V5';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanAllSupabaseData() {
  console.log('🧹 Cleaning All Supabase Data');
  console.log('==============================\n');

  try {
    // 1. Clean interview feedback first (due to foreign key constraints)
    console.log('1. Cleaning interview_feedback table...');
    const { error: feedbackError } = await supabase
      .from('interview_feedback')
      .delete()
      .neq('id', 0); // Delete all records
    
    if (feedbackError) {
      console.log('❌ Error cleaning interview_feedback:', feedbackError.message);
    } else {
      console.log('✅ interview_feedback table cleaned');
    }

    // 2. Clean interviews table
    console.log('\n2. Cleaning interviews table...');
    const { error: interviewsError } = await supabase
      .from('interviews')
      .delete()
      .neq('id', 0); // Delete all records
    
    if (interviewsError) {
      console.log('❌ Error cleaning interviews:', interviewsError.message);
    } else {
      console.log('✅ interviews table cleaned');
    }

    // 3. Clean users table (except the first admin user if needed)
    console.log('\n3. Cleaning users table...');
    const { error: usersError } = await supabase
      .from('users')
      .delete()
      .neq('id', 0); // Delete all records
    
    if (usersError) {
      console.log('❌ Error cleaning users:', usersError.message);
    } else {
      console.log('✅ users table cleaned');
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
      console.log('\n✅ SUCCESS: All Supabase data has been cleaned!');
      console.log('   - All users deleted');
      console.log('   - All interviews deleted');
      console.log('   - All feedback deleted');
      console.log('\n🔄 Next Steps:');
      console.log('   1. Register a new admin user');
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
cleanAllSupabaseData(); 