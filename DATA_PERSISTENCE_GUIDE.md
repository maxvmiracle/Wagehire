# Data Persistence Guide for Render Deployment

## Problem
The database data was being lost every time the site was updated because Render was using an in-memory SQLite database that gets reset on server restarts.

## Solution
We've implemented persistent data storage using Render's persistent disk feature.

## Changes Made

### 1. Updated Database Configuration
- **File**: `backend/database/db.js` and `backend/database/connection.js`
- **Change**: Switched from in-memory database (`:memory:`) to persistent file storage
- **Path**: `/opt/render/project/src/backend/database/wagehire.db`

### 2. Updated Render Configuration
- **File**: `render.yaml`
- **Change**: Added persistent disk configuration
- **Size**: 1GB persistent disk mounted at `/opt/render/project/src`

### 3. Added Backup System
- **File**: `backend/database/backup.js`
- **Features**:
  - Automatic backup creation on server startup
  - Automatic restore from backup if main database is missing
  - Manual backup/restore commands

### 4. Enhanced Server Startup
- **File**: `backend/server.js`
- **Change**: Added backup/restore logic during initialization

## How It Works

### Persistent Storage
- Render provides a persistent disk that survives server restarts and deployments
- Database file is stored at `/opt/render/project/src/backend/database/wagehire.db`
- Data persists across deployments and server restarts

### Backup System
- Creates automatic backups at `/opt/render/project/src/backend/database/wagehire.backup.db`
- If main database is lost, automatically restores from backup
- Provides manual backup/restore commands

### Automatic Recovery
1. Server starts
2. Checks if main database exists
3. If not, restores from backup
4. Creates new backup of current state
5. Initializes database schema
6. Runs migrations

## Usage

### Automatic (Recommended)
The system works automatically. No manual intervention required.

### Manual Commands
```bash
# Create backup
manage-database.bat backup

# Restore from backup
manage-database.bat restore

# Check database status
manage-database.bat status
```

### Direct Node Commands
```bash
cd backend

# Create backup
node database/backup.js backup

# Restore from backup
node database/backup.js restore

# Test database
node test-database.js
```

## Verification

### Check Data Persistence
1. Create some test data (users, interviews)
2. Deploy new version or restart server
3. Verify data is still present

### Monitor Logs
Check Render logs for:
- "Database backup/restore initialization completed"
- "Backup created successfully"
- "Database restored successfully"

## Benefits

✅ **Data Persistence**: Data survives server restarts and deployments
✅ **Automatic Recovery**: Self-healing system with backup/restore
✅ **No Data Loss**: Multiple layers of protection
✅ **Easy Management**: Simple commands for backup/restore
✅ **Production Ready**: Suitable for production use

## Troubleshooting

### If Data Still Gets Lost
1. Check Render logs for backup/restore messages
2. Verify persistent disk is properly configured
3. Check if backup files exist in the persistent directory

### If Backup/Restore Fails
1. Check file permissions in persistent directory
2. Verify disk space availability
3. Check database file integrity

### Manual Recovery
If automatic recovery fails:
1. Access Render shell
2. Navigate to `/opt/render/project/src/backend/database/`
3. Check for backup files
4. Manually restore if needed

## Deployment

The changes will be automatically deployed when you push to the repository. Render will:
1. Use the new persistent disk configuration
2. Initialize the backup system
3. Ensure data persistence across deployments

## Next Steps

1. **Deploy the changes** by pushing to the repository
2. **Test data persistence** by creating test data and redeploying
3. **Monitor logs** to ensure backup/restore is working
4. **Verify functionality** by testing the application

Your data should now persist across deployments! 🎉 