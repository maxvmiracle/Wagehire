import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../config/supabase';
import { getUserRole, isAdmin, isCandidate, isInterviewer } from '../config/supabase';

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
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Debug logging
  console.log('AuthContext - Initial user:', user);
  console.log('AuthContext - Environment:', process.env.NODE_ENV);

  // Listen for auth changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext - Auth state changed:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast.success('Login successful!');
      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle email verification error
      if (error.message.includes('Email not confirmed')) {
        toast.error('Please verify your email address before logging in');
        return { success: false, error: error.message, emailNotVerified: true };
      }
      
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Registration attempt with data:', userData);
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'user'
          }
        }
      });

      if (error) {
        throw error;
      }

      console.log('Registration response:', data);
      
      // Check if email confirmation is required
      if (!data.session) {
        toast.success('Registration successful! Please check your email to verify your account.');
        return { 
          success: true, 
          requiresVerification: true,
          emailVerificationSent: true,
          user: data.user
        };
      }
      
      // User is automatically signed in
      toast.success('Registration successful! Welcome to Wagehire!');
      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      console.log('AuthContext: Updating profile with data:', profileData);
      
      // Update user metadata
      const { data, error } = await supabase.auth.updateUser({
        data: profileData
      });

      if (error) {
        throw error;
      }

      console.log('AuthContext: Profile update response:', data);
      setUser(data.user);
      toast.success('Profile updated successfully!');
      return { success: true, user: data.user };
    } catch (error) {
      console.error('AuthContext: Profile update error:', error);
      toast.error(error.message || 'Profile update failed');
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw error;
      }

      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Password reset failed');
      return { success: false, error: error.message };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      toast.success('Password updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Password update error:', error);
      toast.error(error.message || 'Password update failed');
      return { success: false, error: error.message };
    }
  };

  // Helper functions for user roles
  const getUserRoleHelper = () => {
    return getUserRole(user);
  };

  const isAdminHelper = () => {
    return isAdmin(user);
  };

  const isCandidateHelper = () => {
    return isCandidate(user);
  };

  const isInterviewerHelper = () => {
    return isInterviewer(user);
  };

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    updatePassword,
    isAuthenticated: !!user,
    // Role-based helper functions
    isAdmin: isAdminHelper,
    isCandidate: isCandidateHelper,
    isInterviewer: isInterviewerHelper,
    getUserRole: getUserRoleHelper,
    hasRole: (role) => getUserRole(user) === role,
    // Permission helper functions
    canManageAllCandidates: () => isAdmin(user),
    canManageAllUsers: () => isAdmin(user),
    canManageAllInterviews: () => isAdmin(user),
    canManageOwnProfile: () => !!user, // All authenticated users can manage their own profile
    canScheduleInterviews: () => !!user, // All authenticated users can schedule interviews
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 