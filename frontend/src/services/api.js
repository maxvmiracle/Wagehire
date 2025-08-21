import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, use the Supabase API URL
    return process.env.REACT_APP_API_BASE_URL || 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
  }
  // In development, use the Supabase API URL
  return process.env.REACT_APP_API_BASE_URL || 'https://xzndkdqlsllwyygbniht.supabase.co/functions/v1/api';
};

// Create axios instance with default config
const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add authorization headers to all requests
api.interceptors.request.use((config) => {
  // Always add Supabase anon key for Edge Function access
  const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bmRrZHFsc2xsd3l5Z2JuaWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDc2ODMsImV4cCI6MjA3MTI4MzY4M30.hW0GaAfwNUgsR9_JFgqfi96yP-odqqBc7T6Q2OpxTJQ';
  config.headers.Authorization = `Bearer ${supabaseAnonKey}`;
  
  // For authenticated endpoints, add user JWT token as well
  const authEndpoints = ['/auth/login', '/auth/register', '/auth/resend-verification', '/auth/manual-verification'];
  const isAuthEndpoint = authEndpoints.some(endpoint => config.url?.includes(endpoint));
  
  if (!isAuthEndpoint) {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      // For non-auth endpoints, we can add user token in a custom header
      config.headers['X-User-Token'] = userToken;
      console.log('Adding user token to request:', config.url);
    } else {
      console.log('No user token found for request:', config.url);
    }
  } else {
    console.log('Auth endpoint - using Supabase anon key only:', config.url);
  }
  
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle connection errors
    if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_CLOSED')) {
      console.error('Network error detected - connection closed or network issue');
    }
    
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authApi = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },
};

// Interview APIs
export const interviewApi = {
  // Get all interviews with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/interviews?${params}`);
    return response.data;
  },

  // Get single interview by ID
  getById: async (id) => {
    const response = await api.get(`/interviews/${id}`);
    return response.data;
  },

  // Create new interview
  create: async (interviewData) => {
    try {
      console.log('API: Creating interview with data:', interviewData);
    const response = await api.post('/interviews', interviewData);
      console.log('API: Interview creation successful:', response.data);
    return response.data;
    } catch (error) {
      console.error('API: Interview creation failed:', error);
      console.error('API: Error response:', error.response?.data);
      console.error('API: Error status:', error.response?.status);
      throw error;
    }
  },

  // Update interview
  update: async (id, updateData) => {
    try {
      console.log('API: Updating interview with ID:', id);
      console.log('API: Update data:', updateData);
    const response = await api.put(`/interviews/${id}`, updateData);
      console.log('API: Interview update successful:', response.data);
    return response.data;
    } catch (error) {
      console.error('API: Interview update failed:', error);
      console.error('API: Error response:', error.response?.data);
      console.error('API: Error status:', error.response?.status);
      throw error;
    }
  },

  // Delete interview
  delete: async (id) => {
    try {
      console.log('API: Deleting interview with ID:', id);
    const response = await api.delete(`/interviews/${id}`);
      console.log('API: Interview deletion successful:', response.data);
    return response.data;
    } catch (error) {
      console.error('API: Interview deletion failed:', error);
      console.error('API: Error response:', error.response?.data);
      console.error('API: Error status:', error.response?.status);
      throw error;
    }
  },

  // Submit interview feedback
  submitFeedback: async (id, feedbackData) => {
    const response = await api.post(`/interviews/${id}/feedback`, feedbackData);
    return response.data;
  },
};

// Candidate APIs
export const candidateApi = {
  // Get all candidates
  getAll: async () => {
    const response = await api.get('/candidates');
    return response.data;
  },

  // Get single candidate by ID
  getById: async (id) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  // Create new candidate
  create: async (candidateData) => {
    const response = await api.post('/candidates', candidateData);
    return response.data;
  },

  // Update candidate
  update: async (id, updateData) => {
    const response = await api.put(`/candidates/${id}`, updateData);
    return response.data;
  },

  // Delete candidate
  delete: async (id) => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  },
};

// User APIs
export const userApi = {
  // Get all users (interviewers)
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
};

// Health check API
export const healthApi = {
  // Check API health
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api; 