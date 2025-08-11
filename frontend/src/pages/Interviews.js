import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';
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
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Interviews = () => {
  const { isAdmin } = useAuth();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      console.log('Fetching interviews...');
      const response = await api.get('/interviews');
      console.log('Interviews response:', response.data);
      setInterviews(response.data.interviews);
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

  const formatShortDate = (dateString) => {
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

  const isSameMonth = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth();
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
    return interviews.filter(interview => isSameDay(interview.scheduled_date, date));
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = 
      interview.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.interviewer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
    
    let matchesDate = true;
    if (selectedDate) {
      matchesDate = isSameDay(interview.scheduled_date, selectedDate);
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const calendarDays = getDaysInMonth(currentMonth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-responsive">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold mb-3 overflow-safe">
              {isAdmin() ? 'All Interviews' : 'My Interviews'}
            </h1>
            <p className="text-primary-100 text-lg overflow-safe">
              {isAdmin() 
                ? 'Manage and monitor all interview schedules'
                : 'Track and manage your interview appointments'
              }
            </p>
          </div>
          <Link
            to="/interviews/schedule/new"
            className="bg-white text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-xl font-semibold flex items-center shadow-lg transition-all duration-300 transform hover:scale-105 btn-responsive"
          >
            <Plus className="w-5 h-5 mr-2" />
            Schedule Interview
          </Link>
        </div>
      </div>

      {/* Calendar Filter */}
      <div className="bg-white rounded-xl shadow-lg border-0 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">Filter by Date</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-base font-semibold text-gray-900">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-0.5 mb-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
              {day}
            </div>
          ))}
          
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-7"></div>;
            }
            
            const dayInterviews = getInterviewsForDate(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(isSelected ? null : day)}
                className={`h-7 rounded text-xs font-medium transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary-500 text-white' 
                    : isToday 
                      ? 'bg-primary-100 text-primary-700 border border-primary-300'
                      : dayInterviews.length > 0
                        ? 'bg-warning-100 text-warning-700 hover:bg-warning-200'
                        : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="relative">
                  {day.getDate()}
                  {dayInterviews.length > 0 && (
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-warning-500 rounded-full"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        {selectedDate && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">
              Showing interviews for {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear filter
            </button>
          </div>
        )}
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
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
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
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 overflow-safe">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3 overflow-safe">
                {searchTerm || statusFilter !== 'all' || selectedDate ? 'No interviews found' : 'No interviews yet'}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-base overflow-safe">
                {searchTerm || statusFilter !== 'all' || selectedDate
                  ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                  : 'Get started by scheduling your first interview to track your career journey.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && !selectedDate && (
                <Link 
                  to="/interviews/schedule/new" 
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-300 btn-responsive"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Schedule Your First Interview
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="group border border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-lg transition-all duration-300 bg-white"
                >
                  <div className="flex items-center justify-between">
                    {/* Main Interview Info */}
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-primary-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <Link
                            to={`/interviews/${interview.id}`}
                            className="text-lg font-bold text-gray-900 hover:text-primary-600 cursor-pointer transition-colors overflow-safe truncate"
                          >
                            {interview.company_name}
                          </Link>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(interview.status)}`}>
                            {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="font-medium text-gray-700">{interview.job_title}</span>
                          <span>•</span>
                          <span>{formatShortDate(interview.scheduled_date)}</span>
                          <span>•</span>
                          <span>{formatInterviewTime(interview.scheduled_date)}</span>
                          <span>•</span>
                          <span>Round {interview.round_number}</span>
                          {interview.interviewer_name && (
                            <>
                              <span>•</span>
                              <span>{interview.interviewer_name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Link
                        to={`/interviews/${interview.id}`}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors touch-target"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      
                      {interview.status === 'scheduled' && (
                        <>
                          <Link
                            to={`/interviews/${interview.id}/edit`}
                            className="p-2 text-gray-400 hover:text-warning-600 hover:bg-warning-50 rounded-lg transition-colors touch-target"
                            title="Edit Interview"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          
                          <button
                            onClick={() => handleDeleteInterview(interview.id)}
                            className="p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors touch-target"
                            title="Delete Interview"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
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