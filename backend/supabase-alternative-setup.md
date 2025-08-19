# Alternative Supabase Setup (No CLI Required)

## Option 1: Use Supabase Built-in Features

### 1. Database Setup
- ✅ Already done with the SQL schema
- Tables: users, candidates, interviews, interview_submissions
- RLS policies are in place

### 2. Authentication Setup
- Go to Authentication > Settings in Supabase dashboard
- Set Site URL to: `https://wagehire.vercel.app`
- Add redirect URLs: `https://wagehire.vercel.app/**`
- Configure email templates if needed

### 3. API Access
Supabase automatically provides REST API endpoints:
- `https://your-project-ref.supabase.co/rest/v1/users`
- `https://your-project-ref.supabase.co/rest/v1/candidates`
- `https://your-project-ref.supabase.co/rest/v1/interviews`
- `https://your-project-ref.supabase.co/rest/v1/interview_submissions`

### 4. Update Frontend
Update your frontend to use Supabase client directly:

```javascript
// In frontend/src/services/api.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project-ref.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Replace your existing API calls with Supabase queries
export const api = {
  // Auth
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  register: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Candidates
  getCandidates: async () => {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
    return { data, error }
  },

  createCandidate: async (candidateData) => {
    const { data, error } = await supabase
      .from('candidates')
      .insert(candidateData)
      .select()
    return { data, error }
  },

  // Interviews
  getInterviews: async () => {
    const { data, error } = await supabase
      .from('interviews')
      .select(`
        *,
        candidates (name, email),
        users (name, email)
      `)
    return { data, error }
  },

  createInterview: async (interviewData) => {
    const { data, error } = await supabase
      .from('interviews')
      .insert(interviewData)
      .select()
    return { data, error }
  },

  // Users
  getUsers: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    return { data, error }
  }
}
```

## Option 2: Deploy to Vercel/Render with Supabase Database

### 1. Update Backend for Supabase
Modify your existing Express server to use Supabase:

```javascript
// In backend/server.js
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Replace your database queries with Supabase queries
// Example: Replace SQLite queries with Supabase client calls
```

### 2. Deploy Backend to Vercel/Render
- Keep your existing Express server
- Just change the database from SQLite to Supabase
- Deploy to Vercel or Render as before

## Option 3: Use Supabase Edge Functions (Manual)

### 1. Create Edge Function in Dashboard
1. Go to Edge Functions in Supabase dashboard
2. Click "Create a new function"
3. Name it `api`
4. Copy the code from `backend/supabase/functions/api/index.ts`
5. Set environment variables in the dashboard

### 2. Environment Variables to Set
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `JWT_SECRET`

## Recommended Approach

**I recommend Option 1** (using Supabase built-in features) because:
- ✅ No CLI installation required
- ✅ Automatic REST API endpoints
- ✅ Built-in authentication
- ✅ Real-time subscriptions
- ✅ Easy to implement
- ✅ Better performance

Would you like me to help you implement Option 1? 