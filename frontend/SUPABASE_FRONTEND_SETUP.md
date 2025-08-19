# Frontend Supabase Setup Guide

## ✅ What's Been Updated

Your frontend has been successfully updated to use Supabase! Here's what changed:

### 1. **New Files Created:**
- `src/config/supabase.js` - Supabase client configuration
- `supabase-env-template.txt` - Environment variables template

### 2. **Files Updated:**
- `src/services/api.js` - Now uses Supabase instead of custom backend
- `src/contexts/AuthContext.js` - Now uses Supabase authentication

### 3. **Dependencies Added:**
- `@supabase/supabase-js` - Supabase JavaScript client

## 🚀 Next Steps

### Step 1: Set Environment Variables

Create a `.env` file in your frontend directory with your Supabase credentials:

```bash
# Copy the template
cp supabase-env-template.txt .env

# Edit the .env file with your actual values
```

**Required Environment Variables:**
```env
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
REACT_APP_FRONTEND_URL=https://wagehire.vercel.app
NODE_ENV=production
```

### Step 2: Get Your Supabase Credentials

1. Go to your **Supabase Dashboard**
2. Navigate to **Settings > API**
3. Copy:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **Anon Key** (public key)

### Step 3: Configure Supabase Authentication

In your Supabase Dashboard:

1. **Go to Authentication > Settings**
2. **Set Site URL** to: `https://wagehire.vercel.app`
3. **Add Redirect URLs:**
   - `https://wagehire.vercel.app/**`
   - `http://localhost:3000/**` (for development)

### Step 4: Test the Setup

1. **Start your development server:**
   ```bash
   npm start
   ```

2. **Test authentication:**
   - Try registering a new user
   - Try logging in
   - Check if the user appears in Supabase Dashboard > Authentication > Users

## 🔧 Key Changes Made

### Authentication Flow
- **Before**: Custom JWT tokens with localStorage
- **After**: Supabase built-in authentication with sessions

### API Calls
- **Before**: HTTP requests to custom backend
- **After**: Direct Supabase client calls

### User Management
- **Before**: Custom user roles in database
- **After**: User metadata in Supabase auth

## 📋 API Endpoints Now Available

### Authentication
```javascript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
});

// Register
const { data, error } = await supabase.auth.signUp({
  email, password,
  options: { data: { name, role } }
});

// Logout
const { error } = await supabase.auth.signOut();
```

### Database Operations
```javascript
// Get candidates
const { data, error } = await supabase
  .from('candidates')
  .select('*');

// Create interview
const { data, error } = await supabase
  .from('interviews')
  .insert(interviewData)
  .select();

// Get interviews with relations
const { data, error } = await supabase
  .from('interviews')
  .select(`
    *,
    candidates (id, name, email),
    users (id, name, email)
  `);
```

## 🎯 Benefits of This Setup

### ✅ Advantages:
1. **Built-in Authentication** - No need to manage JWT tokens
2. **Real-time Subscriptions** - Can add real-time features easily
3. **Row Level Security** - Automatic data protection
4. **Automatic API** - No need for custom backend endpoints
5. **Better Performance** - Direct database access
6. **Type Safety** - Better TypeScript support

### ⚠️ Considerations:
1. **Vendor Lock-in** - Supabase-specific features
2. **Learning Curve** - New API patterns
3. **Cold Starts** - If using Edge Functions later

## 🔍 Troubleshooting

### Common Issues:

1. **"Invalid API key" error:**
   - Check your `REACT_APP_SUPABASE_ANON_KEY` is correct
   - Make sure you're using the anon key, not the service role key

2. **CORS errors:**
   - Verify your site URL in Supabase Authentication settings
   - Add your domain to redirect URLs

3. **"User not found" errors:**
   - Check if the user exists in Supabase Dashboard > Authentication > Users
   - Verify RLS policies are set up correctly

4. **"Permission denied" errors:**
   - Check Row Level Security policies
   - Verify user roles and permissions

## 🚀 Deployment

### For Vercel:
1. Add environment variables in Vercel dashboard
2. Deploy as usual with `vercel --prod`

### For Other Platforms:
1. Set the environment variables in your hosting platform
2. Deploy your React app

## 📞 Support

If you encounter issues:
1. Check Supabase Dashboard logs
2. Review browser console for errors
3. Verify environment variables are set correctly
4. Check Supabase documentation: https://supabase.com/docs

Your frontend is now ready to work with Supabase! 🎉 