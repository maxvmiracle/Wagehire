import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Building,
  User,
  Mail,
  FileText,
  DollarSign,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Linkedin,
  Link as LinkIcon,
  Globe,
  Briefcase,
  Award
} from 'lucide-react';

const InterviewDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInterviewDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/interviews/${id}`);
      setInterview(response.data.interview);
    } catch (error) {
      console.error('Error fetching interview details:', error);
      toast.error('Failed to load interview details');
      navigate('/interviews');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchInterviewDetail();
  }, [fetchInterviewDetail]);

  const handleDeleteInterview = async () => {
    if (!window.confirm('Are you sure you want to delete this interview?')) {
      return;
    }

    try {
      await api.delete(`/interviews/${id}`);
      toast.success('Interview deleted successfully');
      navigate('/interviews');
    } catch (error) {
      console.error('Error deleting interview:', error);
      toast.error('Failed to delete interview');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-danger-600" />;
      case 'scheduled':
        return <AlertCircle className="w-5 h-5 text-primary-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-warning-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'cancelled':
        return 'bg-danger-100 text-danger-800 border-danger-200';
      case 'scheduled':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      default:
        return 'bg-warning-100 text-warning-800 border-warning-200';
    }
  };

  const formatInterviewDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatInterviewTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-10">
        <h3 className="text-base font-medium text-gray-900">Interview not found</h3>
        <p className="text-gray-500 mt-1.5 text-sm">The interview you're looking for doesn't exist.</p>
        <Link to="/interviews" className="btn btn-primary mt-3">
          Back to Interviews
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-responsive">
      {/* Header */}
      <div className="header-responsive">
        <div className="flex items-center space-x-4">
          <Link
            to="/interviews"
            className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 touch-target"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900 overflow-safe">Interview Details</h1>
            <p className="text-gray-600 mt-1 overflow-safe text-base">View complete interview information</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 flex-wrap gap-2">
          {interview.status === 'scheduled' && (
            <>
              <Link
                to={`/interviews/${id}/edit`}
                className="btn btn-secondary flex items-center shadow-sm btn-responsive"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
              <button
                onClick={handleDeleteInterview}
                className="btn btn-danger flex items-center shadow-sm btn-responsive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="detail-grid">
        {/* Left Column - Main Info */}
        <div className="detail-main">
          {/* Interview Header Card */}
          <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-responsive text-white">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-1.5">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(interview.status)}
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(interview.status)} bg-white`}>
                    {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                  </span>
                </div>
              </div>
              <h2 className="text-responsive-xl font-bold mb-1.5 overflow-safe">
                {interview.company_name}
              </h2>
              <p className="text-responsive-lg text-primary-100 overflow-safe">
                {interview.job_title}
              </p>
            </div>
            
            <div className="p-responsive">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">Date</p>
                    <p className="text-sm font-semibold text-gray-900 overflow-safe">{formatInterviewDate(interview.scheduled_date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">Time</p>
                    <p className="text-sm font-semibold text-gray-900 overflow-safe">
                      {formatInterviewTime(interview.scheduled_date)} ({interview.duration} minutes)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">Location</p>
                    <p className="text-sm font-semibold text-gray-900 overflow-safe">{interview.location || 'Remote'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">Round</p>
                    <p className="text-sm font-semibold text-gray-900 overflow-safe">Round {interview.round_number}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interviewer Information */}
          {(interview.interviewer_name || interview.interviewer_email || interview.interviewer_position) && (
            <div className="bg-white rounded-2xl shadow-lg border-0 p-responsive">
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-responsive-lg font-bold text-gray-900">Interviewer Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {interview.interviewer_name && (
                  <div className="flex items-center space-x-2.5 p-3 bg-gray-50 rounded-xl">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">Name</p>
                      <p className="font-semibold text-gray-900 overflow-safe text-sm">{interview.interviewer_name}</p>
                    </div>
                  </div>
                )}
                
                {interview.interviewer_email && (
                  <div className="flex items-center space-x-2.5 p-3 bg-gray-50 rounded-xl">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">Email</p>
                      <a 
                        href={`mailto:${interview.interviewer_email}`}
                        className="font-semibold text-primary-600 hover:text-primary-700 overflow-safe break-all text-sm"
                      >
                        {interview.interviewer_email}
                      </a>
                    </div>
                  </div>
                )}
                
                {interview.interviewer_position && (
                  <div className="flex items-center space-x-2.5 p-3 bg-gray-50 rounded-xl">
                    <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">Position</p>
                      <p className="font-semibold text-gray-900 overflow-safe text-sm">{interview.interviewer_position}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Column - Company Info */}
        <div className="detail-sidebar">
          {/* Company Information */}
          <div className="bg-white rounded-2xl shadow-lg border-0 p-responsive">
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-responsive-lg font-bold text-gray-900">Company</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs font-medium text-gray-500 mb-0.5">Company Name</p>
                <p className="font-semibold text-gray-900 overflow-safe text-sm">{interview.company_name}</p>
              </div>
              
              {interview.company_website && (
                <div className="flex items-center space-x-2.5 p-3 bg-gray-50 rounded-xl">
                  <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">Website</p>
                    <a 
                      href={interview.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary-600 hover:text-primary-700 flex items-center overflow-safe break-all text-sm"
                    >
                      Visit Website
                      <ExternalLink className="w-2.5 h-2.5 ml-1 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              )}
              
              {interview.company_linkedin_url && (
                <div className="flex items-center space-x-2.5 p-3 bg-gray-50 rounded-xl">
                  <Linkedin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">LinkedIn</p>
                    <a 
                      href={interview.company_linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary-600 hover:text-primary-700 flex items-center overflow-safe break-all text-sm"
                    >
                      View Company
                      <ExternalLink className="w-2.5 h-2.5 ml-1 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              )}
              
              {interview.other_urls && (
                <div className="flex items-center space-x-2.5 p-3 bg-gray-50 rounded-xl">
                  <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">Other Links</p>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      {interview.other_urls.split(',').map((url, index) => (
                        <a 
                          key={index}
                          href={url.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 block overflow-safe break-all"
                        >
                          {url.trim()}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interview Type */}
          <div className="bg-white rounded-2xl shadow-lg border-0 p-responsive">
            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Interview Type</h3>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs font-medium text-gray-500 mb-0.5">Type</p>
              <p className="font-semibold text-gray-900 capitalize overflow-safe text-sm">{interview.interview_type}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details - Full Width */}
      <div className="bg-white rounded-2xl shadow-lg border-0 p-responsive">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="text-responsive-lg font-bold text-gray-900">Job Details</h3>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs font-medium text-gray-500 mb-0.5">Position</p>
            <p className="text-sm font-semibold text-gray-900 overflow-safe">{interview.job_title}</p>
          </div>
          
          {interview.salary_range && (
            <div className="flex items-center space-x-2.5 p-3 bg-gray-50 rounded-xl">
              <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-500">Salary Range</p>
                <p className="font-semibold text-gray-900 overflow-safe text-sm">{interview.salary_range}</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {interview.job_description && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs font-medium text-gray-500 mb-1.5">Description</p>
                <p className="text-gray-700 leading-relaxed overflow-safe text-sm">
                  {interview.job_description}
                </p>
              </div>
            )}
            
            {interview.notes && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs font-medium text-gray-500 mb-1.5">Notes</p>
                <p className="text-gray-700 leading-relaxed overflow-safe text-sm">{interview.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetail; 