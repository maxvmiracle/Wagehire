# 👑 Admin First User Setup Guide

## 🎯 Overview
The system now automatically makes the first registered user an **admin** without requiring email verification. Subsequent users are **candidates** and require email verification.

## 🔄 How It Works

### First User (Admin)
1. **Registers** → Automatically becomes admin
2. **No email verification** → Can login immediately
3. **Full access** → Can manage the entire system
4. **Direct login** → Redirected to login page after registration

### Subsequent Users (Candidates)
1. **Register** → Become candidates
2. **Email verification required** → Must verify before login
3. **Manual verification** → Click verification link to confirm
4. **Limited access** → Can only access candidate features

## 🚀 Quick Start

### Step 1: Register First User (Admin)
1. Go to `http://172.86.90.139:3000/register`
2. Fill out registration form
3. **No verification needed** - account is immediately ready
4. Login with your credentials

### Step 2: Register Additional Users (Candidates)
1. Go to `http://172.86.90.139:3000/register`
2. Fill out registration form
3. **Verification required** - click verification link
4. Login after verification

## 📋 User Flow Comparison

### Admin User (First User)
```
Registration → Admin Account Created → Login → Dashboard
     ↓              ↓                    ↓         ↓
   Fill Form    No Verification     Enter Creds   Full Access
```

### Candidate Users (Subsequent Users)
```
Registration → Verification Link → Click Link → Login → Dashboard
     ↓              ↓                ↓           ↓         ↓
   Fill Form    Manual Verify    Confirm Email  Enter Creds  Limited Access
```

## 🔧 Technical Details

### Backend Logic
- **First User**: `email_verified = 1`, `role = 'admin'`
- **Subsequent Users**: `email_verified = 0`, `role = 'candidate'`, verification token generated

### Frontend Logic
- **Admin**: Redirected to login page with success message
- **Candidates**: Redirected to verification page with manual verification link

### Login Logic
- **Admin**: Can login without email verification
- **Candidates**: Must have `email_verified = 1` to login

## 🧪 Testing

### Test 1: Admin Registration
1. **Clear database** (if needed): Set `RESET_DB=true` in .env
2. **Register first user** → Should become admin
3. **Login immediately** → Should work without verification
4. **Check admin access** → Should have full permissions

### Test 2: Candidate Registration
1. **Register second user** → Should become candidate
2. **Verification required** → Should see verification link
3. **Click verification link** → Should verify account
4. **Login after verification** → Should work

### Test 3: Admin vs Candidate Access
1. **Admin login** → Full dashboard access
2. **Candidate login** → Limited dashboard access
3. **Check role-based features** → Different permissions

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'candidate',  -- 'admin' or 'candidate'
  email_verified BOOLEAN DEFAULT 0,        -- 1 for admin, 0 for candidates
  email_verification_token TEXT,           -- NULL for admin
  email_verification_expires DATETIME,     -- NULL for admin
  -- ... other fields
);
```

### Example Records
```sql
-- Admin (First User)
INSERT INTO users (email, password, name, role, email_verified) 
VALUES ('admin@example.com', 'hashed_password', 'Admin User', 'admin', 1);

-- Candidate (Subsequent User)
INSERT INTO users (email, password, name, role, email_verified, email_verification_token) 
VALUES ('candidate@example.com', 'hashed_password', 'Candidate User', 'candidate', 0, 'token123');
```

## 🔐 Security Features

### Admin Privileges
- **No email verification required**
- **Full system access**
- **Can manage other users**
- **Can access admin features**

### Candidate Restrictions
- **Email verification required**
- **Limited system access**
- **Cannot manage other users**
- **Candidate-only features**

## 🛠️ Troubleshooting

### Issue 1: First User Not Becoming Admin
**Solution:**
1. Check if database is empty: `SELECT COUNT(*) FROM users;`
2. Clear database if needed: Set `RESET_DB=true` in .env
3. Restart server and register again

### Issue 2: Admin Can't Login
**Solution:**
1. Check if `email_verified = 1` in database
2. Check if `role = 'admin'` in database
3. Verify login credentials

### Issue 3: Candidates Can't Verify
**Solution:**
1. Check verification token in database
2. Use manual verification tool: `npm run manual-verify`
3. Check if token is expired

## 📞 Commands

```bash
# Manual verification helper
npm run manual-verify

# Check database status
node -e "const { get } = require('./database/db'); get('SELECT COUNT(*) as count FROM users').then(result => console.log('User count:', result.count));"

# Reset database (if needed)
# Set RESET_DB=true in .env and restart server
```

## 🎯 Expected Results

### After Admin Registration
- ✅ Account created with admin role
- ✅ Email verified automatically
- ✅ Can login immediately
- ✅ Full system access

### After Candidate Registration
- ✅ Account created with candidate role
- ✅ Email verification required
- ✅ Manual verification link provided
- ✅ Can login after verification

## 📋 Checklist

- [ ] First user registers as admin
- [ ] Admin can login without verification
- [ ] Admin has full access
- [ ] Second user registers as candidate
- [ ] Candidate needs verification
- [ ] Verification link works
- [ ] Candidate can login after verification
- [ ] Role-based access works correctly

The system now properly handles the first user as an admin without email verification! 👑 