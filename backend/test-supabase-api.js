const https = require('https');

function testEndpoint(path, method = 'GET', data = null) {
  const options = {
    hostname: 'xzndkdqlsllwyygbniht.supabase.co',
    port: 443,
    path: `/functions/v1/api${path}`,
    method: method,
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ',
      'Content-Type': 'application/json'
    }
  };

  console.log(`\nTesting: ${method} ${path}`);
  console.log(`Full URL: https://xzndkdqlsllwyygbniht.supabase.co${options.path}`);

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  if (data) {
    req.write(JSON.stringify(data));
  }

  req.end();
}

// Test different endpoints
testEndpoint('/health');

// Test interview endpoints
testEndpoint('/interviews');

// Test creating an interview
testEndpoint('/interviews', 'POST', {
  candidate_id: '7d1b3d21-ea03-4132-812f-721fb4313c00',
  company_name: 'Tech Corp',
  job_title: 'Senior Software Engineer',
  scheduled_date: '2025-08-25T10:00:00Z',
  duration: 60,
  status: 'scheduled',
  round: 1,
  interview_type: 'technical',
  location: 'Remote',
  notes: 'First round technical interview',
  company_website: 'https://techcorp.com',
  interviewer_name: 'John Doe',
  interviewer_email: 'john.doe@techcorp.com',
  interviewer_position: 'Engineering Manager'
});

// Test login with the created user
setTimeout(() => {
  testEndpoint('/auth/login', 'POST', {
    email: 'test@example.com',
    password: 'TestPass123!'
  });
}, 2000); 