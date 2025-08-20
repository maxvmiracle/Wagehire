import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-token, X-User-Token',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
}

// JWT Secret (in production, use environment variable)
const JWT_SECRET = Deno.env.get('JWT_SECRET') || 'your-secret-key';

// Utility functions
function extractUserToken(headers: any): string | null {
  // Check for user token in custom header
  const userToken = headers['x-user-token'] || headers['X-User-Token'];
  return userToken || null;
}

function decodeJWT(token: string): any {
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

function validateStrongPassword(password: string) {
  const errors: string[] = [];
  
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

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
}

function generateJWT(payload: any): string {
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
  const signature = btoa(JWT_SECRET);
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
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
    const body = method !== 'GET' ? await req.json() : null
    const headers = Object.fromEntries(req.headers.entries())
    
    // Debug logging
    console.log('Request URL:', req.url)
    console.log('Path:', path)
    console.log('Method:', method)

    // Health check endpoint
    if (path === '/health' && method === 'GET') {
      console.log('Health endpoint matched!');
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
async function handleAuthRoutes(path: string, method: string, body: any, headers: any, supabase: any) {
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
async function handleInterviewRoutes(path: string, method: string, body: any, headers: any, supabase: any) {
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
async function handleUserRoutes(path: string, method: string, body: any, headers: any, supabase: any) {
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
async function handleAdminRoutes(path: string, method: string, body: any, headers: any, supabase: any) {
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
async function handleCandidateRoutes(path: string, method: string, body: any, headers: any, supabase: any) {
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

// Authentication handlers
async function handleRegister(body: any, supabase: any) {
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
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const isFirstUser = userCount === 0;
    const userRole = isFirstUser ? 'admin' : 'candidate';

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        name,
        role: userRole,
        phone,
        resume_url,
        current_position,
        experience_years,
        skills,
        email_verified: true
      })
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

    return new Response(
      JSON.stringify({
        message: isFirstUser ? 'Admin account created successfully! You can now login.' : 'Registration successful! You can now login.',
        user: newUser,
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

async function handleLogin(body: any, supabase: any) {
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

async function handleVerifyEmail(body: any, supabase: any) {
  // Implement email verification logic
  return new Response(
    JSON.stringify({ message: 'Email verification endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleForgotPassword(body: any, supabase: any) {
  // Implement forgot password logic
  return new Response(
    JSON.stringify({ message: 'Forgot password endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleResetPassword(body: any, supabase: any) {
  // Implement reset password logic
  return new Response(
    JSON.stringify({ message: 'Reset password endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleGetInterviews(headers: any, supabase: any) {
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

    // For now, get all interviews (in production, filter by user role)
    const { data: interviews, error } = await supabase
      .from('interviews')
      .select(`
        *,
        users!interviews_candidate_id_fkey (
          name,
          email
        )
      `)
      .order('scheduled_date', { ascending: false });

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
      JSON.stringify({ interviews }),
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

async function handleCreateInterview(body: any, headers: any, supabase: any) {
  try {
    const {
      candidate_id,
      company_name,
      job_title,
      scheduled_date,
      duration = 60,
      status = 'scheduled',
      round = 1,
      interview_type = 'technical',
      location,
      notes,
      company_website,
      company_linkedin_url,
      other_urls,
      job_description,
      salary_range,
      interviewer_name,
      interviewer_email,
      interviewer_position,
      interviewer_linkedin_url
    } = body;

    // Validate required fields
    if (!candidate_id || !company_name || !job_title) {
      return new Response(
        JSON.stringify({ error: 'Candidate ID, company name, and job title are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Insert new interview
    const { data: interview, error } = await supabase
      .from('interviews')
      .insert({
        candidate_id,
        company_name,
        job_title,
        scheduled_date,
        duration,
        status,
        round,
        interview_type,
        location,
        notes,
        company_website,
        company_linkedin_url,
        other_urls,
        job_description,
        salary_range,
        interviewer_name,
        interviewer_email,
        interviewer_position,
        interviewer_linkedin_url
      })
      .select()
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
        message: 'Interview created successfully',
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

async function handleGetInterview(id: string, headers: any, supabase: any) {
  try {
    const { data: interview, error } = await supabase
      .from('interviews')
      .select(`
        *,
        users!interviews_candidate_id_fkey (
          name,
          email,
          phone,
          resume_url
        )
      `)
      .eq('id', id)
      .single();

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

async function handleUpdateInterview(id: string, body: any, headers: any, supabase: any) {
  try {
    const { data: interview, error } = await supabase
      .from('interviews')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update interview error:', error);
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
        interview
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

async function handleDeleteInterview(id: string, headers: any, supabase: any) {
  try {
    const { error } = await supabase
      .from('interviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete interview error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to delete interview' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Interview deleted successfully'
      }),
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

async function handleGetProfile(headers: any, supabase: any) {
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

async function handleUpdateProfile(body: any, headers: any, supabase: any) {
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

async function handleGetAllUsers(headers: any, supabase: any) {
  // Implement get all users logic
  return new Response(
    JSON.stringify({ message: 'Get all users endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleCreateUser(body: any, headers: any, supabase: any) {
  // Implement create user logic
  return new Response(
    JSON.stringify({ message: 'Create user endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleGetCandidates(headers: any, supabase: any) {
  // Implement get candidates logic
  return new Response(
    JSON.stringify({ message: 'Get candidates endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleCreateCandidate(body: any, headers: any, supabase: any) {
  // Implement create candidate logic
  return new Response(
    JSON.stringify({ message: 'Create candidate endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleGetCandidate(id: string, headers: any, supabase: any) {
  // Implement get candidate logic
  return new Response(
    JSON.stringify({ message: `Get candidate ${id} endpoint - implement your logic here` }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleUpdateCandidate(id: string, body: any, headers: any, supabase: any) {
  // Implement update candidate logic
  return new Response(
    JSON.stringify({ message: `Update candidate ${id} endpoint - implement your logic here` }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleDeleteCandidate(id: string, headers: any, supabase: any) {
  // Implement delete candidate logic
  return new Response(
    JSON.stringify({ message: `Delete candidate ${id} endpoint - implement your logic here` }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

// Dashboard handlers
async function handleGetUserDashboard(headers: any, supabase: any) {
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

    // For now, return basic stats (in production, calculate from database)
    const stats = {
      totalInterviews: 0,
      completedInterviews: 0,
      upcomingInterviews: 0,
      profileCompletion: 75
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

async function handleGetAdminDashboard(headers: any, supabase: any) {
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

    // For now, return basic admin stats (in production, calculate from database)
    const stats = {
      totalUsers: 0,
      totalCandidates: 0,
      totalInterviews: 0,
      completedInterviews: 0,
      upcomingInterviews: 0
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

async function handleGetAdminInterviews(headers: any, supabase: any) {
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

    // For now, return empty interviews array (in production, get from database)
    const interviews = [];

    return new Response(
      JSON.stringify({ interviews }),
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