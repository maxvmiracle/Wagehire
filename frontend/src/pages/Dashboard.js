import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import {
  Calendar,
  Users,
  UserCheck,
  Clock,
  TrendingUp,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Star,
  Activity,
  Target,
  BookOpen,
  Shield,
  UserCog,
  Briefcase,
  Award,
  FileText,
  UserX
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let statsResponse, interviewsResponse;
        
        if (isAdmin()) {
          // Admin dashboard - get system-wide stats
          [statsResponse, interviewsResponse] = await Promise.all([
            axios.get('/api/admin/dashboard'),
            axios.get('/api/admin/interviews?limit=5')
          ]);
        } else {
          // Candidate dashboard - get personal stats
          [statsResponse, interviewsResponse] = await Promise.all([
            axios.get('/api/users/me/dashboard'),
            axios.get('/api/interviews?limit=5')
          ]);
        }

        setStats(statsResponse.data.stats);
        setRecentInterviews(interviewsResponse.data.interviews);
        
        // Calculate profile completion for candidates
        if (!isAdmin() && user) {
          const profileFields = [
            { value: user.name, required: true },
            { value: user.email, required: true },
            { value: user.phone, required: false },
            { value: user.resume_url, required: false },
            { value: user.current_position, required: false },
            { value: user.experience_years, required: false },
            { value: user.skills, required: false }
          ];
          
          let completedFields = 0;
          let totalFields = 0;
          
          profileFields.forEach(field => {
            totalFields++;
            
            if (field.required) {
              if (field.value && (typeof field.value === 'string' ? field.value.trim() !== '' : field.value !== null && field.value !== undefined)) {
                completedFields++;
              }
            } else {
              if (field.value) {
                if (typeof field.value === 'string' && field.value.trim() !== '') {
                  completedFields++;
                } else if (typeof field.value === 'number' && field.value > 0) {
                  completedFields++;
                }
              }
            }
          });
          
          setProfileCompletion(Math.round((completedFields / totalFields) * 100));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin, user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-danger-600" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-primary-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-warning-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      case 'scheduled':
        return 'status-scheduled';
      default:
        return 'status-pending';
    }
  };

  const isProfileComplete = profileCompletion === 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-blue-800 rounded-2xl shadow-xl">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-blue-100 text-base">
                {isAdmin() 
                  ? 'Manage your interview system and oversee all activities'
                  : 'Track your interview progress and manage your career journey'
                }
              </p>
              <div className="flex items-center mt-4 space-x-4 text-blue-100">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {isAdmin() && (
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="text-sm">Admin Panel</span>
                  </div>
                )}
                {!isAdmin() && (
                  <div className="flex items-center">
                    {isProfileComplete ? (
                      <UserCheck className="w-4 h-4 mr-2" />
                    ) : (
                      <UserX className="w-4 h-4 mr-2" />
                    )}
                    <span className="text-sm">
                      {isProfileComplete ? 'Profile Complete' : 'Profile Incomplete'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                {isAdmin() ? (
                  <Shield className="w-12 h-12 text-white" />
                ) : isProfileComplete ? (
                  <UserCheck className="w-12 h-12 text-white" />
                ) : (
                  <UserX className="w-12 h-12 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completion Alert for Candidates */}
      {!isAdmin() && !isProfileComplete && (
        <div className="bg-warning-50 border border-warning-200 rounded-xl p-6">
          <div className="flex items-center">
            <UserX className="w-6 h-6 text-warning-600 mr-3" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-warning-900">
                Complete Your Profile
              </h3>
              <p className="text-warning-700 mt-1">
                Your profile is {profileCompletion}% complete. Complete your profile to increase your chances of getting interviews.
              </p>
            </div>
            <Link
              to="/profile"
              className="btn btn-warning"
            >
              Complete Profile
            </Link>
          </div>
        </div>
      )}

      {/* Profile Complete Success for Candidates */}
      {!isAdmin() && isProfileComplete && (
        <div className="bg-success-50 border border-success-200 rounded-xl p-6">
          <div className="flex items-center">
            <UserCheck className="w-6 h-6 text-success-600 mr-3" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-success-900">
                Profile Complete! 🎉
              </h3>
              <p className="text-success-700 mt-1">
                Your profile is 100% complete. You're ready to schedule interviews!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg border-0 p-5 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {isAdmin() ? 'Total Interviews' : 'My Interviews'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalInterviews || 0}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-success-600 mr-1" />
                <span className="text-xs text-success-600 font-medium">
                  {isAdmin() ? 'System total' : 'Your interviews'}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-0 p-5 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {isAdmin() ? 'Total Candidates' : 'Today\'s Interviews'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isAdmin() ? (stats?.totalCandidates || 0) : (stats?.today || 0)}
              </p>
              <div className="flex items-center mt-2">
                <Activity className="w-4 h-4 text-blue-600 mr-1" />
                <span className="text-xs text-blue-600 font-medium">
                  {isAdmin() ? 'Active candidates' : 'Active today'}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              {isAdmin() ? (
                <Users className="w-5 h-5 text-white" />
              ) : (
                <Clock className="w-5 h-5 text-white" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-0 p-5 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {isAdmin() ? 'Total Users' : 'Upcoming (7 days)'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isAdmin() ? (stats?.totalUsers || 0) : (stats?.upcoming || 0)}
              </p>
              <div className="flex items-center mt-2">
                <Target className="w-4 h-4 text-warning-600 mr-1" />
                <span className="text-xs text-warning-600 font-medium">
                  {isAdmin() ? 'System users' : 'Scheduled'}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center shadow-lg">
              {isAdmin() ? (
                <UserCog className="w-5 h-5 text-white" />
              ) : (
                <TrendingUp className="w-5 h-5 text-white" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-0 p-5 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {isAdmin() ? 'Recent Activity' : 'Profile Completion'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isAdmin() ? (recentInterviews?.length || 0) : `${profileCompletion}%`}
              </p>
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 text-purple-600 mr-1" />
                <span className="text-xs text-purple-600 font-medium">
                  {isAdmin() ? 'This week' : isProfileComplete ? 'Complete' : 'In progress'}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              {isAdmin() ? (
                <Activity className="w-5 h-5 text-white" />
              ) : isProfileComplete ? (
                <UserCheck className="w-5 h-5 text-white" />
              ) : (
                <UserX className="w-5 h-5 text-white" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border-0 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          <div className="text-sm text-gray-500">Get things done faster</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/interviews/schedule/new"
            className="group relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 hover:from-primary-100 hover:to-primary-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Interview</h3>
                <p className="text-sm text-gray-600">Book a new interview session</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>

          <Link
            to="/profile"
            className="group relative overflow-hidden bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-6 hover:from-success-100 hover:to-success-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {isProfileComplete ? (
                    <UserCheck className="w-6 h-6 text-white" />
                  ) : (
                    <UserX className="w-6 h-6 text-white" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isProfileComplete ? 'Profile Complete' : 'Update Profile'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isProfileComplete ? 'Your profile is complete' : 'Update your resume and skills'}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-success-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>

          <Link
            to="/interviews"
            className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isAdmin() ? 'View All Interviews' : 'View My Interviews'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isAdmin() ? 'See all scheduled interviews' : 'Track your interview progress'}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Interviews */}
      <div className="bg-white rounded-xl shadow-lg border-0">
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {isAdmin() ? 'Recent Interviews' : 'My Recent Interviews'}
            </h2>
            <Link 
              to="/interviews" 
              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="p-8">
          {recentInterviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No interviews yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {isAdmin() 
                  ? 'No interviews have been scheduled in the system yet.'
                  : 'Get started by scheduling your first interview. You\'ll see all your recent interviews here.'
                }
              </p>
              <Link
                to="/interviews/schedule/new"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Schedule Your First Interview
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="group flex items-center justify-between p-6 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-25 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(interview.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                        {interview.company_name} - {interview.job_title}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-sm text-gray-600">
                          {new Date(interview.scheduled_date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })} at{' '}
                          {new Date(interview.scheduled_date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <span className="text-gray-300">•</span>
                        <p className="text-sm text-gray-600">{interview.interviewer_name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(interview.status)}`}>
                      {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                    </span>
                    <Link
                      to={`/interviews/${interview.id}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
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

export default Dashboard; 