#!/usr/bin/env node

/**
 * Email Provider Setup Script for Wagehire
 * This script helps configure email providers for production deployment
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Wagehire Email Provider Setup');
console.log('================================\n');

const emailProviders = {
  sendgrid: {
    name: 'SendGrid',
    url: 'https://sendgrid.com',
    setup: [
      '1. Create account at https://sendgrid.com',
      '2. Verify your domain or use a verified sender',
      '3. Create API key with "Mail Send" permissions',
      '4. Copy your API key'
    ],
    envVars: {
      EMAIL_PROVIDER: 'sendgrid',
      EMAIL_API_KEY: 'your_sendgrid_api_key',
      EMAIL_FROM: 'noreply@yourdomain.com',
      EMAIL_FROM_NAME: 'Wagehire',
      FRONTEND_URL: 'https://wagehire.vercel.app'
    }
  },
  mailgun: {
    name: 'Mailgun',
    url: 'https://mailgun.com',
    setup: [
      '1. Create account at https://mailgun.com',
      '2. Add and verify your domain',
      '3. Get API key from dashboard',
      '4. Copy your API key and domain'
    ],
    envVars: {
      EMAIL_PROVIDER: 'mailgun',
      EMAIL_API_KEY: 'your_mailgun_api_key',
      EMAIL_DOMAIN: 'yourdomain.com',
      EMAIL_FROM: 'noreply@yourdomain.com',
      EMAIL_FROM_NAME: 'Wagehire',
      FRONTEND_URL: 'https://wagehire.vercel.app'
    }
  },
  resend: {
    name: 'Resend',
    url: 'https://resend.com',
    setup: [
      '1. Create account at https://resend.com',
      '2. Verify your domain',
      '3. Create API key',
      '4. Copy your API key'
    ],
    envVars: {
      EMAIL_PROVIDER: 'resend',
      EMAIL_API_KEY: 'your_resend_api_key',
      EMAIL_FROM: 'noreply@yourdomain.com',
      EMAIL_FROM_NAME: 'Wagehire',
      FRONTEND_URL: 'https://wagehire.vercel.app'
    }
  },
  manual: {
    name: 'Manual Mode (Development)',
    url: 'N/A',
    setup: [
      '1. No setup required for development',
      '2. Emails will be logged to console',
      '3. Verification URLs will be displayed',
      '4. Perfect for testing and development'
    ],
    envVars: {
      EMAIL_PROVIDER: 'manual',
      EMAIL_FROM: 'noreply@wagehire.com',
      EMAIL_FROM_NAME: 'Wagehire',
      FRONTEND_URL: 'https://wagehire.vercel.app'
    }
  }
};

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function selectProvider() {
  console.log('Available Email Providers:\n');
  
  Object.keys(emailProviders).forEach((key, index) => {
    const provider = emailProviders[key];
    console.log(`${index + 1}. ${provider.name}`);
  });
  
  console.log('\n');
  
  const choice = await question('Select your email provider (1-4): ');
  const providerKeys = Object.keys(emailProviders);
  const selectedKey = providerKeys[parseInt(choice) - 1];
  
  if (!selectedKey) {
    console.log('❌ Invalid choice. Please try again.\n');
    return await selectProvider();
  }
  
  return selectedKey;
}

async function configureProvider(providerKey) {
  const provider = emailProviders[providerKey];
  
  console.log(`\n📧 Configuring ${provider.name}`);
  console.log('='.repeat(30));
  console.log(`🌐 Website: ${provider.url}`);
  console.log('\nSetup Instructions:');
  provider.setup.forEach(step => console.log(`   ${step}`));
  
  console.log('\n📋 Environment Variables to set in Supabase:');
  console.log('   (Go to Supabase Dashboard > Settings > Edge Functions > Environment Variables)\n');
  
  Object.entries(provider.envVars).forEach(([key, value]) => {
    console.log(`   ${key}=${value}`);
  });
  
  if (providerKey !== 'manual') {
    console.log('\n🔑 API Key Configuration:');
    const apiKey = await question('Enter your API key (or press Enter to skip): ');
    
    if (apiKey.trim()) {
      provider.envVars.EMAIL_API_KEY = apiKey;
      console.log('✅ API key configured');
    }
    
    if (providerKey === 'mailgun') {
      const domain = await question('Enter your domain (or press Enter to skip): ');
      if (domain.trim()) {
        provider.envVars.EMAIL_DOMAIN = domain;
        console.log('✅ Domain configured');
      }
    }
    
    const fromEmail = await question(`Enter from email (default: ${provider.envVars.EMAIL_FROM}): `);
    if (fromEmail.trim()) {
      provider.envVars.EMAIL_FROM = fromEmail;
    }
  }
  
  return provider.envVars;
}

async function generateConfigFile(envVars) {
  const configContent = `# Wagehire Email Configuration
# Generated on ${new Date().toISOString()}
# Add these environment variables to your Supabase project

${Object.entries(envVars).map(([key, value]) => `${key}=${value}`).join('\n')}

# Instructions:
# 1. Go to https://supabase.com/dashboard/project/xzndkdqlsllwyygbniht
# 2. Navigate to Settings > Edge Functions > Environment Variables
# 3. Add each variable above
# 4. Deploy your Edge Functions: npx supabase functions deploy api
# 5. Test email verification: node test-complete-email-flow.js
`;

  const configPath = path.join(__dirname, 'email-config.env');
  fs.writeFileSync(configPath, configContent);
  
  console.log(`\n📄 Configuration saved to: ${configPath}`);
  console.log('📋 Copy the environment variables above to your Supabase project');
}

async function main() {
  try {
    console.log('Welcome to the Wagehire Email Provider Setup!\n');
    console.log('This script will help you configure email services for production deployment.\n');
    
    const providerKey = await selectProvider();
    const envVars = await configureProvider(providerKey);
    
    console.log('\n📋 Final Configuration:');
    Object.entries(envVars).forEach(([key, value]) => {
      console.log(`   ${key}=${value}`);
    });
    
    await generateConfigFile(envVars);
    
    console.log('\n🎉 Setup Complete!');
    console.log('\nNext Steps:');
    console.log('1. Copy the environment variables to your Supabase project');
    console.log('2. Deploy the updated Edge Functions');
    console.log('3. Test the email verification flow');
    console.log('4. Monitor email delivery in production');
    
    console.log('\n📚 Additional Resources:');
    console.log('- Production Deployment Guide: PRODUCTION_DEPLOYMENT_GUIDE.md');
    console.log('- Email Configuration Guide: frontend/EMAIL_CONFIGURATION_GUIDE.md');
    console.log('- Supabase Dashboard: https://supabase.com/dashboard/project/xzndkdqlsllwyygbniht');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = { emailProviders, configureProvider }; 