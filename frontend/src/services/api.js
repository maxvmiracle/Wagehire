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
});

// Add token to requests if available (except for auth endpoints)
api.interceptors.request.use((config) => {
  // Don't add token for authentication endpoints
  const authEndpoints = ['/auth/login', '/auth/register', '/auth/resend-verification', '/auth/manual-verification'];
  const isAuthEndpoint = authEndpoints.some(endpoint => config.url?.includes(endpoint));
  
  if (!isAuthEndpoint) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding token to request:', config.url);
    } else {
      console.log('No token found for request:', config.url);
    }
  } else {
    console.log('Auth endpoint - skipping token for:', config.url);
  }
  return config;
});

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
    const response = await api.post('/interviews', interviewData);
    return response.data;
  },

  // Update interview
  update: async (id, updateData) => {
    const response = await api.put(`/interviews/${id}`, updateData);
    return response.data;
  },

  // Delete interview
  delete: async (id) => {
    const response = await api.delete(`/interviews/${id}`);
    return response.data;
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