import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Plus,
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  Building,
  User,
  MapPin,
  ExternalLink,
  Linkedin,
  LinkIcon
} from 'lucide-react';

const Interviews = () => {
  const { isAdmin } = useAuth();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/interviews');
      setInterviews(response.data.interviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInterview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this interview?')) {
      return;
    }

    try {
      await axios.delete(`/api/interviews/${id}`);
      toast.success('Interview deleted successfully');
      fetchInterviews();
    } catch (error) {
      console.error('Error deleting interview:', error);
      toast.error('Failed to delete interview');
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
      weekday: 'short',
      month: 'short',
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

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = 
      interview.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.interviewer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {isAdmin() ? 'All Interviews' : 'My Interviews'}
            </h1>
            <p className="text-primary-100 text-lg">
              {isAdmin() 
                ? 'Manage and monitor all interview schedules'
                : 'Track and manage your interview appointments'
              }
            </p>
          </div>
          <Link
            to="/interviews/schedule/new"
            className="bg-white text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-xl font-semibold flex items-center shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Schedule Interview
          </Link>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg border-0 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company, position, or interviewer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Interviews List */}
      <div className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {filteredInterviews.length} Interview{filteredInterviews.length !== 1 ? 's' : ''}
              </h2>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          {filteredInterviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No interviews found' : 'No interviews yet'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                  : 'Get started by scheduling your first interview to track your career journey.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link 
                  to="/interviews/schedule/new" 
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Schedule Your First Interview
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="group border border-gray-200 rounded-2xl p-6 hover:border-primary-200 hover:shadow-xl transition-all duration-300 bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Interview Header */}
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <Link
                            to={`/interviews/${interview.id}`}
                            className="text-xl font-bold text-gray-900 hover:text-primary-600 cursor-pointer transition-colors"
                          >
                            {interview.company_name} - {interview.job_title}
                          </Link>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(interview.status)}`}>
                              {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                            </span>
                            <span className="text-sm text-gray-500">
                              Round {interview.round_number}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Interview Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-500">Date</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatInterviewDate(interview.scheduled_date)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-500">Time</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatInterviewTime(interview.scheduled_date)} ({interview.duration} min)
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-500">Interviewer</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {interview.interviewer_name || 'TBD'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-500">Location</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {interview.location || 'Remote'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Notes and Links */}
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          {interview.notes && (
                            <div className="p-3 bg-blue-50 rounded-xl mb-3">
                              <p className="text-sm text-blue-700">{interview.notes}</p>
                            </div>
                          )}
                          
                          {/* Company Links */}
                          <div className="flex items-center space-x-4">
                            {interview.company_website && (
                              <div className="flex items-center space-x-2">
                                <Building className="w-4 h-4 text-gray-400" />
                                <a
                                  href={interview.company_website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                                >
                                  Visit Company Website
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              </div>
                            )}
                            
                            {interview.company_linkedin_url && (
                              <div className="flex items-center space-x-2">
                                <Linkedin className="w-4 h-4 text-gray-400" />
                                <a
                                  href={interview.company_linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                                >
                                  View Company LinkedIn
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              </div>
                            )}
                            
                            {interview.other_urls && (
                              <div className="flex items-center space-x-2">
                                <LinkIcon className="w-4 h-4 text-gray-400" />
                                <div className="flex items-center space-x-2">
                                  {interview.other_urls.split(',').map((url, index) => (
                                    <a
                                      key={index}
                                      href={url.trim()}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                                    >
                                      Other Link {index + 1}
                                      <ExternalLink className="w-3 h-3 ml-1" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 ml-6">
                          <Link
                            to={`/interviews/${interview.id}`}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          
                          {interview.status === 'scheduled' && (
                            <>
                              <Link
                                to={`/interviews/${interview.id}/edit`}
                                className="p-2 text-gray-400 hover:text-warning-600 hover:bg-warning-50 rounded-xl transition-colors"
                                title="Edit Interview"
                              >
                                <Edit className="w-5 h-5" />
                              </Link>
                              
                              <button
                                onClick={() => handleDeleteInterview(interview.id)}
                                className="p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-xl transition-colors"
                                title="Delete Interview"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interviews; 