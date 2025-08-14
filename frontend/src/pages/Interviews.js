import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import notificationService from '../services/notificationService';
import LoadingScreen from '../components/LoadingScreen';
import NotificationSettings from '../components/NotificationSettings';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Bell,
  Award,
  Hash,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarDays,
  Eye
} from 'lucide-react';

const Interviews = () => {
  const { isAdmin } = useAuth();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  useEffect(() => {
    fetchInterviews();
    
    // Check notification permission status
    setNotificationPermission(notificationService.hasPermission());
    
    // Show access point information if accessing from different IP
    const accessPointInfo = notificationService.getAccessPointGuidance();
    if (accessPointInfo && !notificationService.hasPermission()) {
      // Show access point notice after a short delay
      setTimeout(() => {
        notificationService.showAccessPointInfo();
      }, 2000);
    }
    
    // Start notification checking when component mounts
    return () => {
      // Clean up notification checking when component unmounts
      notificationService.stopChecking();
    };
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      console.log('Fetching interviews...');
      const response = await api.get('/interviews');
      console.log('Interviews response:', response.data);
      setInterviews(response.data.interviews);
      
      // Start notification checking with the fetched interviews
      notificationService.startChecking(response.data.interviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      console.error('Error response:', error.response);
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
      await api.delete(`/interviews/${id}`);
      toast.success('Interview deleted successfully');
      fetchInterviews();
    } catch (error) {
      console.error('Error deleting interview:', error);
      toast.error('Failed to delete interview');
    }
  };

  const handleRequestNotificationPermission = async () => {
    const result = await notificationService.requestPermission();
    setNotificationPermission(result.granted);
    
    if (result.granted) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
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
      case 'uncertain':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'scheduled':
        return <CalendarDays className="w-4 h-4" />;
      case 'uncertain':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <CalendarDays className="w-4 h-4" />;
    }
  };

  const getInterviewTypeIcon = (type) => {
    switch (type) {
      case 'hr':
        return <User className="w-4 h-4" />;
      case 'technical':
        return <Award className="w-4 h-4" />;
      case 'final':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const formatInterviewDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const formatShortDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getInterviewsForDate = (date) => {
    return interviews.filter(interview => interview.scheduled_date && isSameDay(interview.scheduled_date, date));
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = 
      interview.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.interviewer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.candidate_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
    
    let matchesDate = true;
    if (selectedDate) {
      matchesDate = interview.scheduled_date && isSameDay(interview.scheduled_date, selectedDate);
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Group interviews by candidate for admin view
  const groupInterviewsByCandidate = (interviews) => {
    const grouped = {};
    
    interviews.forEach(interview => {
      const candidateId = interview.candidate_id;
      const candidateName = interview.candidate_name || 'Unknown Candidate';
      const candidateEmail = interview.candidate_email || 'No email';
      
      if (!grouped[candidateId]) {
        grouped[candidateId] = {
          candidateId,
          candidateName,
          candidateEmail,
          interviews: []
        };
      }
      
      grouped[candidateId].interviews.push(interview);
    });
    
    // Sort candidates by name and interviews by date
    return Object.values(grouped)
      .map(group => ({
        ...group,
        interviews: group.interviews.sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
      }))
      .sort((a, b) => a.candidateName.localeCompare(b.candidateName));
  };

  const groupedInterviews = isAdmin() ? groupInterviewsByCandidate(filteredInterviews) : null;

  const calendarDays = getDaysInMonth(currentMonth);

  if (loading) {
    return <LoadingScreen message="Loading interviews..." icon={CalendarDays} />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-9xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <CalendarDays className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1 overflow-safe">
              {isAdmin() ? 'All Interviews' : 'My Interviews'}
            </h1>
            <p className="text-primary-100 text-sm overflow-safe">
              {isAdmin() 
                      ? 'Manage and monitor all interview schedules across candidates'
                      : 'Track and manage your professional interview appointments'
              }
            </p>
          </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success-400 rounded-full"></div>
                  <span className="text-sm text-primary-100">
                    {interviews.filter(i => i.status === 'scheduled').length} Scheduled
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-warning-400 rounded-full"></div>
                  <span className="text-sm text-primary-100">
                    {interviews.filter(i => i.status === 'uncertain').length} Pending
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                  <span className="text-sm text-primary-100">
                    {interviews.filter(i => i.status === 'completed').length} Completed
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
            {notificationService.isSupported() && (
              <button
                onClick={() => setShowNotificationSettings(true)}
                  className={`px-6 py-3 rounded-2xl font-semibold flex items-center shadow-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm ${
                  notificationPermission 
                      ? 'bg-success-500/90 text-white hover:bg-success-600/90' 
                      : 'bg-warning-500/90 text-white hover:bg-warning-600/90'
                }`}
                title={notificationPermission ? 'Notification settings' : 'Enable interview reminders'}
              >
                <Bell className="w-5 h-5 mr-2" />
                {notificationPermission ? 'Notifications On' : 'Enable Reminders'}
              </button>
            )}
          <Link
            to="/interviews/schedule/new"
                className="bg-white text-primary-700 hover:bg-primary-50 px-8 py-3 rounded-2xl font-semibold flex items-center shadow-lg transition-all duration-300 transform hover:scale-105 btn-responsive"
          >
            <Plus className="w-5 h-5 mr-2" />
            Schedule Interview
          </Link>
          </div>
        </div>
      </div>

        {/* Enhanced Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4">
          <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                  type="text"
                  placeholder={isAdmin() ? "Search by company, position, interviewer, or candidate..." : "Search by company, position, or interviewer..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 text-base"
                />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 text-base"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="uncertain">Uncertain/Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

        {/* Enhanced Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Enhanced Calendar Column */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 xl:col-span-1 h-[600px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-primary-600" />
                Calendar
              </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
                <span className="text-sm font-semibold text-gray-900 px-3 py-1 bg-gray-100 rounded-lg">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
            <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {calendarDays.map((day, index) => {
            if (!day) {
                  return <div key={index} className="h-10"></div>;
            }
            
            const dayInterviews = getInterviewsForDate(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(isSelected ? null : day)}
                    className={`h-10 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center relative ${
                  isSelected 
                        ? 'bg-primary-500 text-white shadow-lg' 
                    : dayInterviews.length > 0
                            ? 'bg-warning-100 text-warning-700 hover:bg-warning-200 border border-warning-300'
                            : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                }`}
              >
                  <span>{day.getDate()}</span>
                  {dayInterviews.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-warning-500 rounded-full shadow-sm"></div>
                  )}
              </button>
            );
          })}
        </div>
        
                    {selectedDate && (
                                                  <div className="flex items-center justify-between p-3 bg-primary-50 rounded-xl border border-primary-200">
              <span className="text-sm text-primary-700 font-medium">
                Selected: {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
            <button
              onClick={() => setSelectedDate(null)}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium bg-white px-3 py-1 rounded-lg border border-primary-200"
            >
                Clear
            </button>
          </div>
        )}
      </div>

          {/* Enhanced Interview List Column */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden xl:col-span-3 h-[600px]">
            <div className="px-6 py-4 border-b border-white/30 bg-gradient-to-r from-white/40 to-white/60 backdrop-blur-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary-600" />
            </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 overflow-safe">
                  Interview Time Slots
                </h2>
                    <p className="text-gray-600">
                      {filteredInterviews.length} interview{filteredInterviews.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                </div>
          </div>
        </div>
        
            <div className="p-6 max-h-[500px] overflow-y-auto">
          {filteredInterviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CalendarDays className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 overflow-safe">
                {searchTerm || statusFilter !== 'all' || selectedDate ? 'No interviews found' : 'No interviews yet'}
              </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm overflow-safe">
                {searchTerm || statusFilter !== 'all' || selectedDate
                      ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                      : 'Get started by scheduling your first interview appointment.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && !selectedDate && (
                <Link 
                  to="/interviews/schedule/new" 
                      className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-2xl font-semibold hover:bg-primary-700 transition-all duration-300 text-base shadow-lg hover:shadow-xl"
                >
                      <Plus className="w-5 h-5 mr-2" />
                      Schedule Your First Interview
                </Link>
              )}
            </div>
            ) : isAdmin() ? (
                // Enhanced Admin view: Grouped by candidate
                <div className="space-y-4">
                {groupedInterviews.map((candidateGroup) => (
                                         <div key={candidateGroup.candidateId} className="border border-white/30 rounded-xl overflow-hidden shadow-lg bg-white/60 backdrop-blur-sm">
                       {/* Enhanced Candidate Header */}
                       <div className="bg-gradient-to-r from-white/40 to-white/60 backdrop-blur-sm px-4 py-3 border-b border-white/30">
                      <div className="flex items-center justify-between">
                                                      <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5 text-primary-600" />
                              </div>
                                                          <div>
                                <h3 className="text-base font-bold text-gray-900">{candidateGroup.candidateName}</h3>
                                <p className="text-xs text-gray-600 flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {candidateGroup.candidateEmail}
                                </p>
                              </div>
                          </div>
                          <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-lg border">
                          {candidateGroup.interviews.length} interview{candidateGroup.interviews.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    
                      {/* Enhanced Candidate's Interviews */}
                                          <div className="divide-y divide-white/30">
                      {candidateGroup.interviews.map((interview) => (
                        <div
                          key={interview.id}
                            className="group p-3 hover:bg-white/50 transition-all duration-300 border-b border-white/20 last:border-b-0"
                        >
                                                          <div className="flex items-start space-x-3">
                                {/* Enhanced Interview Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-3 mb-2">
                                                                    <Link
                                      to={`/interviews/${interview.id}`}
                                      className="text-lg font-bold text-gray-900 hover:text-primary-600 cursor-pointer transition-colors overflow-safe truncate"
                                    >
                                      {interview.company_name}
                                    </Link>
                                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-full border flex items-center space-x-1.5 shadow-sm ${getStatusColor(interview.status)}`}>
                                    {getStatusIcon(interview.status)}
                                    <span>{interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}</span>
                                </span>
                              </div>
                              
                                                                  <div className="text-base text-gray-600 mb-3">
                                  <div className="flex items-center space-x-3">
                                    <span className="font-semibold text-gray-700">{interview.job_title}</span>
                                    {(() => {
                                        return (!interview.scheduled_date || interview.status === 'uncertain');
                                    })() ? (
                                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-warning-100 text-warning-700 rounded-full border border-warning-200 shadow-sm">
                                        <AlertCircle className="w-3 h-3 mr-1.5" />
                                        {(() => {
                                          if (!interview.scheduled_date) return 'No Date';
                                          if (interview.status === 'uncertain') return 'Uncertain';
                                          if (interview.status === 'scheduled') return 'Scheduled';
                                          if (interview.status === 'completed') return 'Completed';
                                          if (interview.status === 'cancelled') return 'Cancelled';
                                          if (interview.status === 'rescheduled') return 'Rescheduled';
                                          return 'Upcoming';
                                        })()}
                                      </span>
                                    ) : (
                                      <>
                                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full border border-primary-200 shadow-sm">
                                          <CalendarDays className="w-3 h-3 mr-1.5" />
                                          {formatShortDate(interview.scheduled_date)}
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-warning-100 text-warning-700 rounded-full border border-warning-200 shadow-sm">
                                          <Clock className="w-3 h-3 mr-1.5" />
                                          {formatInterviewTime(interview.scheduled_date)}
                                        </span>
                                      </>
                                    )}
                                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200 shadow-sm">
                                      <Hash className="w-3 h-3 mr-1.5" />
                                      R{interview.round}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full border border-purple-200 shadow-sm">
                                      {getInterviewTypeIcon(interview.interview_type)}
                                      <span className="ml-1.5">
                                        {interview.interview_type ? interview.interview_type.charAt(0).toUpperCase() + interview.interview_type.slice(1) : 'Technical'}
                                      </span>
                                    </span>
                                  </div>
                              </div>

                                
                                {interview.interviewer_name && (
                                  <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50/80 px-3 py-2 rounded-lg border border-gray-100">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="font-medium">Interviewer: {interview.interviewer_name}</span>
                                </div>
                                )}
                              </div>
                              
                              {/* Enhanced Action Buttons */}
                              <div className="flex items-center space-x-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <Link
                                to={`/interviews/${interview.id}`}
                                  className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                                title="View Details"
                              >
                                  <Eye className="w-4 h-4" />
                              </Link>
                              
                              <Link
                                to={`/interviews/${interview.id}/edit`}
                                  className="p-2.5 text-gray-400 hover:text-warning-600 hover:bg-warning-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                                title="Edit Interview"
                              >
                                  <Edit className="w-4 h-4" />
                              </Link>
                              
                              <button
                                onClick={() => handleDeleteInterview(interview.id)}
                                  className="p-2.5 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                                title="Delete Interview"
                              >
                                  <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
                // Enhanced Regular user view: Modern cards
                <div className="space-y-4">
              {filteredInterviews.map((interview) => (
                                      <div
                        key={interview.id}
                        className="group bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl p-4 hover:border-primary-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                      >
                                              <div className="flex items-start space-x-4">
                        {/* Enhanced Interview Info */}
                      <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                                                      <Link
                              to={`/interviews/${interview.id}`}
                              className="text-xl font-bold text-gray-900 hover:text-primary-600 cursor-pointer transition-colors overflow-safe truncate"
                            >
                              {interview.company_name}
                            </Link>
                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full border flex items-center space-x-1.5 shadow-sm ${getStatusColor(interview.status)}`}>
                              {getStatusIcon(interview.status)}
                              <span>{interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}</span>
                          </span>
                        </div>
                        
                          <div className="text-base text-gray-600 mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="font-semibold text-gray-700">{interview.job_title}</span>
                              {(() => {
                                return (!interview.scheduled_date || interview.status === 'uncertain');
                              })() ? (
                                <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-warning-100 text-warning-700 rounded-full border border-warning-200 shadow-sm">
                                  <AlertCircle className="w-3 h-3 mr-1.5" />
                                  {(() => {
                                    if (!interview.scheduled_date) return 'No Date';
                                    if (interview.status === 'uncertain') return 'Uncertain';
                                    if (interview.status === 'scheduled') return 'Scheduled';
                                    if (interview.status === 'completed') return 'Completed';
                                    if (interview.status === 'cancelled') return 'Cancelled';
                                    if (interview.status === 'rescheduled') return 'Rescheduled';
                                    return 'Upcoming';
                                  })()}
                                </span>
                              ) : (
                                <>
                                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full border border-primary-200 shadow-sm">
                                    <CalendarDays className="w-3 h-3 mr-1.5" />
                                    {formatShortDate(interview.scheduled_date)}
                                  </span>
                                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-warning-100 text-warning-700 rounded-full border border-warning-200 shadow-sm">
                                    <Clock className="w-3 h-3 mr-1.5" />
                                    {formatInterviewTime(interview.scheduled_date)}
                                  </span>
                                </>
                              )}
                              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200 shadow-sm">
                                <Hash className="w-3 h-3 mr-1.5" />
                                R{interview.round}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full border border-purple-200 shadow-sm">
                                {getInterviewTypeIcon(interview.interview_type)}
                                <span className="ml-1.5">
                                  {interview.interview_type ? interview.interview_type.charAt(0).toUpperCase() + interview.interview_type.slice(1) : 'Technical'}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {interview.interviewer_name && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50/80 px-3 py-2 rounded-lg border border-gray-100">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">Interviewer: {interview.interviewer_name}</span>
                      </div>
                        )}
                    
                        {/* Enhanced Action Buttons */}
                        <div className="flex items-center space-x-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Link
                        to={`/interviews/${interview.id}`}
                            className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                        title="View Details"
                      >
                            <Eye className="w-4 h-4" />
                      </Link>
                      
                          <Link
                            to={`/interviews/${interview.id}/edit`}
                            className="p-2.5 text-gray-400 hover:text-warning-600 hover:bg-warning-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                            title="Edit Interview"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          
                          <button
                            onClick={() => handleDeleteInterview(interview.id)}
                            className="p-2.5 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-all duration-200 hover:shadow-sm"
                            title="Delete Interview"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
            </div>
        </div>
      </div>
      </div>

      {/* Notification Settings Modal */}
      <NotificationSettings 
        isOpen={showNotificationSettings} 
        onClose={() => setShowNotificationSettings(false)} 
      />
    </div>
  );
};

export default Interviews; 