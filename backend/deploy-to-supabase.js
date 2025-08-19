const fs = require('fs');
const path = require('path');

// Supabase project configuration
const SUPABASE_URL = 'https://dxzedhdmonbeskuresez.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4emVkaGRtb25iZXNrdXJlc2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzczMTMsImV4cCI6MjA3MTIxMzMxM30.S3HXyhY-TY8BycytKrS2Fr9m_F6ZFjka-x4E-pa2T_Q';

console.log('🚀 Starting Supabase deployment for Wagehire...');
console.log(`📡 Project URL: ${SUPABASE_URL}`);
console.log('');

// Read the database schema
const schemaPath = path.join(__dirname, 'supabase', 'migrations', '20240101000000_initial_schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

console.log('📋 Database schema loaded successfully');
console.log('');

// Create environment configuration
const envConfig = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  API_BASE_URL: `${SUPABASE_URL}/functions/v1/api`
};

// Save environment configuration
const envPath = path.join(__dirname, '.env.supabase');
fs.writeFileSync(envPath, Object.entries(envConfig).map(([key, value]) => `${key}=${value}`).join('\n'));

console.log('✅ Environment configuration saved to .env.supabase');
console.log('');

// Create deployment instructions
const deploymentInstructions = `
# Supabase Deployment Instructions

## 1. Database Setup
You need to manually run the SQL schema in your Supabase dashboard:

1. Go to: https://supabase.com/dashboard/project/dxzedhdmonbeskuresez/sql
2. Copy and paste the contents of: backend/supabase/migrations/20240101000000_initial_schema.sql
3. Click "Run" to execute the schema

## 2. Edge Function Deployment
Run these commands in your backend directory:

\`\`\`bash
cd backend
npx supabase functions deploy api
\`\`\`

## 3. Environment Variables
Set these secrets in your Supabase project:

\`\`\`bash
npx supabase secrets set SUPABASE_URL=${SUPABASE_URL}
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
\`\`\`

Get your service role key from: https://supabase.com/dashboard/project/dxzedhdmonbeskuresez/settings/api

## 4. Frontend Configuration
Update your frontend .env file with:

\`\`\`
REACT_APP_SUPABASE_URL=${SUPABASE_URL}
REACT_APP_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
REACT_APP_API_BASE_URL=${SUPABASE_URL}/functions/v1/api
\`\`\`

## 5. Test Deployment
Test your API endpoint:
\`\`\`bash
curl ${SUPABASE_URL}/functions/v1/api/health
\`\`\`

Expected response:
\`\`\`json
{
  "status": "OK",
  "message": "Wagehire API is running"
}
\`\`\`
`;

fs.writeFileSync(path.join(__dirname, 'SUPABASE_DEPLOYMENT_STEPS.md'), deploymentInstructions);

console.log('📝 Deployment instructions saved to SUPABASE_DEPLOYMENT_STEPS.md');
console.log('');

console.log('🎯 Next Steps:');
console.log('1. Run the SQL schema in your Supabase dashboard');
console.log('2. Deploy the Edge Function using: npx supabase functions deploy api');
console.log('3. Set environment variables');
console.log('4. Update your frontend configuration');
console.log('');

console.log('📊 Your Supabase Project Details:');
console.log(`   Project URL: ${SUPABASE_URL}`);
console.log(`   Project Ref: dxzedhdmonbeskuresez`);
console.log(`   API Base URL: ${SUPABASE_URL}/functions/v1/api`);
console.log('');

console.log('✅ Setup complete! Check SUPABASE_DEPLOYMENT_STEPS.md for detailed instructions.'); 