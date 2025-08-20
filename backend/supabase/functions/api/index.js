import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse the request
    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/api', '')
    const method = req.method
    const body = method !== 'GET' ? await req.json() : null
    const headers = Object.fromEntries(req.headers.entries())

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

// Placeholder handlers - you'll need to implement these based on your existing logic
async function handleRegister(body, supabase) {
  // Implement registration logic
  return new Response(
    JSON.stringify({ message: 'Registration endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleLogin(body, supabase) {
  // Implement login logic
  return new Response(
    JSON.stringify({ message: 'Login endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
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
  // Implement get interviews logic
  return new Response(
    JSON.stringify({ message: 'Get interviews endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleCreateInterview(body, headers, supabase) {
  // Implement create interview logic
  return new Response(
    JSON.stringify({ message: 'Create interview endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleGetInterview(id, headers, supabase) {
  // Implement get interview logic
  return new Response(
    JSON.stringify({ message: `Get interview ${id} endpoint - implement your logic here` }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleUpdateInterview(id, body, headers, supabase) {
  // Implement update interview logic
  return new Response(
    JSON.stringify({ message: `Update interview ${id} endpoint - implement your logic here` }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleDeleteInterview(id, headers, supabase) {
  // Implement delete interview logic
  return new Response(
    JSON.stringify({ message: `Delete interview ${id} endpoint - implement your logic here` }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleGetProfile(headers, supabase) {
  // Implement get profile logic
  return new Response(
    JSON.stringify({ message: 'Get profile endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleUpdateProfile(body, headers, supabase) {
  // Implement update profile logic
  return new Response(
    JSON.stringify({ message: 'Update profile endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

async function handleGetAllUsers(headers, supabase) {
  // Implement get all users logic
  return new Response(
    JSON.stringify({ message: 'Get all users endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
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
  // Implement get candidates logic
  return new Response(
    JSON.stringify({ message: 'Get candidates endpoint - implement your logic here' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
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