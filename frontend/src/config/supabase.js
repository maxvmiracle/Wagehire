import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://stgtlwqszoxpquikadwn.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Z3Rsd3Fzem94cHF1aWthZHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzE2NTcsImV4cCI6MjA3MTIwNzY1N30.qE9hG1RAMQfjHvgbDrCf6gm3SOOvax2Ug0GJCPDBnA4'

// Determine the redirect URL based on environment
const getRedirectUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://wagehire.vercel.app'
  }
  return 'http://localhost:3000'
}

// Create Supabase client with redirect URL configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    redirectTo: getRedirectUrl()
  }
})

// Helper function to get user role
export const getUserRole = (user) => {
  if (!user) return null
  return user.user_metadata?.role || 'user'
}

// Helper function to check if user is admin
export const isAdmin = (user) => {
  return getUserRole(user) === 'admin'
}

// Helper function to check if user is candidate
export const isCandidate = (user) => {
  return getUserRole(user) === 'candidate'
}

// Helper function to check if user is interviewer
export const isInterviewer = (user) => {
  return getUserRole(user) === 'interviewer'
}

export default supabase 