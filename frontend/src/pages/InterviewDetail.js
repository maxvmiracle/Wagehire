import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
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

  useEffect(() => {
    fetchInterviewDetail();
  }, [id, fetchInterviewDetail]);

  const fetchInterviewDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/interviews/${id}`);
      setInterview(response.data.interview);
    } catch (error) {
      console.error('Error fetching interview details:', error);
      toast.error('Failed to load interview details');
      navigate('/interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInterview = async () => {
    if (!window.confirm('Are you sure you want to delete this interview?')) {
      return;
    }

    try {
      await axios.delete(`/api/interviews/${id}`);
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
        return <CheckCircle className="w-6 h-6 text-success-600" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-danger-600" />;
      case 'scheduled':
        return <AlertCircle className="w-6 h-6 text-primary-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-warning-600" />;
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Interview not found</h3>
        <p className="text-gray-500 mt-2">The interview you're looking for doesn't exist.</p>
        <Link to="/interviews" className="btn btn-primary mt-4">
          Back to Interviews
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/interviews"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
      <div>
            <h1 className="text-3xl font-bold text-gray-900">Interview Details</h1>
            <p className="text-gray-600 mt-1">View complete interview information</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {interview.status === 'scheduled' && (
            <>
              <Link
                to={`/interviews/${id}/edit`}
                className="btn btn-secondary flex items-center shadow-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
              <button
                onClick={handleDeleteInterview}
                className="btn btn-danger flex items-center shadow-sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interview Header Card */}
          <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(interview.status)}
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(interview.status)} bg-white`}>
                    {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                  </span>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {interview.company_name}
              </h2>
              <p className="text-xl text-primary-100">
                {interview.job_title}
              </p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-lg font-semibold text-gray-900">{formatInterviewDate(interview.scheduled_date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Time</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatInterviewTime(interview.scheduled_date)} ({interview.duration} minutes)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-lg font-semibold text-gray-900">{interview.location || 'Remote'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Round</p>
                    <p className="text-lg font-semibold text-gray-900">Round {interview.round_number}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interviewer Information */}
          {(interview.interviewer_name || interview.interviewer_email || interview.interviewer_position) && (
            <div className="bg-white rounded-2xl shadow-lg border-0 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Interviewer Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {interview.interviewer_name && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="font-semibold text-gray-900">{interview.interviewer_name}</p>
                    </div>
                  </div>
                )}
                
                {interview.interviewer_email && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <a 
                        href={`mailto:${interview.interviewer_email}`}
                        className="font-semibold text-primary-600 hover:text-primary-700"
                      >
                        {interview.interviewer_email}
                      </a>
                    </div>
                  </div>
                )}
                
                {interview.interviewer_position && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Position</p>
                      <p className="font-semibold text-gray-900">{interview.interviewer_position}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Job Details */}
          <div className="bg-white rounded-2xl shadow-lg border-0 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Job Details</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-500 mb-1">Position</p>
                <p className="text-lg font-semibold text-gray-900">{interview.job_title}</p>
              </div>
              
              {interview.salary_range && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Salary Range</p>
                    <p className="font-semibold text-gray-900">{interview.salary_range}</p>
                  </div>
                </div>
              )}
              
              {interview.job_description && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                  <p className="text-gray-700 leading-relaxed">
                    {interview.job_description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {interview.notes && (
            <div className="bg-white rounded-2xl shadow-lg border-0 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Notes</h3>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-700 leading-relaxed">{interview.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Company Info */}
        <div className="space-y-6">
          {/* Company Information */}
          <div className="bg-white rounded-2xl shadow-lg border-0 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Company</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-500 mb-1">Company Name</p>
                <p className="font-semibold text-gray-900">{interview.company_name}</p>
              </div>
              
              {interview.company_website && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <a 
                      href={interview.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary-600 hover:text-primary-700 flex items-center"
                    >
                      Visit Website
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}
              
              {interview.company_linkedin_url && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Linkedin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">LinkedIn</p>
                    <a 
                      href={interview.company_linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary-600 hover:text-primary-700 flex items-center"
                    >
                      View Company
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}
              
              {interview.other_urls && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <LinkIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Other Links</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      {interview.other_urls.split(',').map((url, index) => (
                        <a 
                          key={index}
                          href={url.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 block"
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
          <div className="bg-white rounded-2xl shadow-lg border-0 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Interview Type</h3>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-500 mb-1">Type</p>
              <p className="font-semibold text-gray-900 capitalize">{interview.interview_type}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetail; 