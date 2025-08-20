import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { interviewApi } from '../services/api';
import notificationService from '../services/notificationService';
import { 
  Calendar, Clock, MapPin, Building, FileText, AlertCircle, 
  Globe, User, DollarSign, Briefcase, Mail, Linkedin, Link,
  ArrowLeft, Save, X, Award
} from 'lucide-react';

const ScheduleInterview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    scheduled_date: '',
    scheduled_time: '',
    duration: 60,
    round: 1,
    status: 'scheduled',
    interview_type: 'technical',
    location: '',
    notes: '',
    company_website: '',
    company_linkedin_url: '',
    other_urls: '',
    job_description: '',
    salary_range: '',
    interviewer_name: '',
    interviewer_email: '',
    interviewer_position: '',
    interviewer_linkedin_url: ''
  });
  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert numeric fields to proper types
    let processedValue = value;
    if (name === 'round' || name === 'duration') {
      if (value === '' || value === null || value === undefined) {
        processedValue = '';
      } else {
        const numValue = parseInt(value, 10);
        processedValue = isNaN(numValue) ? '' : numValue;
      }
    }
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: processedValue
      };
      
      // If status is changed to uncertain, reset duration
      if (name === 'status' && value === 'uncertain') {
        newData.duration = '';
      }
      
      return newData;
    });
    
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
    
    console.log('Validating form with data:', formData);
    
    // Required fields validation
    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }
    
    if (!formData.job_title.trim()) {
      newErrors.job_title = 'Job title is required';
    }
    
    // Date and time validation - only required if status is not uncertain
    if (formData.status !== 'uncertain') {
      if (!formData.scheduled_date) {
        newErrors.scheduled_date = 'Please select a date';
      }
      // Note: Past dates are allowed for flexibility (forgot interviews, etc.)
    
    if (!formData.scheduled_time) {
      newErrors.scheduled_time = 'Please select a time';
      }
    }
    
    // Duration validation - only required if status is not uncertain
    if (formData.status !== 'uncertain') {
      if (!formData.duration || formData.duration < 15) {
        newErrors.duration = 'Duration must be at least 15 minutes';
      }
    }
    
    // Round validation - check for valid number between 1 and 10
    if (!formData.round || typeof formData.round !== 'number' || formData.round < 1 || formData.round > 10) {
      newErrors.round = 'Please enter a valid round number (1-10)';
    }
    
    if (!formData.status) {
      newErrors.status = 'Please select a status';
    }
    
    if (!formData.interview_type) {
      newErrors.interview_type = 'Please select an interview type';
    }
    
    // URL validations for optional fields - REMOVED to avoid issues
    // const urlFields = [
    //   { field: 'company_website', name: 'Company Website' },
    //   { field: 'company_linkedin_url', name: 'Company LinkedIn URL' },
    //   { field: 'other_urls', name: 'Other URLs' }
    // ];
    
    // urlFields.forEach(({ field, name }) => {
    //   if (formData[field] && !formData[field].match(/^https?:\/\/.+/)) {
    //     newErrors[field] = `Please enter a valid URL starting with http:// or https://`;
    //   }
    // });
    
    // Email validation for interviewer - REMOVED to avoid issues
    // if (formData.interviewer_email && !formData.interviewer_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    //   newErrors.interviewer_email = 'Please enter a valid email address';
    // }
    
    // Salary range validation (if provided)
    if (formData.salary_range && formData.salary_range.length > 50) {
      newErrors.salary_range = 'Salary range must be less than 50 characters';
    }
    
    // Notes validation (if provided)
    if (formData.notes && formData.notes.length > 300) {
      newErrors.notes = 'Notes must be less than 300 characters';
    }
    
    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Form data:', JSON.stringify(formData, null, 2));
    
    if (!validateForm()) {
      console.log('Form validation failed');
      toast.error('Please fill in all required fields correctly');
      return;
    }

    console.log('Form validation passed, submitting...');
    setLoading(true);
    try {
      // Handle scheduled date based on status
      let scheduledDateTime = null;
      if (formData.status !== 'uncertain' && formData.scheduled_date && formData.scheduled_time) {
        scheduledDateTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`).toISOString();
      } else if (formData.status === 'uncertain') {
        // For uncertain status, use current date as placeholder
        scheduledDateTime = new Date().toISOString();
      }
      
      // Prepare data for submission - only include necessary fields
      const submitData = {
        candidate_id: user.id, // Add the current user's ID as candidate_id
        company_name: formData.company_name.trim(),
        job_title: formData.job_title.trim(),
        scheduled_date: scheduledDateTime,
        duration: formData.status === 'uncertain' ? null : (formData.duration ? parseInt(formData.duration, 10) : null),
        round: parseInt(formData.round, 10),
        status: formData.status,
        interview_type: formData.interview_type,
        location: formData.location?.trim() || null,
        notes: formData.notes?.trim() || null,
        company_website: formData.company_website?.trim() || null,
        company_linkedin_url: formData.company_linkedin_url?.trim() || null,
        other_urls: formData.other_urls?.trim() || null,
        job_description: formData.job_description?.trim() || null,
        salary_range: formData.salary_range?.trim() || null,
        interviewer_name: formData.interviewer_name?.trim() || null,
        interviewer_email: formData.interviewer_email?.trim() || null,
        interviewer_position: formData.interviewer_position?.trim() || null,
        interviewer_linkedin_url: formData.interviewer_linkedin_url?.trim() || null
      };
      
      console.log('Submit data:', JSON.stringify(submitData, null, 2));
      
      const response = await interviewApi.create(submitData);

      console.log('Interview scheduled successfully:', response);
      
      // Show enhanced notification for scheduled interview
      notificationService.showInterviewScheduled(response.interview);
      
      navigate('/interviews');
    } catch (error) {
      console.error('=== ERROR DEBUG ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      
      if (error.response?.data?.errors) {
        console.error('Validation errors:', error.response.data.errors);
      }
      
      toast.error(error.response?.data?.error || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-9xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/interviews')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
              <ArrowLeft className="w-5 h-5" />
          </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Schedule New Interview</h2>
              <p className="text-gray-600">Book your next career opportunity</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company and Job Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="inline-block w-4 h-4 mr-2" />
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Enter company name"
                className={`input ${errors.company_name ? 'border-danger-500' : ''}`}
                />
                {errors.company_name && (
                <p className="mt-1 text-sm text-danger-600">{errors.company_name}</p>
                )}
              </div>

              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="inline-block w-4 h-4 mr-2" />
                  Job Title *
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  placeholder="e.g., Senior Frontend Developer"
                className={`input ${errors.job_title ? 'border-danger-500' : ''}`}
                />
                {errors.job_title && (
                <p className="mt-1 text-sm text-danger-600">{errors.job_title}</p>
                )}
              </div>
            </div>

          {/* Date, Time, Round, Status, and Interview Type */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline-block w-4 h-4 mr-2" />
                Date {formData.status !== 'uncertain' ? '*' : ''}
                </label>
                <input
                  type="date"
                  name="scheduled_date"
                  value={formData.scheduled_date}
                  onChange={handleChange}
                disabled={formData.status === 'uncertain'}
                className={`input ${errors.scheduled_date ? 'border-danger-500' : ''} ${formData.status === 'uncertain' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
                {errors.scheduled_date && (
                <p className="mt-1 text-sm text-danger-600">{errors.scheduled_date}</p>
                )}
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline-block w-4 h-4 mr-2" />
                Time {formData.status !== 'uncertain' ? '*' : ''}
                </label>
                <input
                  type="time"
                  name="scheduled_time"
                  value={formData.scheduled_time}
                  onChange={handleChange}
                disabled={formData.status === 'uncertain'}
                className={`input ${errors.scheduled_time ? 'border-danger-500' : ''} ${formData.status === 'uncertain' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
                {errors.scheduled_time && (
                <p className="mt-1 text-sm text-danger-600">{errors.scheduled_time}</p>
                )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertCircle className="inline-block w-4 h-4 mr-2" />
                Round *
              </label>
              <input
                type="number"
                name="round"
                value={formData.round}
                onChange={handleChange}
                min="1"
                max="10"
                placeholder="Enter round number (1-10)"
                className={`input ${errors.round ? 'border-danger-500' : ''}`}
              />
              {errors.round && (
                <p className="mt-1 text-sm text-danger-600">{errors.round}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertCircle className="inline-block w-4 h-4 mr-2" />
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`input ${errors.status ? 'border-danger-500' : ''}`}
              >
                <option value="scheduled">Scheduled</option>
                <option value="uncertain">Uncertain</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-danger-600">{errors.status}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="inline-block w-4 h-4 mr-2" />
                Interview Type *
              </label>
              <select
                name="interview_type"
                value={formData.interview_type}
                onChange={handleChange}
                className={`input ${errors.interview_type ? 'border-danger-500' : ''}`}
              >
                <option value="hr">HR</option>
                <option value="technical">Technical</option>
                <option value="final">Final</option>
              </select>
              {errors.interview_type && (
                <p className="mt-1 text-sm text-danger-600">{errors.interview_type}</p>
              )}
            </div>
          </div>

          {/* Duration */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline-block w-4 h-4 mr-2" />
                Duration (minutes) {formData.status !== 'uncertain' ? '*' : ''}
              </label>
              <select
                name="duration"
                value={formData.status === 'uncertain' ? '' : formData.duration}
                onChange={handleChange}
                disabled={formData.status === 'uncertain'}
                className={`input ${errors.duration ? 'border-danger-500' : ''} ${formData.status === 'uncertain' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">{formData.status === 'uncertain' ? 'None' : 'Select duration'}</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
              {errors.duration && (
                <p className="mt-1 text-sm text-danger-600">{errors.duration}</p>
              )}
          </div>

          {/* Location */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline-block w-4 h-4 mr-2" />
              Location
              </label>
              <input
                type="text"
              name="location"
              value={formData.location}
                onChange={handleChange}
              placeholder="e.g., Remote, Office, Meeting Room 1, or Zoom Link"
              className="input"
              />
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline-block w-4 h-4 mr-2" />
                Company Website
              </label>
              <input
                type="url"
                name="company_website"
                value={formData.company_website}
                onChange={handleChange}
                placeholder="https://company.com"
                className={`input ${errors.company_website ? 'border-danger-500' : ''}`}
              />
              {errors.company_website && (
                <p className="mt-1 text-sm text-danger-600">{errors.company_website}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Linkedin className="inline-block w-4 h-4 mr-2" />
                Company LinkedIn URL
              </label>
              <input
                type="url"
                name="company_linkedin_url"
                value={formData.company_linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/..."
                className={`input ${errors.company_linkedin_url ? 'border-danger-500' : ''}`}
              />
              {errors.company_linkedin_url && (
                <p className="mt-1 text-sm text-danger-600">{errors.company_linkedin_url}</p>
              )}
            </div>
          </div>

          {/* Other URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Link className="inline-block w-4 h-4 mr-2" />
              Other URLs
            </label>
            <input
              type="url"
              name="other_urls"
              value={formData.other_urls}
              onChange={handleChange}
              placeholder="https://example.com (separate multiple URLs with commas)"
              className={`input ${errors.other_urls ? 'border-danger-500' : ''}`}
            />
            {errors.other_urls && (
              <p className="mt-1 text-sm text-danger-600">{errors.other_urls}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Separate multiple URLs with commas if needed
            </p>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline-block w-4 h-4 mr-2" />
                Salary Range
              </label>
              <input
                type="text"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                placeholder="e.g., $80,000 - $100,000"
                maxLength="50"
                className={`input ${errors.salary_range ? 'border-danger-500' : ''}`}
              />
              {errors.salary_range && (
                <p className="mt-1 text-sm text-danger-600">{errors.salary_range}</p>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline-block w-4 h-4 mr-2" />
              Job Description
            </label>
            <textarea
              name="job_description"
              value={formData.job_description}
              onChange={handleChange}
              rows="4"
              placeholder="Brief description of the role and responsibilities..."
              className="input"
            />
            <p className="text-sm text-gray-500 mt-1">
              Describe the role, responsibilities, and requirements in detail
            </p>
          </div>

          {/* Interviewer Details */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline-block w-4 h-4 mr-2" />
                Interviewer Name
              </label>
              <input
                type="text"
                name="interviewer_name"
                value={formData.interviewer_name}
                onChange={handleChange}
                placeholder="Enter interviewer's name"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline-block w-4 h-4 mr-2" />
                Interviewer Email
              </label>
              <input
                type="email"
                name="interviewer_email"
                value={formData.interviewer_email}
                onChange={handleChange}
                placeholder="interviewer@company.com"
                className={`input ${errors.interviewer_email ? 'border-danger-500' : ''}`}
              />
              {errors.interviewer_email && (
                <p className="mt-1 text-sm text-danger-600">{errors.interviewer_email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Linkedin className="inline-block w-4 h-4 mr-2" />
                Interviewer LinkedIn URL
              </label>
              <input
                type="url"
                name="interviewer_linkedin_url"
                value={formData.interviewer_linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/interviewer"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline-block w-4 h-4 mr-2" />
                Interviewer Position
              </label>
              <input
                type="text"
                name="interviewer_position"
                value={formData.interviewer_position}
                onChange={handleChange}
                placeholder="e.g., Senior Engineering Manager"
                className="input"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className={`input ${errors.notes ? 'border-danger-500' : ''}`}
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-danger-600">{errors.notes}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {formData.notes.length}/300 characters
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/interviews')}
              className="btn btn-secondary flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Scheduling...</span>
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Schedule Interview
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterview; 