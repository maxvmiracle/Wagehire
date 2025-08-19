import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Use built-in Supabase environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method

    // Health check
    if (path === '/api/health' && method === 'GET') {
      return new Response(
        JSON.stringify({ status: 'OK', message: 'Wagehire API is running' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Auth routes
    if (path.startsWith('/api/auth')) {
      return await handleAuthRoutes(req, path, method)
    }

    // Interview routes
    if (path.startsWith('/api/interviews')) {
      return await handleInterviewRoutes(req, path, method)
    }

    // User routes
    if (path.startsWith('/api/users')) {
      return await handleUserRoutes(req, path, method)
    }

    // Admin routes
    if (path.startsWith('/api/admin')) {
      return await handleAdminRoutes(req, path, method)
    }

    // Candidate routes
    if (path.startsWith('/api/candidates')) {
      return await handleCandidateRoutes(req, path, method)
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
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

// Auth routes handler
async function handleAuthRoutes(req: Request, path: string, method: string) {
  const url = new URL(req.url)
  
  if (path === '/api/auth/register' && method === 'POST') {
    const body = await req.json()
    const { email, password, name, role = 'user' } = body

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Create user
    const { data: user, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role }
    })

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'User registered successfully',
        user: { id: user.user.id, email: user.user.email, name, role }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201 
      }
    )
  }

  if (path === '/api/auth/login' && method === 'POST') {
    const body = await req.json()
    const { email, password } = body

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Login successful',
        user: data.user,
        session: data.session
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
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
async function handleInterviewRoutes(req: Request, path: string, method: string) {
  const url = new URL(req.url)
  
  if (path === '/api/interviews' && method === 'GET') {
    const { data: interviews, error } = await supabase
      .from('interviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    return new Response(
      JSON.stringify(interviews),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  }

  if (path === '/api/interviews' && method === 'POST') {
    const body = await req.json()
    const { candidate_id, interviewer_id, scheduled_time, status = 'scheduled' } = body

    const { data: interview, error } = await supabase
      .from('interviews')
      .insert([{
        candidate_id,
        interviewer_id,
        scheduled_time,
        status
      }])
      .select()
      .single()

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    return new Response(
      JSON.stringify(interview),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201 
      }
    )
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
async function handleUserRoutes(req: Request, path: string, method: string) {
  if (path === '/api/users' && method === 'GET') {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    return new Response(
      JSON.stringify(users),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
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
async function handleAdminRoutes(req: Request, path: string, method: string) {
  if (path === '/api/admin/stats' && method === 'GET') {
    // Get basic stats
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    const { count: totalInterviews } = await supabase
      .from('interviews')
      .select('*', { count: 'exact', head: true })

    const { count: totalCandidates } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })

    return new Response(
      JSON.stringify({
        totalUsers,
        totalInterviews,
        totalCandidates
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
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
async function handleCandidateRoutes(req: Request, path: string, method: string) {
  if (path === '/api/candidates' && method === 'GET') {
    const { data: candidates, error } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    return new Response(
      JSON.stringify(candidates),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  }

  if (path === '/api/candidates' && method === 'POST') {
    const body = await req.json()
    const { name, email, phone, resume_url, status = 'pending' } = body

    const { data: candidate, error } = await supabase
      .from('candidates')
      .insert([{
        name,
        email,
        phone,
        resume_url,
        status
      }])
      .select()
      .single()

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    return new Response(
      JSON.stringify(candidate),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201 
      }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Candidate route not found' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404 
    }
  )
} 