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

// Ensure directory exists
const ensureDirectoryExists = (filePath) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    } catch (error) {
      console.error(`Failed to create directory ${dir}:`, error.message);
    }
  }
};

// Create backup of the database
async function createBackup() {
  return new Promise((resolve, reject) => {
    const dbPath = getDbPath();
    const backupPath = getBackupPath();
    
    console.log(`Creating backup from ${dbPath} to ${backupPath}`);
    
    // Ensure directories exist
    ensureDirectoryExists(dbPath);
    ensureDirectoryExists(backupPath);
    
    // Check if source database exists
    if (!fs.existsSync(dbPath)) {
      console.log('Source database does not exist, skipping backup');
      resolve();
      return;
    }
    
    // Check if source database is accessible
    try {
      const stats = fs.statSync(dbPath);
      if (stats.size === 0) {
        console.log('Source database is empty, skipping backup');
        resolve();
        return;
      }
    } catch (error) {
      console.log('Cannot access source database, skipping backup:', error.message);
      resolve();
      return;
    }
    
    let sourceDb = null;
    let backupDb = null;
    
    try {
      sourceDb = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
      backupDb = new sqlite3.Database(backupPath);
      
      sourceDb.backup(backupDb, (err) => {
        if (err) {
          console.error('Backup failed:', err.message);
          // Don't reject, just log the error and continue
          console.log('Continuing without backup...');
        } else {
          console.log('Backup created successfully');
        }
        
        // Always close connections
        if (sourceDb) {
          sourceDb.close((closeErr) => {
            if (closeErr) console.error('Error closing source database:', closeErr.message);
          });
        }
        if (backupDb) {
          backupDb.close((closeErr) => {
            if (closeErr) console.error('Error closing backup database:', closeErr.message);
          });
        }
        
        resolve();
      });
    } catch (error) {
      console.error('Error creating backup:', error.message);
      // Close connections if they exist
      if (sourceDb) {
        sourceDb.close();
      }
      if (backupDb) {
        backupDb.close();
      }
      // Don't reject, just continue
      resolve();
    }
  });
}

// Restore database from backup
async function restoreFromBackup() {
  return new Promise((resolve, reject) => {
    const dbPath = getDbPath();
    const backupPath = getBackupPath();
    
    console.log(`Restoring from ${backupPath} to ${dbPath}`);
    
    // Ensure directories exist
    ensureDirectoryExists(dbPath);
    ensureDirectoryExists(backupPath);
    
    // Check if backup exists
    if (!fs.existsSync(backupPath)) {
      console.log('No backup found, skipping restore');
      resolve();
      return;
    }
    
    // Check if backup is accessible
    try {
      const stats = fs.statSync(backupPath);
      if (stats.size === 0) {
        console.log('Backup file is empty, skipping restore');
        resolve();
        return;
      }
    } catch (error) {
      console.log('Cannot access backup file, skipping restore:', error.message);
      resolve();
      return;
    }
    
    let backupDb = null;
    let targetDb = null;
    
    try {
      backupDb = new sqlite3.Database(backupPath, sqlite3.OPEN_READONLY);
      targetDb = new sqlite3.Database(dbPath);
      
      backupDb.backup(targetDb, (err) => {
        if (err) {
          console.error('Restore failed:', err.message);
          // Don't reject, just log the error and continue
          console.log('Continuing without restore...');
        } else {
          console.log('Database restored successfully');
        }
        
        // Always close connections
        if (backupDb) {
          backupDb.close((closeErr) => {
            if (closeErr) console.error('Error closing backup database:', closeErr.message);
          });
        }
        if (targetDb) {
          targetDb.close((closeErr) => {
            if (closeErr) console.error('Error closing target database:', closeErr.message);
          });
        }
        
        resolve();
      });
    } catch (error) {
      console.error('Error restoring database:', error.message);
      // Close connections if they exist
      if (backupDb) {
        backupDb.close();
      }
      if (targetDb) {
        targetDb.close();
      }
      // Don't reject, just continue
      resolve();
    }
  });
}

// Initialize database with backup/restore logic
async function initializeDatabaseWithBackup() {
  try {
    console.log('Starting database backup/restore initialization...');
    
    const dbPath = getDbPath();
    const backupPath = getBackupPath();
    
    // Ensure directories exist
    ensureDirectoryExists(dbPath);
    ensureDirectoryExists(backupPath);
    
    // If main database doesn't exist but backup does, restore from backup
    if (!fs.existsSync(dbPath) && fs.existsSync(backupPath)) {
      console.log('Main database not found, restoring from backup...');
      await restoreFromBackup();
    }
    
    // Create backup of current database (if it exists)
    if (fs.existsSync(dbPath)) {
      console.log('Creating backup of current database...');
      await createBackup();
    }
    
    console.log('Database backup/restore initialization completed');
  } catch (error) {
    console.error('Database backup/restore error:', error.message);
    // Don't throw error, just log it and continue
    console.log('Continuing without backup/restore functionality...');
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
          console.error('Backup failed:', error.message);
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
          console.error('Restore failed:', error.message);
          process.exit(1);
        });
      break;
      
    default:
      console.log('Usage: node backup.js [backup|restore]');
      process.exit(1);
  }
} 