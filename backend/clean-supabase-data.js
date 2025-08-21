const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://xzndkdqlsllwyygbniht.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcwNzY4MywiZXhwIjoyMDcxMjgzNjgzfQ.KQJrEg-zPQdgtHikT3wLO0JkQQV1kx8ngyJBAL-zS8k';

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanDatabase() {
  console.log('🧹 Starting database cleanup...\n');

  try {
    // Delete in order of dependencies (child tables first)
    console.log('🗑️  Deleting interview feedback...');
    const { error: feedbackError } = await supabase
      .from('interview_feedback')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (feedbackError) {
      console.error('❌ Error deleting interview feedback:', feedbackError);
    } else {
      console.log('✅ Interview feedback deleted');
    }

    console.log('🗑️  Deleting interviews...');
    const { error: interviewsError } = await supabase
      .from('interviews')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (interviewsError) {
      console.error('❌ Error deleting interviews:', interviewsError);
    } else {
      console.log('✅ Interviews deleted');
    }

    console.log('🗑️  Deleting candidates...');
    const { error: candidatesError } = await supabase
      .from('candidates')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (candidatesError) {
      console.error('❌ Error deleting candidates:', candidatesError);
    } else {
      console.log('✅ Candidates deleted');
    }

    console.log('🗑️  Deleting users...');
    const { error: usersError } = await supabase
      .from('users')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (usersError) {
      console.error('❌ Error deleting users:', usersError);
    } else {
      console.log('✅ Users deleted');
    }

    console.log('\n🎉 Database cleanup completed successfully!');
    console.log('💡 You can now test the first user admin registration logic.');

  } catch (error) {
    console.error('❌ Unexpected error during cleanup:', error);
  }
}

async function verifyCleanup() {
  console.log('\n🔍 Verifying cleanup...');

  try {
    const [usersResult, candidatesResult, interviewsResult, feedbackResult] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('candidates').select('*', { count: 'exact', head: true }),
      supabase.from('interviews').select('*', { count: 'exact', head: true }),
      supabase.from('interview_feedback').select('*', { count: 'exact', head: true })
    ]);

    console.log('📊 Remaining records:');
    console.log(`   Users: ${usersResult.count || 0}`);
    console.log(`   Candidates: ${candidatesResult.count || 0}`);
    console.log(`   Interviews: ${interviewsResult.count || 0}`);
    console.log(`   Interview Feedback: ${feedbackResult.count || 0}`);

    const totalRecords = (usersResult.count || 0) + (candidatesResult.count || 0) + 
                        (interviewsResult.count || 0) + (feedbackResult.count || 0);

    if (totalRecords === 0) {
      console.log('✅ Database is completely clean!');
    } else {
      console.log('⚠️  Some records remain in the database.');
    }

  } catch (error) {
    console.error('❌ Error verifying cleanup:', error);
  }
}

async function main() {
  console.log('🚀 Supabase Database Cleanup Tool\n');
  
  await cleanDatabase();
  await verifyCleanup();
  
  console.log('\n🏁 Cleanup process completed!');
  console.log('💡 Next: Test user registration to verify first user becomes admin');
}

// Run the cleanup
main().catch(console.error); 