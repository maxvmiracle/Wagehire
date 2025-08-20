const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseConfig = {
  url: 'https://xzndkdqlsllwyygbniht.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ',
  apiBaseUrl: 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api',
  jwtSecret: 'your-secret-key'
};

// Frontend .env template
const envTemplate = `# Supabase Configuration
REACT_APP_SUPABASE_URL=${supabaseConfig.url}
REACT_APP_SUPABASE_ANON_KEY=${supabaseConfig.anonKey}

# API Configuration
REACT_APP_API_BASE_URL=${supabaseConfig.apiBaseUrl}
REACT_APP_JWT_SECRET=${supabaseConfig.jwtSecret}

# Environment
NODE_ENV=production
`;

// API service template
const apiServiceTemplate = `// Updated API service for Supabase backend
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to make API calls
  async makeRequest(endpoint, options = {}) {
    const url = \`\${this.baseURL}\${endpoint}\`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': \`Bearer \${token}\` }),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async register(userData) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  // Interviews
  async getInterviews() {
    return this.makeRequest('/interviews');
  }

  async createInterview(interviewData) {
    return this.makeRequest('/interviews', {
      method: 'POST',
      body: JSON.stringify(interviewData)
    });
  }

  async updateInterview(id, interviewData) {
    return this.makeRequest(\`/interviews/\${id}\`, {
      method: 'PUT',
      body: JSON.stringify(interviewData)
    });
  }

  async deleteInterview(id) {
    return this.makeRequest(\`/interviews/\${id}\`, {
      method: 'DELETE'
    });
  }

  // Users
  async getProfile() {
    return this.makeRequest('/users/profile');
  }

  async updateProfile(profileData) {
    return this.makeRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health');
  }
}

export default new ApiService();
`;

console.log('🎉 Supabase Backend Configuration Helper');
console.log('=====================================\n');

console.log('📋 Your Supabase Configuration:');
console.log(`   URL: ${supabaseConfig.url}`);
console.log(`   API Base URL: ${supabaseConfig.apiBaseUrl}`);
console.log(`   Project ID: xzndkdqlsllwyygbniht\n`);

console.log('📁 Files to update in your frontend:');
console.log('   1. .env file');
console.log('   2. src/services/api.js (or similar)\n');

console.log('📝 Frontend .env content:');
console.log('   Copy this to your frontend .env file:');
console.log('   ' + '='.repeat(50));
console.log(envTemplate);
console.log('   ' + '='.repeat(50));

console.log('\n🔧 Updated API Service:');
console.log('   Replace your current API service with this:');
console.log('   ' + '='.repeat(50));
console.log(apiServiceTemplate);
console.log('   ' + '='.repeat(50));

console.log('\n✅ Next Steps:');
console.log('   1. Update your frontend .env file with the configuration above');
console.log('   2. Replace your API service with the updated version');
console.log('   3. Test the connection with the new backend');
console.log('   4. Deploy your frontend');

console.log('\n🔗 Useful Links:');
console.log('   - Supabase Dashboard: https://supabase.com/dashboard/project/xzndkdqlsllwyygbniht');
console.log('   - Database Editor: https://supabase.com/dashboard/project/xzndkdqlsllwyygbniht/editor');
console.log('   - API Functions: https://supabase.com/dashboard/project/xzndkdqlsllwyygbniht/functions');

console.log('\n🚀 Your backend is ready for production!'); 