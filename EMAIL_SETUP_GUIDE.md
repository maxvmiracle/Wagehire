# Email Verification Setup Guide

This guide will help you fix the email verification issues in Wagehire.

## 🚨 Quick Fix

### Step 1: Set up Email Configuration
```bash
cd backend
npm run setup-email
```

This interactive script will:
- Guide you through Gmail setup
- Create your `.env` file
- Test the email configuration
- Provide manual verification options

### Step 2: Test Registration
1. Start your backend: `npm start`
2. Start your frontend: `cd ../frontend && npm start`
3. Register a new user
4. Check if verification email is received

## 🔧 Manual Setup

If the automated setup doesn't work, follow these steps:

### 1. Gmail Configuration

#### Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the setup process

#### Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other" as the device
4. Click "Generate"
5. Copy the 16-character password

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (for Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# Database Reset (set to 'true' to reset database on startup)
RESET_DB=false

# Node Environment
NODE_ENV=development
```

### 3. Test Email Configuration

```bash
cd backend
node -e "require('dotenv').config(); const { verifyEmailConfig } = require('./services/emailService'); verifyEmailConfig().then(result => console.log('Email working:', result));"
```

## 🛠️ Troubleshooting

### Issue 1: "Email not configured" Error
**Symptoms:** Console shows "EMAIL_USER not configured"
**Solution:**
1. Run `npm run setup-email`
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

## 🔄 Manual Verification

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

## 🧪 Testing

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
  "message": "Registration successful! Please check your email to verify your account.",
  "user": {...},
  "emailVerificationSent": true,
  "requiresVerification": true
}
```

## 📧 Email Templates

The verification email includes:
- Professional HTML template
- Verification button
- Manual link
- 24-hour expiration notice
- Branded styling

## 🔐 Security Notes

- App passwords are more secure than regular passwords
- Verification tokens expire after 24 hours
- Email verification is required for all non-admin users
- Manual verification is available as a fallback

## 🚀 Production Deployment

For production deployment:
1. Use a professional email service (SendGrid, Mailgun, etc.)
2. Update EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
3. Set FRONTEND_URL to your production domain
4. Use a strong JWT_SECRET
5. Set NODE_ENV=production

## 📞 Support

If you're still having issues:
1. Check the troubleshooting section above
2. Verify your Gmail settings
3. Test with manual verification
4. Check server logs for specific error messages 