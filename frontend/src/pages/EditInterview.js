import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Calendar, Clock, MapPin, Building, FileText, AlertCircle, 
  Globe, User, DollarSign, Star, Briefcase, Mail, Linkedin, Link,
  ArrowLeft, Save, X
} from 'lucide-react';

const EditInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    fetchInterview();
  }, [id]);

  const fetchInterview = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/interviews/${id}`);
      const interview = response.data.interview;
      
      // Convert the scheduled_date to separate date and time
      const scheduledDate = new Date(interview.scheduled_date);
      const dateStr = scheduledDate.toISOString().split('T')[0];
      const timeStr = scheduledDate.toTimeString().slice(0, 5);
      
      setFormData({
        company_name: interview.company_name || '',
        job_title: interview.job_title || '',
        scheduled_date: dateStr,
        scheduled_time: timeStr,
        duration: interview.duration || 60,
        interview_type: interview.interview_type || 'technical',
        location: interview.location || '',
        notes: interview.notes || '',
        company_website: interview.company_website || '',
        company_linkedin_url: interview.company_linkedin_url || '',
        other_urls: interview.other_urls || '',
        job_description: interview.job_description || '',
        salary_range: interview.salary_range || '',
        round_number: interview.round_number || 1,
        interviewer_name: interview.interviewer_name || '',
        interviewer_email: interview.interviewer_email || '',
        interviewer_position: interview.interviewer_position || ''
      });
    } catch (error) {
      console.error('Error fetching interview:', error);
      toast.error('Failed to load interview details');
      navigate('/interviews');
    } finally {
      setLoading(false);
    }
  };

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
    
    // Job description validation (if provided)
    if (formData.job_description && formData.job_description.length > 500) {
      newErrors.job_description = 'Job description must be less than 500 characters';
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

    setSaving(true);
    try {
      // Combine date and time
      const scheduledDateTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`).toISOString();
      
      const response = await axios.put(`/api/interviews/${id}`, {
        ...formData,
        scheduled_date: scheduledDateTime
      });

      toast.success('Interview updated successfully!');
      navigate(`/interviews/${id}`);
    } catch (error) {
      console.error('Error updating interview:', error);
      toast.error(error.response?.data?.error || 'Failed to update interview');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/interviews/${id}`)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Interview</h2>
              <p className="text-gray-600">Update interview details</p>
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

          {/* Date and Time */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline-block w-4 h-4 mr-2" />
                Date *
              </label>
              <input
                type="date"
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`input ${errors.scheduled_date ? 'border-danger-500' : ''}`}
              />
              {errors.scheduled_date && (
                <p className="mt-1 text-sm text-danger-600">{errors.scheduled_date}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline-block w-4 h-4 mr-2" />
                Time *
              </label>
              <input
                type="time"
                name="scheduled_time"
                value={formData.scheduled_time}
                onChange={handleChange}
                className={`input ${errors.scheduled_time ? 'border-danger-500' : ''}`}
              />
              {errors.scheduled_time && (
                <p className="mt-1 text-sm text-danger-600">{errors.scheduled_time}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className={`input ${errors.round_number ? 'border-danger-500' : ''}`}
              />
              {errors.round_number && (
                <p className="mt-1 text-sm text-danger-600">{errors.round_number}</p>
              )}
            </div>
          </div>

          {/* Duration and Type */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline-block w-4 h-4 mr-2" />
                Duration (minutes) *
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className={`input ${errors.duration ? 'border-danger-500' : ''}`}
              >
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertCircle className="inline-block w-4 h-4 mr-2" />
                Interview Type *
              </label>
              <select
                name="interview_type"
                value={formData.interview_type}
                onChange={handleChange}
                className={`input ${errors.interview_type ? 'border-danger-500' : ''}`}
              >
                <option value="technical">Technical</option>
                <option value="hr">HR</option>
                <option value="final">Final</option>
                <option value="screening">Screening</option>
              </select>
              {errors.interview_type && (
                <p className="mt-1 text-sm text-danger-600">{errors.interview_type}</p>
              )}
            </div>
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
              maxLength="500"
              className={`input ${errors.job_description ? 'border-danger-500' : ''}`}
            />
            {errors.job_description && (
              <p className="mt-1 text-sm text-danger-600">{errors.job_description}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {formData.job_description.length}/500 characters
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
              onClick={() => navigate(`/interviews/${id}`)}
              className="btn btn-secondary flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary flex items-center"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInterview; 