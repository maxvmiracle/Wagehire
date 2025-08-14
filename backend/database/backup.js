const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const getDbPath = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/opt/render/project/src/backend/database/wagehire.db';
  }
  return path.join(__dirname, 'wagehire.db');
};

const getBackupPath = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/opt/render/project/src/backend/database/wagehire.backup.db';
  }
  return path.join(__dirname, 'wagehire.backup.db');
};

// Create backup of the database
async function createBackup() {
  return new Promise((resolve, reject) => {
    const dbPath = getDbPath();
    const backupPath = getBackupPath();
    
    console.log(`Creating backup from ${dbPath} to ${backupPath}`);
    
    // Check if source database exists
    if (!fs.existsSync(dbPath)) {
      console.log('Source database does not exist, skipping backup');
      resolve();
      return;
    }
    
    const sourceDb = new sqlite3.Database(dbPath);
    const backupDb = new sqlite3.Database(backupPath);
    
    sourceDb.backup(backupDb, (err) => {
      if (err) {
        console.error('Backup failed:', err);
        reject(err);
      } else {
        console.log('Backup created successfully');
        resolve();
      }
      
      sourceDb.close();
      backupDb.close();
    });
  });
}

// Restore database from backup
async function restoreFromBackup() {
  return new Promise((resolve, reject) => {
    const dbPath = getDbPath();
    const backupPath = getBackupPath();
    
    console.log(`Restoring from ${backupPath} to ${dbPath}`);
    
    // Check if backup exists
    if (!fs.existsSync(backupPath)) {
      console.log('No backup found, skipping restore');
      resolve();
      return;
    }
    
    const backupDb = new sqlite3.Database(backupPath);
    const targetDb = new sqlite3.Database(dbPath);
    
    backupDb.backup(targetDb, (err) => {
      if (err) {
        console.error('Restore failed:', err);
        reject(err);
      } else {
        console.log('Database restored successfully');
        resolve();
      }
      
      backupDb.close();
      targetDb.close();
    });
  });
}

// Initialize database with backup/restore logic
async function initializeDatabaseWithBackup() {
  try {
    const dbPath = getDbPath();
    
    // If main database doesn't exist but backup does, restore from backup
    if (!fs.existsSync(dbPath) && fs.existsSync(getBackupPath())) {
      console.log('Main database not found, restoring from backup...');
      await restoreFromBackup();
    }
    
    // Create backup of current database
    if (fs.existsSync(dbPath)) {
      console.log('Creating backup of current database...');
      await createBackup();
    }
    
    console.log('Database initialization with backup completed');
  } catch (error) {
    console.error('Database backup/restore error:', error);
  }
}

// Export functions
module.exports = {
  createBackup,
  restoreFromBackup,
  initializeDatabaseWithBackup
};

// Run if this file is executed directly
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'backup':
      createBackup()
        .then(() => {
          console.log('Backup completed successfully');
          process.exit(0);
        })
        .catch((error) => {
          console.error('Backup failed:', error);
          process.exit(1);
        });
      break;
      
    case 'restore':
      restoreFromBackup()
        .then(() => {
          console.log('Restore completed successfully');
          process.exit(0);
        })
        .catch((error) => {
          console.error('Restore failed:', error);
          process.exit(1);
        });
      break;
      
    default:
      console.log('Usage: node backup.js [backup|restore]');
      process.exit(1);
  }
} 