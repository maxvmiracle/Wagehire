# Supabase Deployment Guide for Wagehire Backend

## Overview

This guide will help you deploy your Wagehire backend to Supabase. Supabase provides a PostgreSQL database, authentication, and Edge Functions for serverless API endpoints.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Supabase CLI**: Install the CLI for local development
3. **Node.js**: Version 16 or higher
4. **Git**: For version control

## Step 1: Install Supabase CLI

```bash
# Using npm
npm install -g supabase

# Using Homebrew (macOS)
brew install supabase/tap/supabase

# Using Windows (with Chocolatey)
choco install supabase
```

## Step 2: Initialize Supabase Project

```bash
# Navigate to your project root
cd /path/to/your/wagehire/project

# Initialize Supabase
supabase init

# Login to Supabase
supabase login
```

## Step 3: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `wagehire-backend`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
5. Click "Create new project"

## Step 4: Link Local Project to Remote

```bash
# Get your project reference from Supabase dashboard
supabase link --project-ref YOUR_PROJECT_REF

# Example:
# supabase link --project-ref abcdefghijklmnop
```

## Step 5: Set Up Database Schema

```bash
# Apply the database migrations
supabase db push

# This will create all tables, policies, and functions
```

## Step 6: Deploy Edge Functions

```bash
# Deploy the API function
supabase functions deploy api

# Set environment variables for the function
supabase secrets set SUPABASE_URL=your_supabase_url
supabase secrets set SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 7: Configure Environment Variables

In your Supabase dashboard, go to Settings > API and copy:

1. **Project URL**: `https://your-project-ref.supabase.co`
2. **Anon Key**: Your public anon key
3. **Service Role Key**: Your service role key (keep secret)

Set these in your Edge Function:

```bash
supabase secrets set SUPABASE_URL=https://your-project-ref.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your-anon-key
supabase secrets set JWT_SECRET=your-super-secret-jwt-key-here
```

## Step 8: Configure Authentication

In Supabase Dashboard > Authentication > Settings:

1. **Site URL**: Set to your frontend URL (e.g., `https://wagehire.vercel.app`)
2. **Redirect URLs**: Add your frontend URLs
3. **Email Templates**: Customize if needed

## Step 9: Update Frontend Configuration

Update your frontend API configuration to use Supabase:

```javascript
// In your frontend services/api.js
const SUPABASE_URL = 'https://your-project-ref.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key'

// Update API base URL
const API_BASE_URL = `${SUPABASE_URL}/functions/v1/api`
```

## Step 10: Test the Deployment

```bash
# Test the health endpoint
curl https://your-project-ref.supabase.co/functions/v1/api/health

# Expected response:
# {"status":"OK","message":"Wagehire API is running on Supabase"}
```

## Step 11: Migrate Existing Data (Optional)

If you have existing data in SQLite, you can migrate it:

1. Export data from SQLite:
```bash
# Create a migration script
node backend/migrate-to-supabase.js
```

2. Import to Supabase:
```bash
# Use Supabase dashboard or CLI to import data
```

## API Endpoints

Your API will be available at:
- **Base URL**: `https://your-project-ref.supabase.co/functions/v1/api`
- **Health Check**: `GET /api/health`
- **Auth**: `POST /api/auth/login`, `POST /api/auth/register`
- **Interviews**: `GET /api/interviews`, `POST /api/interviews`
- **Users**: `GET /api/users`
- **Candidates**: `GET /api/candidates`, `POST /api/candidates`
- **Admin**: `GET /api/admin`

## Benefits of Supabase Deployment

### ✅ Advantages:
1. **Managed PostgreSQL**: No database management required
2. **Built-in Authentication**: JWT tokens, user management
3. **Row Level Security**: Fine-grained access control
4. **Edge Functions**: Serverless API endpoints
5. **Real-time**: Built-in real-time subscriptions
6. **Storage**: File upload and management
7. **Dashboard**: Easy database management UI

### ⚠️ Considerations:
1. **Cold Starts**: Edge Functions may have cold start delays
2. **Execution Limits**: 50MB bundle size, 10-second timeout
3. **Database Limits**: Based on your plan
4. **Vendor Lock-in**: Supabase-specific features

## Monitoring and Maintenance

### View Logs:
```bash
# View Edge Function logs
supabase functions logs api

# View database logs
supabase db logs
```

### Update Functions:
```bash
# Deploy updated functions
supabase functions deploy api
```

### Database Changes:
```bash
# Create new migration
supabase migration new migration_name

# Apply migrations
supabase db push
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Check CORS configuration in Edge Function
   - Verify frontend URL in Supabase settings

2. **Authentication Issues**:
   - Verify JWT secret is set correctly
   - Check user roles and permissions

3. **Database Connection**:
   - Verify environment variables
   - Check RLS policies

4. **Function Timeout**:
   - Optimize database queries
   - Consider breaking large operations

### Getting Help:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## Cost Considerations

### Free Tier Limits:
- **Database**: 500MB
- **Edge Functions**: 500,000 invocations/month
- **Auth**: 50,000 users
- **Storage**: 1GB

### Paid Plans:
- **Pro**: $25/month
- **Team**: $599/month
- **Enterprise**: Custom pricing

## Next Steps

1. **Set up monitoring**: Configure alerts for errors
2. **Backup strategy**: Set up automated backups
3. **Performance optimization**: Add database indexes
4. **Security audit**: Review RLS policies
5. **CI/CD**: Set up automated deployments

## Migration Checklist

- [ ] Install Supabase CLI
- [ ] Create Supabase project
- [ ] Link local project
- [ ] Deploy database schema
- [ ] Deploy Edge Functions
- [ ] Configure environment variables
- [ ] Update frontend configuration
- [ ] Test all endpoints
- [ ] Migrate existing data (if any)
- [ ] Update deployment documentation
- [ ] Monitor performance
- [ ] Set up backups

Your Wagehire backend is now ready to run on Supabase! 🚀 