import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, use the same domain (Vercel will handle routing)
    return '/api';
  }
  // In development, use the proxy
  return '/api';
};

// Create axios instance with default config
const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
};

export default api; 