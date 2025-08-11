# 🚨 Candidate Email Verification Fix

## 🔍 Problem Identified
Candidates are trying to register but not receiving email verification links because:
- EMAIL_USER is set: `maaxvman92@gmail.com`
- EMAIL_PASS is missing (Gmail App Password not configured)
- Email service cannot authenticate with Gmail

## 🛠️ Quick Fix Solution

### Option 1: Automated Fix (Recommended)
```bash
cd backend
npm run fix-email
```

This will:
1. Guide you through Gmail App Password setup
2. Create/update the .env file
3. Test the email configuration
4. Provide next steps

### Option 2: Manual Fix

#### Step 1: Set up Gmail App Password
1. Go to: https://myaccount.google.com/security
2. Enable "2-Step Verification" if not already enabled
3. Go to: https://myaccount.google.com/apppasswords
4. Select "Mail" and "Other"
5. Click "Generate" and copy the 16-character password

#### Step 2: Create .env file
Create a file named `.env` in the `backend` directory with this content:

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

**Replace `YOUR_16_CHARACTER_APP_PASSWORD_HERE` with your actual app password**

#### Step 3: Test Configuration
```bash
cd backend
npm run test-email
```

#### Step 4: Restart Server
```bash
npm start
```

## 🔄 Manual Verification (Immediate Solution)

If email still doesn't work, use manual verification for existing candidates:

### Method 1: Command Line Tool
```bash
cd backend
npm run manual-verify
```

This will:
- Show all unverified candidates
- Provide manual verification URLs
- Allow you to verify candidates directly

### Method 2: Frontend Manual Verification
1. After registration, candidates see manual verification option
2. Click "Get Manual Verification Link"
3. Click the generated link to verify

### Method 3: Direct API Call
```bash
curl http://localhost:5000/api/auth/manual-verification/candidate-email@example.com
```

## 🧪 Testing the Fix

### Test 1: Check Environment
```bash
cd backend
node -e "require('dotenv').config(); console.log('EMAIL_USER:', process.env.EMAIL_USER); console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');"
```

### Test 2: Test Email Service
```bash
cd backend
npm run test-email
```

### Test 3: Test Registration
1. Go to http://localhost:3000/register
2. Register a new candidate
3. Check if verification email is received
4. If email fails, use manual verification

## 📋 Verification Checklist

- [ ] Gmail 2-Factor Authentication enabled
- [ ] App Password generated (16 characters)
- [ ] .env file created in backend directory
- [ ] EMAIL_PASS set with app password
- [ ] Server restarted after configuration
- [ ] Email test successful
- [ ] New candidate registration tested
- [ ] Verification email received
- [ ] Candidate can login after verification

## 🚨 Common Issues & Solutions

### Issue 1: "Authentication failed"
**Solution**: Use App Password, not regular Gmail password

### Issue 2: "Connection failed"
**Solution**: Check internet and verify EMAIL_HOST/EMAIL_PORT

### Issue 3: Emails not received
**Solutions**:
- Check spam/junk folder
- Use manual verification as fallback
- Add sender to contacts

### Issue 4: Manual verification not working
**Solutions**:
- Check token expiration (24 hours)
- Try resending verification email
- Use command line manual verification tool

## 🎯 Expected Results

After fixing:
1. **Registration**: Candidates register successfully
2. **Email Verification**: Verification emails sent automatically
3. **Manual Fallback**: Manual verification works if email fails
4. **Login**: Verified candidates can login
5. **Security**: Unverified candidates cannot login

## 📞 Quick Commands Reference

```bash
# Fix email configuration
npm run fix-email

# Test email configuration
npm run test-email

# Manual verification helper
npm run manual-verify

# Check environment variables
node -e "require('dotenv').config(); console.log('EMAIL_USER:', process.env.EMAIL_USER); console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');"
```

## 🔍 Debug Information

### Server Logs (Success)
```
📧 Sending verification email to: candidate@example.com
✅ Email sent successfully to candidate@example.com
📨 Message ID: <message-id>
```

### Server Logs (Failure)
```
⚠️  Email not configured. Please set EMAIL_USER and EMAIL_PASS
❌ Email sending error: [error details]
```

### Network Response (Success)
```json
{
  "message": "Registration successful! Please check your email to verify your account.",
  "emailVerificationSent": true,
  "requiresVerification": true
}
```

## 🚀 Next Steps

1. Run `npm run fix-email` to configure email
2. Test with a new candidate registration
3. Verify email delivery
4. Test manual verification if needed
5. Ensure candidates can login after verification

## 📞 Support

If you're still having issues:
1. Check the troubleshooting section
2. Run `npm run test-email` to diagnose
3. Use manual verification as temporary solution
4. Check server logs for specific errors
5. Verify Gmail configuration is correct 