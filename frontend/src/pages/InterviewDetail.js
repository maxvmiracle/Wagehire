import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { interviewApi } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
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
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Linkedin,
  Link as LinkIcon,
  Globe,
  Briefcase,
  Award,
  Hash
} from 'lucide-react';

const InterviewDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInterviewDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await interviewApi.getById(id);
      setInterview(response.interview);
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
      await interviewApi.delete(id);
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

  const formatInterviewDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatInterviewTime = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return <LoadingScreen message="Loading interview details..." />;
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
        </div>
      </div>

      {/* Main Content */}
      <div className="detail-grid">
        {/* Left Column - Main Info */}
        <div className="detail-main flex flex-col">
          {/* Interview Header Card */}
          <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                {getStatusIcon(interview.status)}
                <h2 className="text-xl font-bold overflow-safe">
                  {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)} Interview
                </h2>
              </div>
              <h3 className="text-lg font-semibold mb-1 overflow-safe">
                {interview.company_name}
              </h3>
              <p className="text-base text-primary-100 overflow-safe">
                {interview.job_title}
              </p>
            </div>
            
            <div className="p-3">
              <div className="grid grid-cols-2 gap-2">
                {(() => {
                  // Show "Not Determined" only if status is uncertain or no scheduled date
                  return (!interview.scheduled_date || interview.status === 'uncertain');
                })() ? (
                  <>
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-3 h-3 text-warning-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500">Date & Time</p>
                        <p className="text-sm font-semibold text-warning-700 overflow-safe">
                          Not Determined
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-3 h-3 text-warning-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500">Duration</p>
                        <p className="text-sm font-semibold text-warning-700 overflow-safe">
                          Not Determined
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-3 h-3 text-primary-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500">Date</p>
                        <p className="text-sm font-semibold text-gray-900 overflow-safe">{formatInterviewDate(interview.scheduled_date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-3 h-3 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500">Time</p>
                        <p className="text-sm font-semibold text-gray-900 overflow-safe">
                          {formatInterviewTime(interview.scheduled_date)} ({interview.duration ? `${interview.duration} minutes` : 'TBD'})
                        </p>
                      </div>
                    </div>
                  </>
                )}
                

                
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Hash className="w-3 h-3 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">Round</p>
                    <p className="text-sm font-semibold text-gray-900 overflow-safe">Round {interview.round}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-3 h-3 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">Type</p>
                    <p className="text-sm font-semibold text-gray-900 overflow-safe">
                      {interview.interview_type ? interview.interview_type.charAt(0).toUpperCase() + interview.interview_type.slice(1) : 'Technical'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interviewer Information */}
          {(interview.interviewer_name || interview.interviewer_email || interview.interviewer_position || interview.interviewer_linkedin_url) && (
            <div className="bg-white rounded-2xl shadow-lg border-0 p-4 flex-1 flex flex-col">
              <div className="flex items-center space-x-2.5 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Interviewer Information</h3>
                  <p className="text-xs text-gray-500">Contact details</p>
                </div>
              </div>
                          <div className="grid grid-cols-1 gap-2 flex-1">
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500">Name</p>
                  <p className="text-sm font-semibold text-gray-900 overflow-safe">
                    {interview.interviewer_name || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-3 h-3 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500">Position</p>
                  <p className="text-sm font-semibold text-gray-900 overflow-safe">
                    {interview.interviewer_position || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3 h-3 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500">Email</p>
                  <p className="text-sm font-semibold text-gray-900 overflow-safe">
                    {interview.interviewer_email || 'N/A'}
                  </p>
                </div>
              </div>
              {interview.interviewer_linkedin_url && (
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-linkedin-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Linkedin className="w-3 h-3 text-linkedin-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">LinkedIn</p>
                    <a 
                      href={interview.interviewer_linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-linkedin-600 hover:text-linkedin-700 overflow-safe break-all"
                    >
                      {interview.interviewer_linkedin_url}
                    </a>
                  </div>
                </div>
              )}
            </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="detail-sidebar flex flex-col">
          {/* Company Information */}
          <div className="bg-white rounded-2xl shadow-lg border-0 p-4 flex-1 flex flex-col">
            <div className="flex items-center space-x-2.5 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Building className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Company Information</h3>
                <p className="text-xs text-gray-500">Organization details</p>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building className="w-3 h-3 text-indigo-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500">Company</p>
                  <p className="text-sm font-semibold text-gray-900 overflow-safe">
                    {interview.company_name || 'N/A'}
                  </p>
                </div>
              </div>

              {interview.company_website && (
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">Website</p>
                    <a 
                      href={interview.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 overflow-safe break-all"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              )}
              
              {interview.company_linkedin_url && (
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Linkedin className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">LinkedIn</p>
                    <a 
                      href={interview.company_linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 overflow-safe break-all"
                    >
                      View Company
                    </a>
                  </div>
                </div>
              )}
              
              {interview.other_urls && (
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LinkIcon className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">Other Links</p>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      {interview.other_urls.split(',').map((url, index) => (
                        <a 
                          key={index}
                          href={url.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 block overflow-safe break-all"
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

          {/* Notes */}
          <div className="bg-white rounded-2xl shadow-lg border-0 p-4 mt-4 flex-1 flex flex-col">
            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Notes</h3>
                <p className="text-xs text-gray-500">Additional information</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 overflow-hidden h-48">
              <div className="p-3 h-full overflow-y-auto">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {interview.notes || 'No additional notes available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing and Visual Separation */}
      <div className="my-3">
        <div className="flex items-center justify-center">
          <div className="flex-1 h-px bg-gray-200"></div>
          <div className="px-2">
            <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
          </div>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
      </div>

      {/* Job Details - Full Width */}
      <div className="bg-white rounded-2xl shadow-lg border-0 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Job Details</h3>
            <p className="text-xs text-gray-500">Position information and requirements</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="p-2 bg-gray-50 rounded-xl">
            <p className="text-xs font-medium text-gray-500 mb-0.5">Position</p>
            <p className="text-sm font-semibold text-gray-900 overflow-safe">{interview.job_title}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {interview.salary_range && (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-3 h-3 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500">Salary Range</p>
                  <p className="text-sm font-semibold text-gray-900 overflow-safe">{interview.salary_range}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3 h-3 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-500">Location</p>
                <p className="text-sm font-semibold text-gray-900 overflow-safe">{interview.location || 'Remote'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl h-64 overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
              <p className="text-xs font-medium text-gray-500">Description</p>
            </div>
            <div className="p-3 h-full overflow-y-auto">
              <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                {interview.job_description || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetail; 