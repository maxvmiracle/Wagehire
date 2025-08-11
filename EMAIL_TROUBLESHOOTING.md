# Email Verification Troubleshooting Guide

This guide will help you fix email verification issues in Wagehire.

## 🚨 Quick Fix Steps

### Step 1: Set up Email Configuration
```bash
cd backend
npm run quick-email-setup
```

This will guide you through setting up your Gmail credentials.

### Step 2: Test Email Configuration
```bash
cd backend
node -e "require('dotenv').config(); const { verifyEmailConfig } = require('./services/emailService'); verifyEmailConfig().then(result => console.log('Email working:', result));"
```

### Step 3: Manual Verification (If Email Still Fails)
If email doesn't work, use the manual verification feature:
1. Go to the verification page
2. Click "Get Manual Verification Link"
3. Click the generated link to verify your email

## 🔧 Common Issues and Solutions

### Issue 1: "Email not configured" Error
**Symptoms:** Console shows "EMAIL_USER not configured"
**Solution:**
1. Run `npm run quick-email-setup`
2. Enter your Gmail address and App Password
3. Test the configuration

### Issue 2: "Authentication failed" Error
**Symptoms:** EAUTH error in console
**Solution:**
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password (not regular password)
3. Use the 16-character App Password

### Issue 3: "Connection failed" Error
**Symptoms:** ECONNECTION error in console
**Solution:**
1. Check internet connection
2. Verify EMAIL_HOST is `smtp.gmail.com`
3. Verify EMAIL_PORT is `587`

### Issue 4: Emails not received
**Symptoms:** Registration succeeds but no email arrives
**Solutions:**
1. Check spam/junk folder
2. Add sender to contacts
3. Use manual verification link
4. Check Gmail settings

## 📧 Gmail Setup Instructions

### 1. Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the setup process

### 2. Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other" as the device
4. Click "Generate"
5. Copy the 16-character password

### 3. Update .env File
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

## 🛠️ Manual Verification

If email verification fails, you can still verify your account:

### Method 1: Frontend Manual Verification
1. Go to verification page
2. Click "Get Manual Verification Link"
3. Click the generated link

### Method 2: Backend API
```bash
curl http://localhost:5000/api/auth/manual-verification/your-email@example.com
```

### Method 3: Direct URL
If you have the verification token, visit:
```
http://localhost:3000/verify-email?token=YOUR_TOKEN_HERE
```

## 🧪 Testing Email Configuration

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

### Test 3: Test Registration
1. Register a new user
2. Check console for email sending logs
3. Check if verification email arrives
4. Use manual verification if needed

## 🔍 Debug Information

### Check Server Logs
When you register a user, look for these messages in the console:

**Success:**
```
📧 Sending verification email to: user@example.com
✅ Email sent successfully to user@example.com
📨 Message ID: <message-id>
```

**Failure:**
```
⚠️  Email not configured. Please set EMAIL_USER and EMAIL_PASS
❌ Email sending error: [error details]
```

### Check Network Response
In browser developer tools, check the registration response:
```json
{
  "emailSent": true,  // Should be true if email worked
  "verificationUrl": "http://localhost:3000/verify-email?token=..."  // Manual verification URL
}
```

## 🆘 Still Having Issues?

### 1. Check .env File
Make sure your `.env` file exists and has correct values:
```env
EMAIL_USER=your-actual-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### 2. Restart Server
After updating .env file:
```bash
cd backend
npm start
```

### 3. Use Manual Verification
If email still doesn't work, use the manual verification feature - it will work regardless of email configuration.

### 4. Check Gmail Settings
- Ensure 2-Factor Authentication is enabled
- Use App Password, not regular password
- Check if Gmail blocks automated emails

## 📞 Support

If you continue to have issues:
1. Check the console logs for specific error messages
2. Verify your Gmail App Password is correct
3. Test with a different email address
4. Use manual verification as a fallback 