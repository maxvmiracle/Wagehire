import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { authApi, userApi } from '../services/api';

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
  console.log('AuthContext - API URL:', process.env.REACT_APP_API_BASE_URL);

  const checkAuth = useCallback(async () => {
    console.log('AuthContext - Checking auth, token:', !!token);
    
    if (!token) {
      console.log('AuthContext - No token, setting loading to false');
      setLoading(false);
      return;
    }

    try {
      console.log('AuthContext - Making profile request...');
      const response = await userApi.getProfile();
      console.log('AuthContext - Profile response:', response);
      setUser(response.user);
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
      const response = await authApi.login({
        email,
        password
      });

      const { token: newToken, user: userData } = response;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.message || 'Login failed';
      
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Registration attempt with data:', userData);
      const response = await authApi.register(userData);
      console.log('Registration response:', response);
      
      const { user: userInfo, token: newToken, emailVerificationSent, requiresVerification } = response;
      
      console.log('Registration successful, requires verification:', requiresVerification);
      
      // Store token and user data if provided
      if (newToken) {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userInfo);
        console.log('AuthContext - Token stored after registration:', newToken);
      }
      
      if (requiresVerification) {
        toast.success('Registration successful! Please check your email to verify your account.');
        return { 
          success: true, 
          requiresVerification: true,
          emailVerificationSent,
          user: userInfo
        };
      }
      
      // Auto-login after successful registration
      toast.success('Registration successful! Welcome to Wagehire!');
      return { success: true, user: userInfo };
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.message || 'Registration failed';
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
      const response = await userApi.updateProfile(profileData);
      console.log('AuthContext: Profile update response:', response);
      setUser(response.user);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Profile update error:', error);
      const message = error.message || 'Profile update failed';
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