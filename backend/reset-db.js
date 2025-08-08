const fs = require('fs');
const path = require('path');
const initDatabase = require('./database/init');

async function resetDatabase() {
  try {
    // Delete the existing database file
    const dbPath = path.join(__dirname, 'database', 'wagehire.db');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('Deleted existing database file');
    }

    // Initialize the database with new schema
    await initDatabase();
    console.log('Database reset completed successfully');
  } catch (error) {
    console.error('Database reset failed:', error);
    process.exit(1);
  }
}

resetDatabase(); 