# 🔧 Fix Email Verification for Candidates

## 🚨 Current Issue
Candidates are trying to register but not receiving email verification links. The email configuration is incomplete.

## 🔍 Problem Analysis
- EMAIL_USER is set: `maaxvman92@gmail.com`
- EMAIL_PASS is missing: This is why emails aren't being sent
- Gmail App Password needs to be configured

## 🛠️ Step-by-Step Fix

### Step 1: Set up Gmail App Password

#### 1.1 Enable 2-Factor Authentication
1. Go to: https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the setup process if not already enabled

#### 1.2 Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other" as the device
4. Click "Generate"
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Update Environment Configuration

Create or update the `.env` file in the `backend` directory:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (for Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=maaxvman92@gmail.com
EMAIL_PASS=YOUR_16_CHARACTER_APP_PASSWORD_HERE

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# Database Reset (set to 'true' to reset database on startup)
RESET_DB=false

# Node Environment
NODE_ENV=development
```

**Replace `YOUR_16_CHARACTER_APP_PASSWORD_HERE` with the actual 16-character app password from Step 1.2**

### Step 3: Test Email Configuration

Run this command to test if email is working:

```bash
cd backend
node test-email.js
```

### Step 4: Restart the Server

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm start
```

### Step 5: Test Registration

1. Go to http://localhost:3000/register
2. Register a new candidate
3. Check if verification email is received
4. If email fails, use manual verification

## 🔄 Manual Verification (Fallback)

If email still doesn't work, candidates can use manual verification:

### Method 1: Frontend Manual Verification
1. After registration, go to verification page
2. Click "Get Manual Verification Link"
3. Click the generated link to verify

### Method 2: Backend API
```bash
curl http://localhost:5000/api/auth/manual-verification/candidate-email@example.com
```

### Method 3: Direct URL
If you have the verification token, visit:
```
http://localhost:3000/verify-email?token=YOUR_TOKEN_HERE
```

## 🧪 Testing Commands

### Test 1: Check Environment Variables
```bash
cd backend
node -e "require('dotenv').config(); console.log('EMAIL_USER:', process.env.EMAIL_USER); console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');"
```

### Test 2: Test Email Service
```bash
cd backend
node -e "require('dotenv').config(); const { verifyEmailConfig } = require('./services/emailService'); verifyEmailConfig().then(result => console.log('Email working:', result));"
```

### Test 3: Test Registration Flow
```bash
cd backend
node test-email.js
```

## 🚨 Common Issues & Solutions

### Issue 1: "Authentication failed" Error
**Solution:**
- Ensure 2-Factor Authentication is enabled
- Use App Password, not regular Gmail password
- Double-check the 16-character app password

### Issue 2: "Connection failed" Error
**Solution:**
- Check internet connection
- Verify EMAIL_HOST is `smtp.gmail.com`
- Verify EMAIL_PORT is `587`

### Issue 3: Emails not received
**Solutions:**
- Check spam/junk folder
- Add sender to contacts
- Use manual verification as fallback

### Issue 4: Manual verification not working
**Solutions:**
- Check token expiration (24 hours)
- Ensure token is valid
- Try resending verification email

## 📧 Email Configuration Checklist

- [ ] 2-Factor Authentication enabled on Gmail
- [ ] App Password generated (16 characters)
- [ ] .env file created in backend directory
- [ ] EMAIL_USER set correctly
- [ ] EMAIL_PASS set with app password
- [ ] EMAIL_HOST = smtp.gmail.com
- [ ] EMAIL_PORT = 587
- [ ] Server restarted after configuration
- [ ] Email test successful

## 🎯 Expected Results

After fixing the configuration:

1. **Registration**: Candidates can register successfully
2. **Email Verification**: Verification emails are sent automatically
3. **Manual Fallback**: Manual verification works if email fails
4. **Login**: Verified candidates can login
5. **Security**: Unverified candidates cannot login

## 📞 Quick Fix Script

If you want to automate the setup, run:

```bash
cd backend
node setup-email.js
```

This will guide you through the setup process interactively.

## 🔍 Debug Information

### Check Server Logs
When a candidate registers, look for:
```
📧 Sending verification email to: candidate@example.com
✅ Email sent successfully to candidate@example.com
```

### Check Network Response
In browser developer tools, registration should return:
```json
{
  "message": "Registration successful! Please check your email to verify your account.",
  "emailVerificationSent": true,
  "requiresVerification": true
}
```

## 🚀 Next Steps

1. Follow the step-by-step fix above
2. Test with a new candidate registration
3. Verify email delivery
4. Test manual verification if needed
5. Ensure candidates can login after verification

## 📞 Support

If you're still having issues:
1. Check the troubleshooting section
2. Verify Gmail settings
3. Test with manual verification
4. Check server logs for specific errors 