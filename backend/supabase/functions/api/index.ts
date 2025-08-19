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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Parse the request
    const { method, url } = req
    const path = new URL(url).pathname
    const body = method !== 'GET' ? await req.json() : null

    // Route handling
    if (path.startsWith('/api/auth')) {
      return handleAuth(req, supabaseClient)
    } else if (path.startsWith('/api/interviews')) {
      return handleInterviews(req, supabaseClient)
    } else if (path.startsWith('/api/users')) {
      return handleUsers(req, supabaseClient)
    } else if (path.startsWith('/api/admin')) {
      return handleAdmin(req, supabaseClient)
    } else if (path.startsWith('/api/candidates')) {
      return handleCandidates(req, supabaseClient)
    } else if (path === '/api/health') {
      return new Response(
        JSON.stringify({ status: 'OK', message: 'Wagehire API is running on Supabase' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
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
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

// Auth handlers
async function handleAuth(req: Request, supabase: any) {
  const { method } = req
  const body = method !== 'GET' ? await req.json() : null

  if (method === 'POST' && req.url.includes('/register')) {
    // Handle user registration
    const { email, password, name, role } = body
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role }
      }
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
      JSON.stringify({ message: 'User registered successfully', user: data.user }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201 
      }
    )
  }

  if (method === 'POST' && req.url.includes('/login')) {
    // Handle user login
    const { email, password } = body
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
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
    JSON.stringify({ error: 'Auth endpoint not found' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404 
    }
  )
}

// Interview handlers
async function handleInterviews(req: Request, supabase: any) {
  const { method } = req
  const body = method !== 'GET' ? await req.json() : null

  if (method === 'GET') {
    // Get all interviews
    const { data, error } = await supabase
      .from('interviews')
      .select('*')

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
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  }

  if (method === 'POST') {
    // Create new interview
    const { data, error } = await supabase
      .from('interviews')
      .insert(body)
      .select()

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
      JSON.stringify(data[0]),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201 
      }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405 
    }
  )
}

// User handlers
async function handleUsers(req: Request, supabase: any) {
  const { method } = req

  if (method === 'GET') {
    // Get all users
    const { data, error } = await supabase
      .from('users')
      .select('*')

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
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405 
    }
  )
}

// Admin handlers
async function handleAdmin(req: Request, supabase: any) {
  // Admin-specific endpoints
  return new Response(
    JSON.stringify({ message: 'Admin endpoint' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  )
}

// Candidate handlers
async function handleCandidates(req: Request, supabase: any) {
  const { method } = req
  const body = method !== 'GET' ? await req.json() : null

  if (method === 'GET') {
    // Get all candidates
    const { data, error } = await supabase
      .from('candidates')
      .select('*')

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
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  }

  if (method === 'POST') {
    // Create new candidate
    const { data, error } = await supabase
      .from('candidates')
      .insert(body)
      .select()

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
      JSON.stringify(data[0]),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201 
      }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405 
    }
  )
} 