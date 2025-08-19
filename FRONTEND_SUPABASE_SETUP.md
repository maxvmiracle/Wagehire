# Frontend Setup for Supabase Backend

This guide will help you update your React frontend to work with the Supabase backend deployment.

## Prerequisites

1. **Supabase Project**: Your backend should be deployed to Supabase
2. **Supabase URL and Keys**: Get these from your Supabase project settings
3. **React App**: Your existing Wagehire frontend

## Installation

### 1. Install Supabase Client

```bash
cd frontend
npm install @supabase/supabase-js
```

### 2. Update API Configuration

Create a new configuration file for Supabase:

```javascript
// src/config/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project-ref.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// API base URL for Edge Functions
export const API_BASE_URL = `${supabaseUrl}/functions/v1/api`
```

### 3. Update Environment Variables

Create or update your `.env` file:

```env
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_API_BASE_URL=https://your-project-ref.supabase.co/functions/v1/api
```

## Authentication Updates

### 1. Update AuthContext

Replace your existing `AuthContext.js` with Supabase authentication:

```javascript
// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, name, role = 'user') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
```

### 2. Update API Service

Update your API service to use the new Supabase endpoints:

```javascript
// src/services/api.js
import { API_BASE_URL } from '../config/supabase'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'API request failed')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  }

  // Candidate endpoints
  async getCandidates() {
    return this.request('/candidates')
  }

  async createCandidate(candidateData) {
    return this.request('/candidates', {
      method: 'POST',
      body: JSON.stringify(candidateData)
    })
  }

  // Interview endpoints
  async getInterviews() {
    return this.request('/interviews')
  }

  async createInterview(interviewData) {
    return this.request('/interviews', {
      method: 'POST',
      body: JSON.stringify(interviewData)
    })
  }

  // User endpoints
  async getUsers() {
    return this.request('/users')
  }

  // Admin endpoints
  async getStats() {
    return this.request('/admin/stats')
  }
}

export const apiService = new ApiService()
```

## Component Updates

### 1. Update Login Component

```javascript
// src/pages/Login.js
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
```

### 2. Update Register Component

```javascript
// src/pages/Register.js
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match')
    }

    setLoading(true)

    try {
      const { error } = await signUp(formData.email, formData.password, formData.name)
      if (error) {
        setError(error.message)
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <input
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
```

## Protected Routes

Update your route protection to use Supabase authentication:

```javascript
// src/components/ProtectedRoute.js
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.user_metadata?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
```

## Testing

### 1. Test Authentication

1. Start your development server
2. Navigate to `/register` and create a new account
3. Try logging in with the created account
4. Verify that protected routes work correctly

### 2. Test API Endpoints

1. Check the browser's network tab to ensure API calls are going to the correct endpoints
2. Verify that data is being fetched and displayed correctly
3. Test creating new candidates and interviews

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your Supabase project allows your frontend domain
2. **Authentication Errors**: Verify your Supabase URL and keys are correct
3. **API Errors**: Check that your Edge Function is deployed and accessible

### Debug Mode

Add console logs to debug authentication:

```javascript
// In AuthContext
useEffect(() => {
  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Session:', session)
    setUser(session?.user ?? null)
    setLoading(false)
  }
  // ...
}, [])
```

## Migration Checklist

- [ ] Install `@supabase/supabase-js`
- [ ] Update environment variables
- [ ] Replace `AuthContext` with Supabase version
- [ ] Update API service to use new endpoints
- [ ] Update Login and Register components
- [ ] Update protected routes
- [ ] Test authentication flow
- [ ] Test API endpoints
- [ ] Update any remaining components that use the old API

## Next Steps

1. **Email Verification**: Configure email verification in Supabase
2. **Password Reset**: Implement password reset functionality
3. **Social Auth**: Add social authentication providers
4. **Real-time**: Implement real-time features using Supabase subscriptions 