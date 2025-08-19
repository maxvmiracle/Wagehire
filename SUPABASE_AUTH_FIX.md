# 🔧 Fix Supabase Authentication for Production

## 🚨 Current Issue

Your confirmation emails are pointing to `localhost:3000` instead of your production domain. This needs to be fixed for your app to work with multiple clients.

## ✅ Solution: Update Supabase Authentication Settings

### Step 1: Update Supabase Dashboard Settings

**Go to your Supabase Dashboard:**
1. Navigate to **Authentication > Settings**
2. Update the following settings:

#### Site URL
**Change from:** `http://localhost:3000`  
**Change to:** `https://wagehire.vercel.app`

#### Redirect URLs
**Add these URLs:**
```
https://wagehire.vercel.app/**
https://wagehire.vercel.app
http://localhost:3000/** (for development)
http://localhost:3000 (for development)
```

### Step 2: Update Email Templates (Optional)

**Go to Authentication > Email Templates:**

1. **Confirmation Email Template:**
   - Update the confirmation link to use your production domain
   - Replace any `localhost:3000` references with `https://wagehire.vercel.app`

2. **Magic Link Template (if using):**
   - Update to use your production domain

### Step 3: Test the Changes

1. **Register a new user** to test the confirmation email
2. **Check the confirmation link** - it should now point to your production domain
3. **Test password reset** functionality

## 🔧 Code Updates Made

### 1. Updated Supabase Configuration
The `frontend/src/config/supabase.js` file now:
- Automatically detects environment (development vs production)
- Uses appropriate redirect URLs
- Configures PKCE flow for better security

### 2. Updated API Service
The `frontend/src/services/api.js` file now:
- Uses production URLs for password reset in production
- Falls back to localhost for development

## 🎯 Environment-Specific Behavior

### Development (localhost:3000)
- Confirmation emails will redirect to `http://localhost:3000`
- Password reset will redirect to `http://localhost:3000/reset-password`

### Production (wagehire.vercel.app)
- Confirmation emails will redirect to `https://wagehire.vercel.app`
- Password reset will redirect to `https://wagehire.vercel.app/reset-password`

## 📋 Complete Supabase Settings Checklist

### Authentication > Settings
- [ ] **Site URL:** `https://wagehire.vercel.app`
- [ ] **Redirect URLs:** Include both production and development URLs
- [ ] **Enable Email Confirmations:** ✅ Enabled
- [ ] **Enable Email Change Confirmations:** ✅ Enabled

### Authentication > Email Templates
- [ ] **Confirmation Email:** Uses production domain
- [ ] **Magic Link Email:** Uses production domain (if applicable)
- [ ] **Change Email Address:** Uses production domain

## 🚀 Deployment Considerations

### For Vercel Deployment
1. **Set Environment Variables:**
   ```
   NODE_ENV=production
   REACT_APP_SUPABASE_URL=https://stgtlwqszoxpquikadwn.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

### For Other Platforms
1. Set the same environment variables
2. Deploy your React app
3. Update Supabase settings to use your actual domain

## 🔍 Testing Checklist

After making these changes:

- [ ] **Registration:** New users receive confirmation emails with correct links
- [ ] **Login:** Users can log in after email confirmation
- [ ] **Password Reset:** Reset emails contain correct links
- [ ] **Development:** Local development still works
- [ ] **Production:** Production domain works correctly

## 🎉 Expected Results

After fixing the settings:

1. **Confirmation emails** will redirect to `https://wagehire.vercel.app`
2. **Password reset emails** will redirect to `https://wagehire.vercel.app/reset-password`
3. **Multiple clients** can use your application
4. **Development** still works locally

## 📞 Troubleshooting

### If confirmation links still point to localhost:
1. Check Supabase Dashboard > Authentication > Settings
2. Verify Site URL is set to production domain
3. Clear browser cache and test again
4. Check if you're testing in development mode

### If redirects don't work:
1. Verify redirect URLs include your production domain
2. Check if your domain is accessible
3. Test with a fresh browser session

**Your authentication will now work properly for multiple clients! 🚀** 