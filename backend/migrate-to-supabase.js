const sqlite3 = require('sqlite3').verbose();
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config();

// SQLite database connection
const dbPath = path.join(__dirname, 'database', 'wagehire.db');
const sqliteDb = new sqlite3.Database(dbPath);

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  console.log('🚀 Starting migration from SQLite to Supabase...\n');

  try {
    // Migrate users
    await migrateUsers();
    
    // Migrate candidates
    await migrateCandidates();
    
    // Migrate interviews
    await migrateInterviews();
    
    // Migrate interview submissions
    await migrateInterviewSubmissions();
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
  } finally {
    sqliteDb.close();
  }
}

async function migrateUsers() {
  console.log('📦 Migrating users...');
  
  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM users', async (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (rows.length === 0) {
        console.log('   No users to migrate');
        resolve();
        return;
      }
      
      for (const user of rows) {
        try {
          // Create user in Supabase auth
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: user.email,
            password: 'temporary-password-123', // Users will need to reset password
            email_confirm: true,
            user_metadata: {
              name: user.name,
              role: user.role
            }
          });
          
          if (authError) {
            console.log(`   ⚠️  User ${user.email} already exists or error:`, authError.message);
            continue;
          }
          
          // Update the users table with the auth user ID
          const { error: updateError } = await supabase
            .from('users')
            .update({ id: authData.user.id })
            .eq('email', user.email);
          
          if (updateError) {
            console.log(`   ⚠️  Error updating user ${user.email}:`, updateError.message);
          } else {
            console.log(`   ✅ Migrated user: ${user.email}`);
          }
          
        } catch (error) {
          console.log(`   ⚠️  Error migrating user ${user.email}:`, error.message);
        }
      }
      
      resolve();
    });
  });
}

async function migrateCandidates() {
  console.log('📦 Migrating candidates...');
  
  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM candidates', async (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (rows.length === 0) {
        console.log('   No candidates to migrate');
        resolve();
        return;
      }
      
      for (const candidate of rows) {
        try {
          const { error } = await supabase
            .from('candidates')
            .insert({
              name: candidate.name,
              email: candidate.email,
              phone: candidate.phone,
              resume_url: candidate.resume_url,
              status: candidate.status,
              created_at: candidate.created_at,
              updated_at: candidate.updated_at
            });
          
          if (error) {
            console.log(`   ⚠️  Error migrating candidate ${candidate.email}:`, error.message);
          } else {
            console.log(`   ✅ Migrated candidate: ${candidate.email}`);
          }
          
        } catch (error) {
          console.log(`   ⚠️  Error migrating candidate ${candidate.email}:`, error.message);
        }
      }
      
      resolve();
    });
  });
}

async function migrateInterviews() {
  console.log('📦 Migrating interviews...');
  
  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM interviews', async (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (rows.length === 0) {
        console.log('   No interviews to migrate');
        resolve();
        return;
      }
      
      for (const interview of rows) {
        try {
          // Get candidate ID from Supabase
          const { data: candidateData } = await supabase
            .from('candidates')
            .select('id')
            .eq('email', interview.candidate_email)
            .single();
          
          // Get interviewer ID from Supabase
          const { data: interviewerData } = await supabase
            .from('users')
            .select('id')
            .eq('email', interview.interviewer_email)
            .single();
          
          const { error } = await supabase
            .from('interviews')
            .insert({
              candidate_id: candidateData?.id,
              interviewer_id: interviewerData?.id,
              scheduled_date: interview.scheduled_date,
              duration: interview.duration,
              status: interview.status,
              notes: interview.notes,
              feedback: interview.feedback,
              created_at: interview.created_at,
              updated_at: interview.updated_at
            });
          
          if (error) {
            console.log(`   ⚠️  Error migrating interview ${interview.id}:`, error.message);
          } else {
            console.log(`   ✅ Migrated interview: ${interview.id}`);
          }
          
        } catch (error) {
          console.log(`   ⚠️  Error migrating interview ${interview.id}:`, error.message);
        }
      }
      
      resolve();
    });
  });
}

async function migrateInterviewSubmissions() {
  console.log('📦 Migrating interview submissions...');
  
  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM interview_submissions', async (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (rows.length === 0) {
        console.log('   No interview submissions to migrate');
        resolve();
        return;
      }
      
      for (const submission of rows) {
        try {
          // Get interview ID from Supabase (you might need to map this based on your data)
          const { data: interviewData } = await supabase
            .from('interviews')
            .select('id')
            .eq('candidate_id', submission.candidate_id)
            .single();
          
          // Get candidate ID from Supabase
          const { data: candidateData } = await supabase
            .from('candidates')
            .select('id')
            .eq('email', submission.candidate_email)
            .single();
          
          const { error } = await supabase
            .from('interview_submissions')
            .insert({
              interview_id: interviewData?.id,
              candidate_id: candidateData?.id,
              submission_data: submission.submission_data,
              submitted_at: submission.submitted_at
            });
          
          if (error) {
            console.log(`   ⚠️  Error migrating submission ${submission.id}:`, error.message);
          } else {
            console.log(`   ✅ Migrated submission: ${submission.id}`);
          }
          
        } catch (error) {
          console.log(`   ⚠️  Error migrating submission ${submission.id}:`, error.message);
        }
      }
      
      resolve();
    });
  });
}

// Helper function to check if tables exist
function checkTables() {
  return new Promise((resolve, reject) => {
    sqliteDb.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      const tableNames = rows.map(row => row.name);
      console.log('📋 Found tables:', tableNames.join(', '));
      resolve(tableNames);
    });
  });
}

// Main execution
async function main() {
  console.log('🔍 Checking SQLite database...');
  
  try {
    const tables = await checkTables();
    
    if (!tables.includes('users')) {
      console.log('❌ Users table not found. Please ensure your SQLite database is properly set up.');
      return;
    }
    
    // Check environment variables
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('❌ Missing environment variables:');
      console.log('   - SUPABASE_URL');
      console.log('   - SUPABASE_SERVICE_ROLE_KEY');
      console.log('\nPlease add these to your .env file');
      return;
    }
    
    await migrateData();
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
  }
}

// Run migration
if (require.main === module) {
  main();
}

module.exports = { migrateData }; 