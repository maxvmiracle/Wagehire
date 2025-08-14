import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('form'); // 'form', 'success', 'error'
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid reset link. Please check your email and try again.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password
      });
      
      setStatus('success');
      setMessage(response.data.message);
      toast.success('Password reset successfully!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setStatus('error');
      const errorMessage = error.response?.data?.error || 'Password reset failed. Please try again.';
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Lock className="w-16 h-16 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'success':
        return 'Password Reset Successfully!';
      case 'error':
        return 'Reset Failed';
      default:
        return 'Reset Your Password';
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="wagehire-logo justify-center mb-6">
              <div className="wagehire-logo-icon">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <span className="wagehire-logo-text text-2xl">Wagehire</span>
            </div>
            
            <div className="flex justify-center mb-6">
              {getStatusIcon()}
            </div>
            
            <h2 className={`text-3xl font-bold ${getStatusColor()} mb-4`}>
              {getStatusTitle()}
            </h2>
            
            <p className="text-gray-600 text-lg mb-8">
              {message}
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-pink-100">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="wagehire-logo justify-center mb-6">
              <div className="wagehire-logo-icon">
                <XCircle className="h-8 w-8 text-white" />
              </div>
              <span className="wagehire-logo-text text-2xl">Wagehire</span>
            </div>
            
            <div className="flex justify-center mb-6">
              {getStatusIcon()}
            </div>
            
            <h2 className={`text-3xl font-bold ${getStatusColor()} mb-4`}>
              {getStatusTitle()}
            </h2>
            
            <p className="text-gray-600 text-lg mb-8">
              {message}
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">
                The reset link may have expired or is invalid. Please request a new password reset link.
              </p>
            </div>
            
            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="wagehire-logo justify-center mb-6">
            <div className="wagehire-logo-icon">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <span className="wagehire-logo-text text-2xl">Wagehire</span>
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Enter your new password below.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10 bg-white/90 backdrop-blur-sm border-white/20 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input pr-10 bg-white/90 backdrop-blur-sm border-white/20 text-gray-900 placeholder-gray-500"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Resetting password...</span>
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 