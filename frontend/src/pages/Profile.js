import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
  User,
  UserCheck,
  Phone,
  FileText,
  Briefcase,
  Award,
  Mail,
  Calendar,
  Save,
  Edit,
  ExternalLink,
  CheckCircle,
  Shield,
  Star,
  Target,
  TrendingUp
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume_url: '',
    current_position: '',
    experience_years: '',
    skills: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        resume_url: user.resume_url || '',
        current_position: user.current_position || '',
        experience_years: user.experience_years || '',
        skills: user.skills || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up form data - remove empty strings and convert experience_years to number
      const cleanedData = { ...formData };
      
      // Remove empty strings
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === '') {
          delete cleanedData[key];
        }
      });
      
      // Convert experience_years to number if it exists
      if (cleanedData.experience_years !== undefined) {
        cleanedData.experience_years = parseInt(cleanedData.experience_years) || 0;
      }
      
      console.log('Submitting profile data:', cleanedData);
      const result = await updateProfile(cleanedData);
      console.log('Profile update result:', result);
      if (result.success) {
        setEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      console.error('Error response:', error.response);
    } finally {
      setLoading(false);
    }
  };

  const getProfileCompletion = () => {
    // Define all profile fields that should be completed
    const profileFields = [
      { value: formData.name, required: true },
      { value: formData.email, required: true },
      { value: formData.phone, required: false },
      { value: formData.resume_url, required: false },
      { value: formData.current_position, required: false },
      { value: formData.experience_years, required: false },
      { value: formData.skills, required: false }
    ];
    
    let completedFields = 0;
    let totalFields = 0;
    
    profileFields.forEach(field => {
      totalFields++;
      
      if (field.required) {
        // Required fields must have a value
        if (field.value && (typeof field.value === 'string' ? field.value.trim() !== '' : field.value !== null && field.value !== undefined)) {
          completedFields++;
        }
      } else {
        // Optional fields - count if they have a meaningful value
        if (field.value) {
          if (typeof field.value === 'string' && field.value.trim() !== '') {
            completedFields++;
          } else if (typeof field.value === 'number' && field.value > 0) {
            completedFields++;
          }
        }
      }
    });
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const profileCompletion = getProfileCompletion();
  const isProfileComplete = profileCompletion === 100;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-primary-100 text-lg">Manage your candidate profile and career information</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="bg-white text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-xl font-semibold flex items-center shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            {editing ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="w-5 h-5 mr-2" />
                Edit Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Completion Card */}
      <div className="bg-white rounded-2xl shadow-lg border-0 p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isProfileComplete ? 'bg-success-100' : 'bg-primary-100'}`}>
            {isProfileComplete ? (
              <UserCheck className="w-6 h-6 text-success-600" />
            ) : (
              <Target className="w-6 h-6 text-primary-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">Profile Completion</h3>
            <p className="text-gray-600">Complete your profile to increase your chances of getting interviews</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{profileCompletion}%</div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${isProfileComplete ? 'bg-success-500' : 'bg-primary-500'}`}
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
        
        {isProfileComplete ? (
          <div className="flex items-center space-x-2 text-success-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Profile Complete! You're ready for interviews.</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-primary-600">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">Keep going! Complete more fields to improve your profile.</span>
          </div>
        )}
      </div>

      {/* Main Profile Form */}
      <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
          </div>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <User className="inline-block w-4 h-4 mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Mail className="inline-block w-4 h-4 mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Phone className="inline-block w-4 h-4 mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Briefcase className="inline-block w-4 h-4 mr-2" />
                    Current Position
                  </label>
                  <input
                    type="text"
                    name="current_position"
                    value={formData.current_position}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="e.g., Software Engineer, Frontend Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Award className="inline-block w-4 h-4 mr-2" />
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="experience_years"
                    min="0"
                    max="50"
                    value={formData.experience_years}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="e.g., 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <FileText className="inline-block w-4 h-4 mr-2" />
                    Resume URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="resume_url"
                      value={formData.resume_url}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500 pr-12"
                      placeholder="https://example.com/resume.pdf"
                    />
                    {formData.resume_url && (
                      <a
                        href={formData.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-700"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Star className="inline-block w-4 h-4 mr-2" />
                Skills & Technologies
              </label>
              <textarea
                name="skills"
                rows="4"
                value={formData.skills}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="e.g., JavaScript, React, Node.js, Python, AWS, Docker"
              />
              <p className="text-sm text-gray-500 mt-2">
                List your technical skills, programming languages, frameworks, and tools
              </p>
            </div>

            {/* Account Information */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Role</p>
                    <p className="font-semibold text-gray-900">
                      {user?.role === 'admin' ? 'Administrator' : 'Candidate'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Member Since</p>
                    <p className="font-semibold text-gray-900">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            {editing && (
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-300 flex items-center disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile; 