import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Phone, Briefcase, Calendar, FileText, Briefcase as BriefcaseIcon, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    current_position: '',
    experience_years: '',
    skills: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  });

  // Password strength validation function
  const validatePasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;
    
    return {
      score,
      requirements
    };
  };

  // Update password strength when password changes
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(validatePasswordStrength(formData.password));
    } else {
      setPasswordStrength({
        score: 0,
        requirements: {
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false
        }
      });
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrength.score < 5) {
      newErrors.password = 'Password does not meet security requirements';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Optional fields validation
    if (formData.phone && !formData.phone.match(/^[+]?[1-9][\d]{0,15}$/)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (formData.experience_years && (parseInt(formData.experience_years) < 0 || parseInt(formData.experience_years) > 50)) {
      newErrors.experience_years = 'Experience years must be between 0 and 50';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      // Remove confirmPassword from the data sent to backend
      const { confirmPassword, ...registrationData } = formData;
      
      // Convert experience_years to integer if it exists and is not empty
      if (registrationData.experience_years && registrationData.experience_years !== '') {
        registrationData.experience_years = parseInt(registrationData.experience_years, 10);
      } else {
        // Remove the field if it's empty
        delete registrationData.experience_years;
      }
      
      console.log('Sending registration data:', registrationData);
      const result = await register(registrationData);
      console.log('Registration result:', result);
      if (result.success) {
        if (result.isAdmin) {
          // First user (admin) - no verification needed
          console.log('Admin account created successfully');
          toast.success('Admin account created successfully! You can now login.');
          navigate('/login');
        } else if (result.requiresVerification) {
          console.log('Registration successful, requires manual verification');
          
          // Always show manual verification
          const verificationUrl = result.verificationUrl;
          if (result.manualVerification && verificationUrl) {
            toast.success('Registration successful! Please use the verification link below to confirm your account.');
            navigate('/verify-email', { 
              state: { 
                email: registrationData.email,
                message: result.message || 'Please use the verification link below to confirm your account.',
                verificationUrl: verificationUrl,
                manualVerification: true,
                verificationMessage: result.verificationMessage
              }
            });
          } else {
            toast.success('Registration successful! Please try the resend verification feature.');
            navigate('/verify-email', { 
              state: { 
                email: registrationData.email,
                message: 'Registration successful but verification failed. Please try resending the verification.'
              }
            });
          }
        } else {
          console.log('Registration successful, navigating to dashboard');
          navigate('/dashboard');
        }
      } else {
        console.log('Registration failed:', result.error);
      }
    } catch (error) {
      console.error('Registration error in component:', error);
      
      // Handle password validation errors from backend
      if (error.response?.data?.passwordErrors) {
        const passwordErrors = error.response.data.passwordErrors;
        passwordErrors.forEach(err => toast.error(err));
      } else {
        toast.error(error.response?.data?.error || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="wagehire-logo justify-center mb-6">
            <div className="wagehire-logo-icon">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <span className="wagehire-logo-text text-2xl">Wagehire</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your candidate account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Join Wagehire and start managing your interview journey
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 input bg-white/90 backdrop-blur-sm border-white/20 text-gray-900 placeholder-gray-500 ${errors.name ? 'border-danger-500' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-300">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 input bg-white/90 backdrop-blur-sm border-white/20 text-gray-900 placeholder-gray-500 ${errors.email ? 'border-danger-500' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-300">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white">
                Phone Number (Optional)
              </label>
              <div className="mt-1 relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 input pl-10 bg-white/90 backdrop-blur-sm border-white/20 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-300">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="current_position" className="block text-sm font-medium text-white">
                Current Position (Optional)
              </label>
              <div className="mt-1 relative">
                <BriefcaseIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="current_position"
                  name="current_position"
                  type="text"
                  value={formData.current_position}
                  onChange={handleChange}
                  className="mt-1 input pl-10 bg-white/90 backdrop-blur-sm border-white/20 text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Software Engineer, Frontend Developer"
                />
              </div>
            </div>

            <div>
              <label htmlFor="experience_years" className="block text-sm font-medium text-white">
                Years of Experience (Optional)
              </label>
              <div className="mt-1 relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="experience_years"
                  name="experience_years"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience_years}
                  onChange={handleChange}
                  className="mt-1 input pl-10 bg-white/90 backdrop-blur-sm border-white/20 text-gray-900 placeholder-gray-500"
                  placeholder="e.g., 3"
                />
              </div>
              {errors.experience_years && (
                <p className="mt-1 text-sm text-red-300">{errors.experience_years}</p>
              )}
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-white">
                Skills (Optional)
              </label>
              <div className="mt-1 relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <textarea
                  id="skills"
                  name="skills"
                  rows="3"
                  value={formData.skills}
                  onChange={handleChange}
                  className="mt-1 input pl-10 bg-white/90 backdrop-blur-sm border-white/20 text-gray-900 placeholder-gray-500 resize-none"
                  placeholder="e.g., JavaScript, React, Node.js, Python"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`input pr-10 bg-white/90 backdrop-blur-sm border-white/20 text-gray-900 placeholder-gray-500 ${errors.password ? 'border-danger-500' : ''}`}
                  placeholder="Enter your password"
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-300">{errors.password}</p>
              )}
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">Password Strength:</span>
                      <span className={`font-medium ${
                        passwordStrength.score === 5 ? 'text-green-400' :
                        passwordStrength.score >= 3 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {passwordStrength.score === 5 ? 'Strong' :
                         passwordStrength.score >= 3 ? 'Medium' :
                         'Weak'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.score === 5 ? 'bg-green-500' :
                          passwordStrength.score >= 3 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="space-y-1">
                    <p className="text-xs text-gray-300 font-medium mb-2">Requirements:</p>
                    <div className="flex items-center text-xs">
                      {passwordStrength.requirements.length ? (
                        <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-400 mr-2" />
                      )}
                      <span className={passwordStrength.requirements.length ? 'text-green-400' : 'text-red-400'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordStrength.requirements.uppercase ? (
                        <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-400 mr-2" />
                      )}
                      <span className={passwordStrength.requirements.uppercase ? 'text-green-400' : 'text-red-400'}>
                        One uppercase letter (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordStrength.requirements.lowercase ? (
                        <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-400 mr-2" />
                      )}
                      <span className={passwordStrength.requirements.lowercase ? 'text-green-400' : 'text-red-400'}>
                        One lowercase letter (a-z)
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordStrength.requirements.number ? (
                        <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-400 mr-2" />
                      )}
                      <span className={passwordStrength.requirements.number ? 'text-green-400' : 'text-red-400'}>
                        One number (0-9)
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordStrength.requirements.special ? (
                        <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-400 mr-2" />
                      )}
                      <span className={passwordStrength.requirements.special ? 'text-green-400' : 'text-red-400'}>
                        One special character (!@#$%^&*()_+-=[]{}|;:,.)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input pr-10 bg-white/90 backdrop-blur-sm border-white/20 text-gray-900 placeholder-gray-500 ${errors.confirmPassword ? 'border-danger-500' : ''}`}
                  placeholder="Confirm your password"
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
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-300">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-300">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-300 hover:text-primary-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 