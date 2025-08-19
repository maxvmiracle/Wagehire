import { supabase } from '../config/supabase';

// Supabase API service
export const api = {
  // Auth APIs
  auth: {
    // Login user
    login: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return {
        user: data.user,
        session: data.session
      };
    },

    // Register user
    register: async (email, password, userData) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'user'
          }
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return {
        user: data.user,
        session: data.session,
        requiresVerification: !data.session // If no session, email verification is required
      };
    },

    // Logout user
    logout: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    },

    // Get current user
    getCurrentUser: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        throw new Error(error.message);
      }
      return user;
    },

    // Get current session
    getCurrentSession: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        throw new Error(error.message);
      }
      return session;
    },

    // Reset password
    resetPassword: async (email) => {
      const redirectUrl = process.env.NODE_ENV === 'production' 
        ? 'https://wagehire.vercel.app/reset-password'
        : `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });
      if (error) {
        throw new Error(error.message);
      }
    },

    // Update password
    updatePassword: async (newPassword) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) {
        throw new Error(error.message);
      }
    }
  },

  // User APIs
  users: {
    // Get all users
    getAll: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },

    // Get user profile
    getProfile: async (userId) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },

    // Update user profile
    updateProfile: async (userId, profileData) => {
      const { data, error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
  },

  // Candidate APIs
  candidates: {
    // Get all candidates
    getAll: async () => {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },

    // Get candidate by ID
    getById: async (id) => {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },

    // Create new candidate
    create: async (candidateData) => {
      const { data, error } = await supabase
        .from('candidates')
        .insert(candidateData)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },

    // Update candidate
    update: async (id, updateData) => {
      const { data, error } = await supabase
        .from('candidates')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },

    // Delete candidate
    delete: async (id) => {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
    }
  },

  // Interview APIs
  interviews: {
    // Get all interviews with optional filters
    getAll: async (filters = {}) => {
      let query = supabase
        .from('interviews')
        .select(`
          *,
          candidates (id, name, email),
          users (id, name, email)
        `)
        .order('scheduled_date', { ascending: true });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.candidate_id) {
        query = query.eq('candidate_id', filters.candidate_id);
      }
      if (filters.interviewer_id) {
        query = query.eq('interviewer_id', filters.interviewer_id);
      }

      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },

    // Get interview by ID
    getById: async (id) => {
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          candidates (id, name, email),
          users (id, name, email)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },

    // Create new interview
    create: async (interviewData) => {
      const { data, error } = await supabase
        .from('interviews')
        .insert(interviewData)
        .select(`
          *,
          candidates (id, name, email),
          users (id, name, email)
        `)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },

    // Update interview
    update: async (id, updateData) => {
      const { data, error } = await supabase
        .from('interviews')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          candidates (id, name, email),
          users (id, name, email)
        `)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },

    // Delete interview
    delete: async (id) => {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
    },

    // Submit interview feedback
    submitFeedback: async (id, feedbackData) => {
      const { data, error } = await supabase
        .from('interviews')
        .update({
          feedback: feedbackData.feedback,
          status: feedbackData.status || 'completed'
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
  },

  // Interview Submissions APIs
  submissions: {
    // Get submissions for an interview
    getByInterviewId: async (interviewId) => {
      const { data, error } = await supabase
        .from('interview_submissions')
        .select('*')
        .eq('interview_id', interviewId)
        .order('submitted_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },

    // Create submission
    create: async (submissionData) => {
      const { data, error } = await supabase
        .from('interview_submissions')
        .insert(submissionData)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },

    // Update submission
    update: async (id, updateData) => {
      const { data, error } = await supabase
        .from('interview_submissions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
  }
};

// Legacy API exports for backward compatibility
export const interviewApi = api.interviews;
export const candidateApi = api.candidates;
export const userApi = api.users;

export default api; 