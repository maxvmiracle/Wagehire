import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  Calendar, Clock, MapPin, Building, FileText, AlertCircle, 
  Globe, User, DollarSign, Briefcase, Mail, Linkedin, Link,
  ArrowLeft, Save, X, Plus, Target
} from 'lucide-react';

const ScheduleInterview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    scheduled_date: '',
    scheduled_time: '',
    duration: 60,
    interview_type: 'technical',
    location: '',
    notes: '',
    company_website: '',
    company_linkedin_url: '',
    other_urls: '',
    job_description: '',
    salary_range: '',
    round_number: 1,
    interviewer_name: '',
    interviewer_email: '',
    interviewer_position: ''
  });
  const [errors, setErrors] = useState({});

  // Handle form input changes
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

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }
    
    if (!formData.job_title.trim()) {
      newErrors.job_title = 'Job title is required';
    }
    
    if (!formData.scheduled_date) {
      newErrors.scheduled_date = 'Please select a date';
    } else {
      const selectedDate = new Date(formData.scheduled_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.scheduled_date = 'Date cannot be in the past';
      }
    }
    
    if (!formData.scheduled_time) {
      newErrors.scheduled_time = 'Please select a time';
    }
    
    if (!formData.duration || formData.duration < 15) {
      newErrors.duration = 'Duration must be at least 15 minutes';
    }
    
    if (!formData.interview_type) {
      newErrors.interview_type = 'Please select interview type';
    }
    
    // URL validations for optional fields
    const urlFields = [
      { field: 'company_website', name: 'Company Website' },
      { field: 'company_linkedin_url', name: 'Company LinkedIn URL' },
      { field: 'other_urls', name: 'Other URLs' }
    ];
    
    urlFields.forEach(({ field, name }) => {
      if (formData[field] && !formData[field].match(/^https?:\/\/.+/)) {
        newErrors[field] = `Please enter a valid URL starting with http:// or https://`;
      }
    });
    
    // Email validation for interviewer
    if (formData.interviewer_email && !formData.interviewer_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.interviewer_email = 'Please enter a valid email address';
    }
    
    // Round number validation
    if (formData.round_number < 1 || formData.round_number > 10) {
      newErrors.round_number = 'Round number must be between 1 and 10';
    }
    
    // Salary range validation (if provided)
    if (formData.salary_range && formData.salary_range.length > 50) {
      newErrors.salary_range = 'Salary range must be less than 50 characters';
    }
    
    // Notes validation (if provided)
    if (formData.notes && formData.notes.length > 300) {
      newErrors.notes = 'Notes must be less than 300 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      // Combine date and time
      const scheduledDateTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`).toISOString();
      
      await axios.post('/api/interviews', {
        ...formData,
        scheduled_date: scheduledDateTime
      });

      toast.success('Interview scheduled successfully!');
      navigate('/interviews');
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast.error(error.response?.data?.error || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/interviews')}
            className="p-2 text-primary-100 hover:text-white hover:bg-primary-400 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Schedule New Interview</h1>
            <p className="text-primary-100 text-lg">Book your next career opportunity</p>
          </div>
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
            <Target className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Interview Details</h2>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Company and Job Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-primary-600" />
                Company Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${errors.company_name ? 'border-danger-500' : ''}`}
                />
                {errors.company_name && (
                  <p className="mt-2 text-sm text-danger-600">{errors.company_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  placeholder="e.g., Senior Frontend Developer"
                  className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${errors.job_title ? 'border-danger-500' : ''}`}
                />
                {errors.job_title && (
                  <p className="mt-2 text-sm text-danger-600">{errors.job_title}</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
                Job Details
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Salary Range
                </label>
                <input
                  type="text"
                  name="salary_range"
                  value={formData.salary_range}
                  onChange={handleChange}
                  placeholder="e.g., $80,000 - $100,000"
                  maxLength="50"
                  className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${errors.salary_range ? 'border-danger-500' : ''}`}
                />
                {errors.salary_range && (
                  <p className="mt-2 text-sm text-danger-600">{errors.salary_range}</p>
                )}
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <FileText className="inline-block w-4 h-4 mr-2" />
              Job Description
            </label>
            <textarea
              name="job_description"
              value={formData.job_description}
              onChange={handleChange}
              rows="6"
              placeholder="Brief description of the role and responsibilities..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
            />
            <p className="text-sm text-gray-500 mt-2">
              Describe the role, responsibilities, and requirements in detail
            </p>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Calendar className="inline-block w-4 h-4 mr-2" />
                Date *
              </label>
              <input
                type="date"
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${errors.scheduled_date ? 'border-danger-500' : ''}`}
              />
              {errors.scheduled_date && (
                <p className="mt-2 text-sm text-danger-600">{errors.scheduled_date}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Clock className="inline-block w-4 h-4 mr-2" />
                Time *
              </label>
              <input
                type="time"
                name="scheduled_time"
                value={formData.scheduled_time}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${errors.scheduled_time ? 'border-danger-500' : ''}`}
              />
              {errors.scheduled_time && (
                <p className="mt-2 text-sm text-danger-600">{errors.scheduled_time}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <AlertCircle className="inline-block w-4 h-4 mr-2" />
                Round Number
              </label>
              <input
                type="number"
                name="round_number"
                value={formData.round_number}
                onChange={handleChange}
                min="1"
                max="10"
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${errors.round_number ? 'border-danger-500' : ''}`}
              />
              {errors.round_number && (
                <p className="mt-2 text-sm text-danger-600">{errors.round_number}</p>
              )}
            </div>
          </div>

          {/* Duration and Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Clock className="inline-block w-4 h-4 mr-2" />
                Duration (minutes) *
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${errors.duration ? 'border-danger-500' : ''}`}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
              {errors.duration && (
                <p className="mt-2 text-sm text-danger-600">{errors.duration}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <AlertCircle className="inline-block w-4 h-4 mr-2" />
                Interview Type *
              </label>
              <select
                name="interview_type"
                value={formData.interview_type}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${errors.interview_type ? 'border-danger-500' : ''}`}
              >
                <option value="technical">Technical</option>
                <option value="hr">HR</option>
                <option value="final">Final</option>
                <option value="screening">Screening</option>
              </select>
              {errors.interview_type && (
                <p className="mt-2 text-sm text-danger-600">{errors.interview_type}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <MapPin className="inline-block w-4 h-4 mr-2" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Remote, Office, Meeting Room 1, or Zoom Link"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Globe className="inline-block w-4 h-4 mr-2" />
                Company Website
              </label>
              <input
                type="url"
                name="company_website"
                value={formData.company_website}
                onChange={handleChange}
                placeholder="https://company.com"
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${errors.company_website ? 'border-danger-500' : ''}`}
              />
              {errors.company_website && (
                <p className="mt-2 text-sm text-danger-600">{errors.company_website}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Linkedin className="inline-block w-4 h-4 mr-2" />
                Company LinkedIn URL
              </label>
              <input
                type="url"
                name="company_linkedin_url"
                value={formData.company_linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/..."
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${errors.company_linkedin_url ? 'border-danger-500' : ''}`}
              />
              {errors.company_linkedin_url && (
                <p className="mt-2 text-sm text-danger-600">{errors.company_linkedin_url}</p>
              )}
            </div>
          </div>

          {/* Other URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Link className="inline-block w-4 h-4 mr-2" />
              Other URLs
            </label>
            <input
              type="url"
              name="other_urls"
              value={formData.other_urls}
              onChange={handleChange}
              placeholder="https://example.com (separate multiple URLs with commas)"
              className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${errors.other_urls ? 'border-danger-500' : ''}`}
            />
            {errors.other_urls && (
              <p className="mt-2 text-sm text-danger-600">{errors.other_urls}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Separate multiple URLs with commas if needed
            </p>
          </div>

          {/* Interviewer Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <User className="inline-block w-4 h-4 mr-2" />
                Interviewer Name
              </label>
              <input
                type="text"
                name="interviewer_name"
                value={formData.interviewer_name}
                onChange={handleChange}
                placeholder="Enter interviewer's name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Mail className="inline-block w-4 h-4 mr-2" />
                Interviewer Email
              </label>
              <input
                type="email"
                name="interviewer_email"
                value={formData.interviewer_email}
                onChange={handleChange}
                placeholder="interviewer@company.com"
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${errors.interviewer_email ? 'border-danger-500' : ''}`}
              />
              {errors.interviewer_email && (
                <p className="mt-2 text-sm text-danger-600">{errors.interviewer_email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <User className="inline-block w-4 h-4 mr-2" />
                Interviewer Position
              </label>
              <input
                type="text"
                name="interviewer_position"
                value={formData.interviewer_position}
                onChange={handleChange}
                placeholder="e.g., Senior Engineering Manager"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <FileText className="inline-block w-4 h-4 mr-2" />
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Any additional notes, requirements, or preparation needed..."
              maxLength="300"
              className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${errors.notes ? 'border-danger-500' : ''}`}
            />
            {errors.notes && (
              <p className="mt-2 text-sm text-danger-600">{errors.notes}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {formData.notes.length}/300 characters
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/interviews')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300 flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-300 flex items-center disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Scheduling...' : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterview; 