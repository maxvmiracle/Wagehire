import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Mail, ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'pending'
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [manualVerification, setManualVerification] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState('');
  const [showManualVerification, setShowManualVerification] = useState(false);

  useEffect(() => {
    // Check if user came from registration
    if (location.state?.email) {
      setEmail(location.state.email);
      setStatus('pending');
      setMessage(location.state.message || 'Please check your email to verify your account.');
      
      // If manual verification is available, show it
      if (location.state.manualVerification && location.state.verificationUrl) {
        setMessage(location.state.message + ' You can also click the verification link below.');
        setManualVerification(true);
        setVerificationUrl(location.state.verificationUrl);
      }
      return;
    }

    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. Please check your email and try again.');
        return;
      }

      try {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(response.data.message);
        toast.success('Email verified successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        const errorMessage = error.response?.data?.error || 'Email verification failed. Please try again.';
        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    };

    verifyEmail();
  }, [searchParams, navigate, location.state]);

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500" />;
      case 'pending':
        return <Mail className="w-16 h-16 text-blue-500" />;
      default:
        return <Mail className="w-16 h-16 text-blue-500 animate-pulse" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'pending':
        return 'text-blue-600';
      default:
        return 'text-blue-600';
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'success':
        return 'Email Verified Successfully!';
      case 'error':
        return 'Verification Failed';
      case 'pending':
        return 'Check Your Email';
      default:
        return 'Verifying Your Email...';
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Email address not available');
      return;
    }

    setResendLoading(true);
    try {
      const response = await api.post('/auth/resend-verification', { email });
      
      // Always show manual verification
      if (response.data.manualVerification && response.data.verificationUrl) {
        toast.success('Please use the verification link below to confirm your account.');
        setManualVerification(true);
        setVerificationUrl(response.data.verificationUrl);
        setMessage(response.data.message || 'Please use the verification link below to confirm your account.');
      } else {
        toast.error('Failed to generate verification link. Please try again later.');
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to resend verification email';
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleGetManualVerification = async () => {
    if (!email) {
      toast.error('Email address not available');
      return;
    }

    try {
      const response = await api.get(`/auth/manual-verification/${email}`);
      setManualVerification(true);
      setVerificationUrl(response.data.verificationUrl);
      setShowManualVerification(true);
      toast.success('Manual verification link generated!');
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to get manual verification link';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="wagehire-logo justify-center mb-6">
            <div className="wagehire-logo-icon">
              <Mail className="h-8 w-8 text-white" />
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

          {status === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  Your email has been verified successfully. You can now log in to your account.
                </p>
              </div>
              
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
              >
                Go to Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}

          {status === 'pending' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  We've sent a verification email to <strong>{email}</strong>. Please check your inbox and click the verification link to activate your account.
                </p>
              </div>
              
              {/* Manual verification link (shown when email fails) */}
              {(manualVerification && verificationUrl) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm mb-3">
                    <strong>Manual Verification:</strong> If you didn't receive the email, you can verify your account using the link below:
                  </p>
                  <a
                    href={verificationUrl}
                    className="inline-block bg-yellow-600 text-white py-2 px-4 rounded text-sm font-semibold hover:bg-yellow-700 transition-colors duration-300"
                  >
                    Verify Email Manually
                  </a>
                </div>
              )}

              {/* Manual verification section (shown when button is clicked) */}
              {showManualVerification && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm mb-3">
                    <strong>Manual Verification Link Generated!</strong> Click the link below to verify your email:
                  </p>
                  <a
                    href={verificationUrl}
                    className="inline-block bg-green-600 text-white py-2 px-4 rounded text-sm font-semibold hover:bg-green-700 transition-colors duration-300"
                  >
                    Verify Email Now
                  </a>
                  <p className="text-green-700 text-xs mt-2">
                    This link will expire in 24 hours.
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center disabled:opacity-50"
                >
                  {resendLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  Resend Verification Email
                </button>
                
                <button
                  onClick={handleGetManualVerification}
                  className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-700 transition-colors duration-300 flex items-center justify-center"
                >
                  Get Manual Verification Link
                </button>
                
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-300"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">
                  The verification link may have expired or is invalid. Please check your email for a new verification link or contact support.
                </p>
              </div>
              
              {/* Manual verification link (shown when email fails) */}
              {(manualVerification && verificationUrl) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm mb-3">
                    <strong>Manual Verification:</strong> You can verify your account using the link below:
                  </p>
                  <a
                    href={verificationUrl}
                    className="inline-block bg-yellow-600 text-white py-2 px-4 rounded text-sm font-semibold hover:bg-yellow-700 transition-colors duration-300"
                  >
                    Verify Email Manually
                  </a>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/login')}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-300"
                >
                  Go to Login
                </button>
                
                <button
                  onClick={() => navigate('/register')}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                  Register Again
                </button>
              </div>
            </div>
          )}

          {status === 'verifying' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  Please wait while we verify your email address...
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 