import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Debug logging
  console.log('AuthContext - Initial token:', token);
  console.log('AuthContext - Environment:', process.env.NODE_ENV);
  console.log('AuthContext - API URL:', process.env.REACT_APP_API_URL);

  // Set up api defaults
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('AuthContext - Set Authorization header');
    } else {
      delete api.defaults.headers.common['Authorization'];
      console.log('AuthContext - Removed Authorization header');
    }
  }, [token]);

  const checkAuth = useCallback(async () => {
    console.log('AuthContext - Checking auth, token:', !!token);
    
    if (!token) {
      console.log('AuthContext - No token, setting loading to false');
      setLoading(false);
      return;
    }

    try {
      console.log('AuthContext - Making profile request...');
      const response = await api.get('/auth/profile');
      console.log('AuthContext - Profile response:', response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error('AuthContext - Auth check failed:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
      console.log('AuthContext - Auth check complete, loading set to false');
    }
  }, [token]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      
      // Handle email verification error
      if (error.response?.data?.emailNotVerified) {
        toast.error('Please verify your email address before logging in');
        return { success: false, error: message, emailNotVerified: true };
      }
      
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Registration attempt with data:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', response.data);
      
      const { user: userInfo, emailVerificationSent, requiresVerification } = response.data;
      
      console.log('Registration successful, requires verification:', requiresVerification);
      
      if (requiresVerification) {
        toast.success('Registration successful! Please check your email to verify your account.');
        return { 
          success: true, 
          requiresVerification: true,
          emailVerificationSent,
          user: userInfo
        };
      }
      
      // This should not happen with the new flow, but keeping for safety
      toast.success('Registration successful! Welcome to Wagehire!');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      console.log('AuthContext: Updating profile with data:', profileData);
      const response = await api.put('/users/me', profileData);
      console.log('AuthContext: Profile update response:', response.data);
      setUser(response.data.user);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Profile update error:', error);
      console.error('AuthContext: Error response:', error.response);
      const message = error.response?.data?.error || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    // Role-based helper functions
    isAdmin: () => user?.role === 'admin',
    isCandidate: () => user?.role === 'candidate',
    hasRole: (role) => user?.role === role,
    // Permission helper functions
    canManageAllCandidates: () => user?.role === 'admin',
    canManageAllUsers: () => user?.role === 'admin',
    canManageAllInterviews: () => user?.role === 'admin',
    canManageOwnProfile: () => !!user, // All authenticated users can manage their own profile
    canScheduleInterviews: () => !!user, // All authenticated users can schedule interviews
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 