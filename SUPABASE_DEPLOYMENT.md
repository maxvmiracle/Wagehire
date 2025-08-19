# Supabase Deployment Guide for Wagehire

This guide will help you deploy your Wagehire backend to Supabase using Edge Functions and PostgreSQL.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Supabase CLI**: Install the Supabase CLI
3. **Node.js**: Version 16 or higher
4. **Git**: For version control

## Installation Steps

### 1. Install Supabase CLI

```bash
# Using npm
npm install -g supabase

# Using Homebrew (macOS)
brew install supabase/tap/supabase

# Using Scoop (Windows)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Initialize Supabase Project

Navigate to your backend directory and initialize:

```bash
cd backend
supabase init
```

### 4. Link to Your Supabase Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with your actual Supabase project reference ID.

## Database Setup

### 1. Apply Database Migrations

```bash
supabase db push
```

This will create all the necessary tables and policies in your Supabase database.

### 2. Verify Database Setup

You can verify the setup by checking your Supabase dashboard:
- Go to your Supabase project dashboard
- Navigate to the "Table Editor" section
- You should see the following tables:
  - `users`
  - `candidates`
  - `interviews`
  - `interview_questions`
  - `notifications`

## Edge Functions Deployment

### 1. Deploy the API Function

```bash
supabase functions deploy api
```

### 2. Set Environment Variables

You need to set the following environment variables in your Supabase project:

```bash
supabase secrets set SUPABASE_URL=your_supabase_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

You can find these values in your Supabase project settings:
- Go to Settings → API
- Copy the "Project URL" and "service_role" key

### 3. Configure CORS (Optional)

If you need to allow specific domains, update the CORS configuration in `supabase/functions/_shared/cors.ts`.

## Environment Configuration

### 1. Update Frontend Configuration

Update your frontend API configuration to point to your Supabase Edge Function:

```javascript
// In your frontend config
const API_BASE_URL = 'https://your-project-ref.supabase.co/functions/v1/api'
```

### 2. Update Authentication

Your frontend will need to use Supabase Auth instead of the custom JWT implementation:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://your-project-ref.supabase.co',
  'your-anon-key'
)
```

## Testing the Deployment

### 1. Test Health Check

```bash
curl https://your-project-ref.supabase.co/functions/v1/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Wagehire API is running"
}
```

### 2. Test Authentication

```bash
# Register a user
curl -X POST https://your-project-ref.supabase.co/functions/v1/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

## Key Differences from Original Backend

### 1. Database
- **Original**: SQLite with file-based storage
- **Supabase**: PostgreSQL with built-in connection pooling

### 2. Authentication
- **Original**: Custom JWT implementation
- **Supabase**: Built-in auth with Row Level Security (RLS)

### 3. API Structure
- **Original**: Express.js server with multiple route files
- **Supabase**: Single Edge Function with route handlers

### 4. Environment
- **Original**: Node.js runtime
- **Supabase**: Deno runtime

## Migration from Existing Data

If you have existing data in your SQLite database, you can migrate it:

### 1. Export SQLite Data

```bash
# Export users
sqlite3 wagehire.db "SELECT * FROM users;" > users_export.csv

# Export candidates
sqlite3 wagehire.db "SELECT * FROM candidates;" > candidates_export.csv

# Export interviews
sqlite3 wagehire.db "SELECT * FROM interviews;" > interviews_export.csv
```

### 2. Import to Supabase

You can use the Supabase dashboard or create a migration script to import the data.

## Monitoring and Logs

### 1. View Function Logs

```bash
supabase functions logs api
```

### 2. Monitor Database

- Use the Supabase dashboard to monitor database performance
- Check the "Logs" section for any errors

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your frontend domain is allowed in the CORS configuration
2. **Authentication Errors**: Verify that your Supabase URL and keys are correct
3. **Database Connection**: Ensure your database migrations have been applied successfully

### Debug Mode

To enable debug logging, add this to your Edge Function:

```typescript
console.log('Request URL:', req.url)
console.log('Request method:', req.method)
```

## Cost Considerations

- **Free Tier**: 500MB database, 2GB bandwidth, 50,000 monthly active users
- **Pro Tier**: $25/month for additional resources
- **Edge Functions**: Included in both tiers with generous limits

## Security Best Practices

1. **Environment Variables**: Never commit sensitive keys to version control
2. **RLS Policies**: All tables have Row Level Security enabled
3. **Input Validation**: Validate all inputs in your Edge Functions
4. **Rate Limiting**: Consider implementing rate limiting for production use

## Next Steps

1. **Custom Domain**: Set up a custom domain for your API
2. **Monitoring**: Set up monitoring and alerting
3. **Backup**: Configure automated database backups
4. **Scaling**: Monitor usage and scale as needed

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions) 