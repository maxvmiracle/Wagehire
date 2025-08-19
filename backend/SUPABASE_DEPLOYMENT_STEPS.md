
# Supabase Deployment Instructions

## 1. Database Setup
You need to manually run the SQL schema in your Supabase dashboard:

1. Go to: https://supabase.com/dashboard/project/dxzedhdmonbeskuresez/sql
2. Copy and paste the contents of: backend/supabase/migrations/20240101000000_initial_schema.sql
3. Click "Run" to execute the schema

## 2. Edge Function Deployment
Run these commands in your backend directory:

```bash
cd backend
npx supabase functions deploy api
```

## 3. Environment Variables
Set these secrets in your Supabase project:

```bash
npx supabase secrets set SUPABASE_URL=https://dxzedhdmonbeskuresez.supabase.co
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

Get your service role key from: https://supabase.com/dashboard/project/dxzedhdmonbeskuresez/settings/api

## 4. Frontend Configuration
Update your frontend .env file with:

```
REACT_APP_SUPABASE_URL=https://dxzedhdmonbeskuresez.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4emVkaGRtb25iZXNrdXJlc2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzczMTMsImV4cCI6MjA3MTIxMzMxM30.S3HXyhY-TY8BycytKrS2Fr9m_F6ZFjka-x4E-pa2T_Q
REACT_APP_API_BASE_URL=https://dxzedhdmonbeskuresez.supabase.co/functions/v1/api
```

## 5. Test Deployment
Test your API endpoint:
```bash
curl https://dxzedhdmonbeskuresez.supabase.co/functions/v1/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Wagehire API is running"
}
```
