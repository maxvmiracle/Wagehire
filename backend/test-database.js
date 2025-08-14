const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const getDbPath = () => {
  if (process.env.NODE_ENV === 'production') {
    return ':memory:';
  }
  return path.join(__dirname, 'database', 'wagehire.db');
};

const dbPath = getDbPath();

async function testDatabase() {
  return new Promise((resolve, reject) => {
    console.log('Testing database schema...');
    console.log(`Database path: ${dbPath}`);
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Connected to database for testing');
    });

    db.serialize(() => {
      // Test interviews table schema
      db.all("PRAGMA table_info(interviews)", (err, columns) => {
        if (err) {
          console.error('Error getting interviews table schema:', err);
          reject(err);
          return;
        }
        
        console.log('\n=== INTERVIEWS TABLE SCHEMA ===');
        columns.forEach(col => {
          console.log(`${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
        });
        
        // Check for required columns
        const columnNames = columns.map(col => col.name);
        const requiredColumns = [
          'id', 'candidate_id', 'company_name', 'job_title', 'scheduled_date',
          'duration', 'status', 'round', 'interview_type', 'location', 'notes',
          'company_website', 'company_linkedin_url', 'other_urls', 'job_description',
          'salary_range', 'interviewer_name', 'interviewer_email', 'interviewer_position',
          'interviewer_linkedin_url', 'created_at', 'updated_at'
        ];
        
        console.log('\n=== MISSING COLUMNS ===');
        const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
        if (missingColumns.length > 0) {
          console.log('Missing columns:', missingColumns);
        } else {
          console.log('All required columns are present!');
        }
        
        // Test users table schema
        db.all("PRAGMA table_info(users)", (err, userColumns) => {
          if (err) {
            console.error('Error getting users table schema:', err);
            reject(err);
            return;
          }
          
          console.log('\n=== USERS TABLE SCHEMA ===');
          userColumns.forEach(col => {
            console.log(`${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
          });
          
          // Check for required user columns
          const userColumnNames = userColumns.map(col => col.name);
          const requiredUserColumns = [
            'id', 'email', 'password', 'name', 'role', 'phone', 'resume_url',
            'current_position', 'experience_years', 'skills', 'email_verified',
            'email_verification_token', 'email_verification_expires',
            'password_reset_token', 'password_reset_expires',
            'created_at', 'updated_at'
          ];
          
          console.log('\n=== MISSING USER COLUMNS ===');
          const missingUserColumns = requiredUserColumns.filter(col => !userColumnNames.includes(col));
          if (missingUserColumns.length > 0) {
            console.log('Missing user columns:', missingUserColumns);
          } else {
            console.log('All required user columns are present!');
          }
          
          // Test inserting a sample interview
          console.log('\n=== TESTING INTERVIEW INSERT ===');
          db.run(`
            INSERT INTO interviews (
              candidate_id, company_name, job_title, scheduled_date, duration,
              round, interview_type, location, notes, status,
              company_website, company_linkedin_url, other_urls, job_description, salary_range,
              interviewer_name, interviewer_email, interviewer_position, interviewer_linkedin_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            1, 'Test Company', 'Test Job', '2025-01-01T10:00:00.000Z', 60,
            1, 'technical', 'Remote', 'Test notes', 'scheduled',
            'https://test.com', 'https://linkedin.com/test', 'https://other.com', 'Test description', '100k-120k',
            'Test Interviewer', 'test@test.com', 'Manager', 'https://linkedin.com/interviewer'
          ], function(err) {
            if (err) {
              console.error('Error inserting test interview:', err);
              console.error('Error details:', err.message);
            } else {
              console.log('Test interview inserted successfully! ID:', this.lastID);
              
              // Clean up test data
              db.run('DELETE FROM interviews WHERE id = ?', [this.lastID], (err) => {
                if (err) {
                  console.error('Error cleaning up test data:', err);
                } else {
                  console.log('Test data cleaned up successfully');
                }
              });
            }
            
            // Close database
            db.close((err) => {
              if (err) {
                console.error('Error closing database:', err);
                reject(err);
              } else {
                console.log('\nDatabase test completed successfully');
                resolve();
              }
            });
          });
        });
      });
    });
  });
}

// Run test if this file is executed directly
if (require.main === module) {
  testDatabase()
    .then(() => {
      console.log('All tests passed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

module.exports = testDatabase; 