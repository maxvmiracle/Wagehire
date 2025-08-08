const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Use the same database path logic as connection.js
const getDbPath = () => {
  if (process.env.NODE_ENV === 'production') {
    // Use in-memory database for Vercel
    return ':memory:';
  }
  // Use file-based database for development
  return path.join(__dirname, 'wagehire.db');
};

const dbPath = getDbPath();
const db = new sqlite3.Database(dbPath);

async function initDatabase() {
  return new Promise((resolve, reject) => {
    console.log('Starting database initialization...');
    console.log(`Using database: ${dbPath}`);
    
    db.serialize(() => {
      // Drop existing tables to ensure clean schema
      db.run('DROP TABLE IF EXISTS interview_feedback');
      db.run('DROP TABLE IF EXISTS interviews');
      db.run('DROP TABLE IF EXISTS candidates');
      db.run('DROP TABLE IF EXISTS users');

      // Create users table (candidates) with updated role system
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'candidate',
          phone TEXT,
          resume_url TEXT,
          current_position TEXT,
          experience_years INTEGER,
          skills TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create interviews table for candidate's interview schedules
      db.run(`
        CREATE TABLE IF NOT EXISTS interviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          candidate_id INTEGER NOT NULL,
          company_name TEXT NOT NULL,
          job_title TEXT NOT NULL,
          scheduled_date DATETIME NOT NULL,
          duration INTEGER DEFAULT 60,
          status TEXT DEFAULT 'scheduled',
          interview_type TEXT DEFAULT 'technical',
          location TEXT,
          notes TEXT,
          company_website TEXT,
          company_linkedin_url TEXT,
          other_urls TEXT,
          job_description TEXT,
          salary_range TEXT,
          round_number INTEGER DEFAULT 1,
          interviewer_name TEXT,
          interviewer_email TEXT,
          interviewer_position TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (candidate_id) REFERENCES users (id)
        )
      `);

      // Create interview_feedback table for candidate's interview feedback
      db.run(`
        CREATE TABLE IF NOT EXISTS interview_feedback (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          interview_id INTEGER NOT NULL,
          candidate_id INTEGER NOT NULL,
          technical_skills INTEGER,
          communication_skills INTEGER,
          problem_solving INTEGER,
          cultural_fit INTEGER,
          overall_rating INTEGER,
          feedback_text TEXT,
          recommendation TEXT,
          received_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (interview_id) REFERENCES interviews (id),
          FOREIGN KEY (candidate_id) REFERENCES users (id)
        )
      `);

      console.log('Database tables created successfully');
      console.log('Database is ready for first user registration');
      resolve();
    });

    db.on('error', (err) => {
      console.error('Database error:', err);
      reject(err);
    });
  });
}

module.exports = initDatabase;

// If this file is run directly, initialize the database
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('Database initialization completed successfully');
      console.log('No sample data created - first user will be admin');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
} 