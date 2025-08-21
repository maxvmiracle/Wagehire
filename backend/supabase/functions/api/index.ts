import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-token, X-User-Token',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://xzndkdqlsllwyygbniht.supabase.co'
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcwNzY4MywiZXhwIjoyMDcxMjgzNjgzfQ.KQJrEg-zPQdgtHikT3wLO0JkQQV1kx8ngyJBAL-zS8k'

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse the request
    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/api', '').replace('/api', '')
    const method = req.method
    let body = null;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        body = await req.json();
      } catch (error) {
        console.error('Error parsing request body:', error);
        body = null;
      }
    }
    const headers = Object.fromEntries(req.headers.entries())
    
    console.log('=== REQUEST DEBUG ===');
    console.log('Request URL:', req.url);
    console.log('Request method:', method);
    console.log('Parsed path:', path);

    // Health check endpoint
    if (path === '/health' && method === 'GET') {
      return new Response(
        JSON.stringify({ status: 'OK', message: 'Wagehire API is running' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Auth routes
    if (path.startsWith('/auth')) {
      return handleAuthRoutes(path, method, body, headers, supabase)
    }

    // Interview routes
    if (path.startsWith('/interviews')) {
      return handleInterviewRoutes(path, method, body, headers, supabase)
    }

    // User routes
    if (path.startsWith('/users')) {
      return handleUserRoutes(path, method, body, headers, supabase)
    }

    // Admin routes
    if (path.startsWith('/admin')) {
      return handleAdminRoutes(path, method, body, headers, supabase)
    }

    // Candidate routes
    if (path.startsWith('/candidates')) {
      return handleCandidateRoutes(path, method, body, headers, supabase)
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({ error: 'Route not found' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Something went wrong!',
        message: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

// Auth routes handler
async function handleAuthRoutes(path, method, body, headers, supabase) {
  const authPath = path.replace('/auth', '')
  
  if (authPath === '/register' && method === 'POST') {
    return handleRegister(body, supabase)
  }
  
  if (authPath === '/login' && method === 'POST') {
    return handleLogin(body, supabase)
  }
  
  if (authPath === '/verify-email' && method === 'POST') {
    return handleVerifyEmail(body, supabase)
  }
  
  if (authPath === '/forgot-password' && method === 'POST') {
    return handleForgotPassword(body, supabase)
  }
  
  if (authPath === '/reset-password' && method === 'POST') {
    return handleResetPassword(body, supabase)
  }
  
  return new Response(
    JSON.stringify({ error: 'Auth route not found' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404 
    }
  )
}

// Interview routes handler
async function handleInterviewRoutes(path, method, body, headers, supabase) {
  const interviewPath = path.replace('/interviews', '')
  
  if (interviewPath === '' && method === 'GET') {
    return handleGetInterviews(headers, supabase)
  }
  
  if (interviewPath === '' && method === 'POST') {
    return handleCreateInterview(body, headers, supabase)
  }
  
  if (interviewPath.startsWith('/') && method === 'GET') {
    const id = interviewPath.substring(1)
    return handleGetInterview(id, headers, supabase)
  }
  
  if (interviewPath.startsWith('/') && method === 'PUT') {
    const id = interviewPath.substring(1)
    return handleUpdateInterview(id, body, headers, supabase)
  }
  
  if (interviewPath.startsWith('/') && method === 'DELETE') {
    const id = interviewPath.substring(1)
    return handleDeleteInterview(id, headers, supabase)
  }
  
  return new Response(
    JSON.stringify({ error: 'Interview route not found' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404 
    }
  )
}

// User routes handler
async function handleUserRoutes(path, method, body, headers, supabase) {
  const userPath = path.replace('/users', '')
  
  if (userPath === '/profile' && method === 'GET') {
    return handleGetProfile(headers, supabase)
  }
  
  if (userPath === '/profile' && method === 'PUT') {
    return handleUpdateProfile(body, headers, supabase)
  }
  
  if (userPath === '/me/dashboard' && method === 'GET') {
    return handleGetUserDashboard(headers, supabase)
  }
  
  return new Response(
    JSON.stringify({ error: 'User route not found' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404 
    }
  )
}

// Admin routes handler
async function handleAdminRoutes(path, method, body, headers, supabase) {
  const adminPath = path.replace('/admin', '')
  
  if (adminPath === '/users' && method === 'GET') {
    return handleGetAllUsers(headers, supabase)
  }
  
  if (adminPath === '/users' && method === 'POST') {
    return handleCreateUser(body, headers, supabase)
  }
  
  if (adminPath === '/dashboard' && method === 'GET') {
    return handleGetAdminDashboard(headers, supabase)
  }
  
  if (adminPath === '/interviews' && method === 'GET') {
    return handleGetAdminInterviews(headers, supabase)
  }
  
  return new Response(
    JSON.stringify({ error: 'Admin route not found' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404 
    }
  )
}

// Candidate routes handler
async function handleCandidateRoutes(path, method, body, headers, supabase) {
  const candidatePath = path.replace('/candidates', '')
  
  if (candidatePath === '' && method === 'GET') {
    return handleGetCandidates(headers, supabase)
  }
  
  if (candidatePath === '' && method === 'POST') {
    return handleCreateCandidate(body, headers, supabase)
  }
  
  if (candidatePath.startsWith('/') && method === 'GET') {
    const id = candidatePath.substring(1)
    return handleGetCandidate(id, headers, supabase)
  }
  
  if (candidatePath.startsWith('/') && method === 'PUT') {
    const id = candidatePath.substring(1)
    return handleUpdateCandidate(id, body, headers, supabase)
  }
  
  if (candidatePath.startsWith('/') && method === 'DELETE') {
    const id = candidatePath.substring(1)
    return handleDeleteCandidate(id, headers, supabase)
  }
  
  return new Response(
    JSON.stringify({ error: 'Candidate route not found' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404 
    }
  )
}

// Utility functions
function extractUserToken(headers) {
  // Check for user token in custom header
  const userToken = headers['x-user-token'] || headers['X-User-Token'];
  return userToken || null;
}

function decodeJWT(token) {
  try {
    // Simple JWT decoding (in production, use proper JWT library)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

function validateStrongPassword(password) {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function verifyPassword(password, hashedPassword) {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
}

function generateJWT(payload) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (24 * 60 * 60); // 24 hours
  
  const jwtPayload = {
    ...payload,
    iat: now,
    exp: exp
  };
  
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(jwtPayload));
  
  // Simple signature (in production, use proper crypto)
  const signature = btoa('your-secret-key');
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Authentication handlers
async function handleRegister(body, supabase) {
  try {
    const { 
      email, 
      password, 
      name, 
      phone, 
      resume_url, 
      current_position, 
      experience_years, 
      skills 
    } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and name are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Validate strong password
    const passwordValidation = validateStrongPassword(password);
    if (!passwordValidation.isValid) {
      return new Response(
        JSON.stringify({ 
          error: 'Password does not meet security requirements',
          passwordErrors: passwordValidation.errors
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Check if this is the first user
    const { count: userCount, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count error:', countError);
      return new Response(
        JSON.stringify({ error: 'Failed to check user count' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    const isFirstUser = userCount === 0;
    console.log('User count:', userCount, 'Is first user:', isFirstUser);
    const userRole = isFirstUser ? 'admin' : 'candidate';

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Prepare user data
    const userData = {
      email,
      password: hashedPassword,
      name,
      role: userRole,
      phone: phone && phone.trim() !== '' ? phone : null,
      resume_url: resume_url && resume_url.trim() !== '' ? resume_url : null,
      current_position: current_position && current_position.trim() !== '' ? current_position : null,
      experience_years: experience_years && experience_years !== '' ? parseInt(experience_years, 10) : null,
      skills: skills && skills.trim() !== '' ? skills : null,
      email_verified: true
    };

    console.log('Inserting user data:', userData);

    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert(userData)
      .select('id, email, name, role, phone, resume_url, current_position, experience_years, skills, email_verified, created_at')
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create user' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    // Generate JWT token for immediate login
    const token = generateJWT({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    return new Response(
      JSON.stringify({
        message: isFirstUser ? 'Admin account created successfully! You can now login.' : 'Registration successful! You can now login.',
        user: newUser,
        token,
        emailVerificationSent: false,
        requiresVerification: false,
        isAdmin: isFirstUser
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201 
      }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

async function handleLogin(body, supabase) {
  try {
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Check password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Generate JWT token
    const token = generateJWT({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        token,
        user: userWithoutPassword
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

async function handleVerifyEmail(body, supabase) {
  // Implement email verification logic
  return new Response(
    JSON.stringify({ message: 'Email verification endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleForgotPassword(body, supabase) {
  // Implement forgot password logic
  return new Response(
    JSON.stringify({ message: 'Forgot password endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleResetPassword(body, supabase) {
  // Implement reset password logic
  return new Response(
    JSON.stringify({ message: 'Reset password endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleGetInterviews(headers, supabase) {
  try {
    // Get user token from custom header
    const userToken = extractUserToken(headers);
    if (!userToken) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Extract user ID from JWT token
    const decodedToken = decodeJWT(userToken);
    if (!decodedToken || !decodedToken.userId) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    const userId = decodedToken.userId;

    // Get user role to determine access
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError || !currentUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    let query = supabase
      .from('interviews')
      .select(`
        *,
        candidate:users!interviews_candidate_id_fkey(
          id,
          name,
          email,
          role,
          phone,
          current_position,
          experience_years,
          skills
        )
      `)
      .order('scheduled_date', { ascending: false });

    // If not admin, only show user's own interviews
    if (currentUser.role !== 'admin') {
      query = query.eq('candidate_id', userId);
    }

    const { data: interviews, error } = await query;

    if (error) {
      console.error('Get interviews error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch interviews' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    return new Response(
      JSON.stringify({ interviews: interviews || [] }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Get interviews error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

async function handleCreateInterview(body, headers, supabase) {
  try {
    // Get user token from custom header
    const userToken = extractUserToken(headers);
    if (!userToken) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Extract user ID from JWT token
    const decodedToken = decodeJWT(userToken);
    if (!decodedToken || !decodedToken.userId) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    const userId = decodedToken.userId;

    // Validate required fields
    const requiredFields = ['company_name', 'job_title'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return new Response(
          JSON.stringify({ error: `${field} is required` }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }
    }

    // Create interview data
    const { scheduled_time, ...bodyWithoutTime } = body;
    
    // Handle scheduled_date - it might already be a timestamp or need to be combined
    let scheduledDateTime = null;
    if (body.scheduled_date) {
      if (body.scheduled_time) {
        // If both date and time are provided separately, combine them
        scheduledDateTime = new Date(`${body.scheduled_date}T${body.scheduled_time}`).toISOString();
      } else {
        // If scheduled_date is already a timestamp, use it as is
        scheduledDateTime = body.scheduled_date;
      }
    }
    
    const interviewData = {
      ...bodyWithoutTime,
      scheduled_date: scheduledDateTime,
      candidate_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: interview, error } = await supabase
      .from('interviews')
      .insert(interviewData)
      .select(`
        *,
        candidate:users!interviews_candidate_id_fkey(
          id,
          name,
          email,
          role,
          phone,
          current_position,
          experience_years,
          skills
        )
      `)
      .single();

    if (error) {
      console.error('Create interview error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create interview' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Interview scheduled successfully',
        interview
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201 
      }
    );

  } catch (error) {
    console.error('Create interview error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

async function handleGetInterview(id, headers, supabase) {
  try {
    // Get user token from custom header
    const userToken = extractUserToken(headers);
    if (!userToken) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Extract user ID from JWT token
    const decodedToken = decodeJWT(userToken);
    if (!decodedToken || !decodedToken.userId) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    const userId = decodedToken.userId;

    // Get user role to determine access
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError || !currentUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    // Get interview by ID with candidate details
    let query = supabase
      .from('interviews')
      .select(`
        *,
        candidate:users!interviews_candidate_id_fkey(
          id,
          name,
          email,
          role,
          phone,
          current_position,
          experience_years,
          skills
        )
      `)
      .eq('id', id);

    // If not admin, only allow access to user's own interviews
    if (currentUser.role !== 'admin') {
      query = query.eq('candidate_id', userId);
    }

    const { data: interview, error } = await query.single();

    if (error || !interview) {
      return new Response(
        JSON.stringify({ error: 'Interview not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    return new Response(
      JSON.stringify({ interview }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Get interview error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

async function handleUpdateInterview(id, body, headers, supabase) {
  try {
    // Get user token from custom header
    const userToken = extractUserToken(headers);
    if (!userToken) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Extract user ID from JWT token
    const decodedToken = decodeJWT(userToken);
    if (!decodedToken || !decodedToken.userId) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    const userId = decodedToken.userId;

    // Get user role to determine access
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError || !currentUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    // Check if interview exists and user has access
    let query = supabase
      .from('interviews')
      .select('id, candidate_id')
      .eq('id', id);

    // If not admin, only allow access to user's own interviews
    if (currentUser.role !== 'admin') {
      query = query.eq('candidate_id', userId);
    }

    const { data: existingInterview, error: checkError } = await query.single();

    if (checkError || !existingInterview) {
      return new Response(
        JSON.stringify({ error: 'Interview not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    // Process update data
    const { scheduled_time, ...bodyWithoutTime } = body;
    
    // Handle scheduled_date - it might already be a timestamp or need to be combined
    let scheduledDateTime = null;
    if (body.scheduled_date) {
      if (body.scheduled_time) {
        // If both date and time are provided separately, combine them
        scheduledDateTime = new Date(`${body.scheduled_date}T${body.scheduled_time}`).toISOString();
      } else {
        // If scheduled_date is already a timestamp, use it as is
        scheduledDateTime = body.scheduled_date;
      }
    }

    // Prepare update data
    const updateData = {
      ...bodyWithoutTime,
      scheduled_date: scheduledDateTime,
      updated_at: new Date().toISOString()
    };

    // Update the interview
    const { data: updatedInterview, error: updateError } = await supabase
      .from('interviews')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        candidate:users!interviews_candidate_id_fkey(
          id,
          name,
          email,
          role,
          phone,
          current_position,
          experience_years,
          skills
        )
      `)
      .single();

    if (updateError) {
      console.error('Update interview error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update interview' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Interview updated successfully',
        interview: updatedInterview
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Update interview error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

async function handleDeleteInterview(id, headers, supabase) {
  try {
    // Get user token from custom header
    const userToken = extractUserToken(headers);
    if (!userToken) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Extract user ID from JWT token
    const decodedToken = decodeJWT(userToken);
    if (!decodedToken || !decodedToken.userId) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    const userId = decodedToken.userId;

    // Get user role to determine access
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError || !currentUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    // Check if interview exists and user has access
    let query = supabase
      .from('interviews')
      .select('id, candidate_id')
      .eq('id', id);

    // If not admin, only allow access to user's own interviews
    if (currentUser.role !== 'admin') {
      query = query.eq('candidate_id', userId);
    }

    const { data: existingInterview, error: checkError } = await query.single();

    if (checkError || !existingInterview) {
      return new Response(
        JSON.stringify({ error: 'Interview not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    // Delete the interview
    const { error: deleteError } = await supabase
      .from('interviews')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete interview error:', deleteError);
      return new Response(
        JSON.stringify({ error: 'Failed to delete interview' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Interview deleted successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Delete interview error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

async function handleGetProfile(headers, supabase) {
  try {
    // Get user token from custom header
    const userToken = extractUserToken(headers);
    if (!userToken) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Extract user ID from JWT token
    const decodedToken = decodeJWT(userToken);
    if (!decodedToken || !decodedToken.userId) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    const userId = decodedToken.userId;

    // Get user profile by ID
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, phone, resume_url, current_position, experience_years, skills, created_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    return new Response(
      JSON.stringify({ user }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Get profile error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

async function handleUpdateProfile(body, headers, supabase) {
  try {
    // Get user token from custom header
    const userToken = extractUserToken(headers);
    if (!userToken) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Extract user ID from JWT token
    const decodedToken = decodeJWT(userToken);
    if (!decodedToken || !decodedToken.userId) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    const userId = decodedToken.userId;
    const updateData = body; // Use the entire body as update data

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, email, name, role, phone, resume_url, current_position, experience_years, skills, created_at')
      .single();

    if (error) {
      console.error('Update profile error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to update profile' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Profile updated successfully',
        user
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Update profile error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

async function handleGetAllUsers(headers, supabase) {
  try {
    // Get user token from custom header
    const userToken = extractUserToken(headers);
    if (!userToken) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Extract user ID from JWT token
    const decodedToken = decodeJWT(userToken);
    if (!decodedToken || !decodedToken.userId) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Check if user is admin
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', decodedToken.userId)
      .single();

    if (userError || !currentUser || currentUser.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403 
        }
      );
    }

    // Get all users
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, role, phone, current_position, experience_years, skills, email_verified, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get all users error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch users' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    return new Response(
      JSON.stringify({ users }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Get all users error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

async function handleCreateUser(body, headers, supabase) {
  // Implement create user logic
  return new Response(
    JSON.stringify({ message: 'Create user endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleGetCandidates(headers, supabase) {
  try {
    // Get user token from custom header
    const userToken = extractUserToken(headers);
    if (!userToken) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Extract user ID from JWT token
    const decodedToken = decodeJWT(userToken);
    if (!decodedToken || !decodedToken.userId) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    const userId = decodedToken.userId;

    // Get user role to determine access
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError || !currentUser) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    let query = supabase
      .from('users')
      .select(`
        id,
        email,
        name,
        role,
        phone,
        resume_url,
        current_position,
        experience_years,
        skills,
        created_at
      `)
      .order('created_at', { ascending: false });

    // If not admin, only show candidates (users with role 'candidate')
    if (currentUser.role !== 'admin') {
      query = query.eq('role', 'candidate');
    }

    const { data: candidates, error } = await query;

    if (error) {
      console.error('Get candidates error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch candidates' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    return new Response(
      JSON.stringify({ candidates: candidates || [] }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Get candidates error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

async function handleCreateCandidate(body, headers, supabase) {
  // Implement create candidate logic
  return new Response(
    JSON.stringify({ message: 'Create candidate endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleGetCandidate(id, headers, supabase) {
  // Implement get candidate logic
  return new Response(
    JSON.stringify({ message: `Get candidate ${id} endpoint - implement your logic here` }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleUpdateCandidate(id, body, headers, supabase) {
  // Implement update candidate logic
  return new Response(
    JSON.stringify({ message: `Update candidate ${id} endpoint - implement your logic here` }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleDeleteCandidate(id, headers, supabase) {
  // Implement delete candidate logic
  return new Response(
    JSON.stringify({ message: `Delete candidate ${id} endpoint - implement your logic here` }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleGetAdminDashboard(headers, supabase) {
  try {
    // Get user token from custom header
    const userToken = extractUserToken(headers);
    if (!userToken) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Extract user ID from JWT token
    const decodedToken = decodeJWT(userToken);
    if (!decodedToken || !decodedToken.userId) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Check if user is admin
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', decodedToken.userId)
      .single();

    if (userError || !currentUser || currentUser.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403 
        }
      );
    }

    // Get all users count
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersError) {
      console.error('Get users count error:', usersError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch users count' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    // Get candidates count
    const { count: totalCandidates, error: candidatesError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'candidate');

    if (candidatesError) {
      console.error('Get candidates count error:', candidatesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch candidates count' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    // Get all interviews
    const { data: interviews, error: interviewsError } = await supabase
      .from('interviews')
      .select('*');

    if (interviewsError) {
      console.error('Get interviews error:', interviewsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch interviews' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    // Calculate interview stats
    const totalInterviews = interviews?.length || 0;
    const completedInterviews = interviews?.filter(i => i.status === 'completed').length || 0;
    const upcomingInterviews = interviews?.filter(i => i.status === 'scheduled').length || 0;

    const stats = {
      totalUsers: totalUsers || 0,
      totalCandidates: totalCandidates || 0,
      totalInterviews,
      completedInterviews,
      upcomingInterviews
    };

    return new Response(
      JSON.stringify({ stats }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Get admin dashboard error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

async function handleGetUserDashboard(headers, supabase) {
  try {
    // Get user token from custom header
    const userToken = extractUserToken(headers);
    if (!userToken) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Extract user ID from JWT token
    const decodedToken = decodeJWT(userToken);
    if (!decodedToken || !decodedToken.userId) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    const userId = decodedToken.userId;

    // Get user's interviews
    const { data: interviews, error: interviewsError } = await supabase
      .from('interviews')
      .select('*')
      .eq('candidate_id', userId);

    if (interviewsError) {
      console.error('Get user interviews error:', interviewsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch interviews' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    // Calculate interview stats for the user
    const totalInterviews = interviews?.length || 0;
    const completedInterviews = interviews?.filter(i => i.status === 'completed').length || 0;
    const upcomingInterviews = interviews?.filter(i => i.status === 'scheduled').length || 0;
    
    // Calculate today's interviews
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const todaysInterviews = interviews?.filter(i => {
      if (!i.scheduled_date) return false;
      const interviewDate = new Date(i.scheduled_date);
      return interviewDate >= todayStart && interviewDate < todayEnd;
    }).length || 0;

    const stats = {
      totalInterviews,
      completedInterviews,
      upcomingInterviews,
      todaysInterviews
    };

    return new Response(
      JSON.stringify({ stats }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Get user dashboard error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

async function handleGetAdminInterviews(headers, supabase) {
  try {
    // Get user token from custom header
    const userToken = extractUserToken(headers);
    if (!userToken) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Extract user ID from JWT token
    const decodedToken = decodeJWT(userToken);
    if (!decodedToken || !decodedToken.userId) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      );
    }

    // Check if user is admin
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', decodedToken.userId)
      .single();

    if (userError || !currentUser || currentUser.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403 
        }
      );
    }

    // Get all interviews with candidate information
    const { data: interviews, error } = await supabase
      .from('interviews')
      .select(`
        *,
        users!interviews_candidate_id_fkey (
          name,
          email,
          phone
        )
      `)
      .order('scheduled_date', { ascending: false });

    if (error) {
      console.error('Get admin interviews error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch interviews' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    return new Response(
      JSON.stringify({ interviews: interviews || [] }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Get admin interviews error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
} 