const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const getDbPath = () => {
  if (process.env.NODE_ENV === 'production') {
    // Use in-memory database for Vercel
    return ':memory:';
  }
  // Use file-based database for development
  return path.join(__dirname, 'database', 'wagehire.db');
};

const dbPath = getDbPath();

async function migrateDatabase() {
  return new Promise((resolve, reject) => {
    console.log('Starting database migration...');
    console.log(`Database path: ${dbPath}`);
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Connected to database for migration');
    });

    db.serialize(() => {
      // Check if interview_type column exists in interviews table
      db.get("PRAGMA table_info(interviews)", (err, rows) => {
        if (err) {
          console.error('Error checking interviews table schema:', err);
          reject(err);
          return;
        }
        
        db.all("PRAGMA table_info(interviews)", (err, columns) => {
          if (err) {
            console.error('Error getting interviews table columns:', err);
            reject(err);
            return;
          }
          
          const columnNames = columns.map(col => col.name);
          console.log('Current interviews table columns:', columnNames);
          
          // Add missing columns to interviews table
          const missingColumns = [];
          
          if (!columnNames.includes('interview_type')) {
            missingColumns.push('interview_type TEXT DEFAULT "technical"');
          }
          
          if (!columnNames.includes('interviewer_linkedin_url')) {
            missingColumns.push('interviewer_linkedin_url TEXT');
          }
          
          if (missingColumns.length > 0) {
            console.log('Adding missing columns to interviews table:', missingColumns);
            missingColumns.forEach(columnDef => {
              const columnName = columnDef.split(' ')[0];
              db.run(`ALTER TABLE interviews ADD COLUMN ${columnDef}`, (err) => {
                if (err) {
                  console.error(`Error adding column ${columnName}:`, err);
                } else {
                  console.log(`Successfully added column: ${columnName}`);
                }
              });
            });
          } else {
            console.log('All required columns already exist in interviews table');
          }
          
          // Check users table columns
          db.all("PRAGMA table_info(users)", (err, userColumns) => {
            if (err) {
              console.error('Error getting users table columns:', err);
              reject(err);
              return;
            }
            
            const userColumnNames = userColumns.map(col => col.name);
            console.log('Current users table columns:', userColumnNames);
            
            // Add missing columns to users table
            const missingUserColumns = [];
            
            if (!userColumnNames.includes('password_reset_token')) {
              missingUserColumns.push('password_reset_token TEXT');
            }
            
            if (!userColumnNames.includes('password_reset_expires')) {
              missingUserColumns.push('password_reset_expires DATETIME');
            }
            
            if (missingUserColumns.length > 0) {
              console.log('Adding missing columns to users table:', missingUserColumns);
              missingUserColumns.forEach(columnDef => {
                const columnName = columnDef.split(' ')[0];
                db.run(`ALTER TABLE users ADD COLUMN ${columnDef}`, (err) => {
                  if (err) {
                    console.error(`Error adding column ${columnName}:`, err);
                  } else {
                    console.log(`Successfully added column: ${columnName}`);
                  }
                });
              });
            } else {
              console.log('All required columns already exist in users table');
            }
            
            // Close database connection
            db.close((err) => {
              if (err) {
                console.error('Error closing database:', err);
                reject(err);
              } else {
                console.log('Database migration completed successfully');
                resolve();
              }
            });
          });
        });
      });
    });
  });
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateDatabase()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = migrateDatabase; 