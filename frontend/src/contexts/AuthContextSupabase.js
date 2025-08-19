import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://dxzedhdmonbeskuresez.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4emVkaGRtb25iZXNrdXJlc2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzczMTMsImV4cCI6MjA3MTIxMzMxM30.S3HXyhY-TY8BycytKrS2Fr9m_F6ZFjka-x4E-pa2T_Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const [loading, setLoading] = useState(true);

  // Debug logging
  console.log('AuthContext - Supabase URL:', supabaseUrl);
  console.log('AuthContext - Environment:', process.env.NODE_ENV);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || 'Login failed');
        return { success: false, error: error.message };
      }

      console.log('Login successful:', data.user?.email);
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      console.error('Login exception:', error);
      toast.error('Login failed');
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
        console.error('Registration error:', error);
        toast.error(error.message || 'Registration failed');
        return { success: false, error: error.message };
      }

      console.log('Registration successful:', data.user?.email);
      
      if (data.user && !data.session) {
        // Email confirmation required
        toast.success('Registration successful! Please check your email to confirm your account.');
        return { success: true, requiresEmailConfirmation: true };
      } else {
        // Auto-confirmed (if email confirmation is disabled)
        toast.success('Registration successful!');
        return { success: true };
      }
    } catch (error) {
      console.error('Registration exception:', error);
      toast.error('Registration failed');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error('Logout failed');
        return { success: false, error: error.message };
      }

      console.log('Logout successful');
      toast.success('Logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('Logout exception:', error);
      toast.error('Logout failed');
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        console.error('Password reset error:', error);
        toast.error(error.message || 'Password reset failed');
        return { success: false, error: error.message };
      }

      console.log('Password reset email sent');
      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      console.error('Password reset exception:', error);
      toast.error('Password reset failed');
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) {
        console.error('Profile update error:', error);
        toast.error(error.message || 'Profile update failed');
        return { success: false, error: error.message };
      }

      console.log('Profile updated successfully');
      toast.success('Profile updated successfully!');
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Profile update exception:', error);
      toast.error('Profile update failed');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    supabase // Expose supabase client for direct access if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 