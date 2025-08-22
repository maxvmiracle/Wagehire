import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminApi } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import {
  Users,
  Calendar,
  Shield,
  Eye,
  Trash2,
  BarChart3,
  Activity,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const Admin = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAdmin()) {
      return;
    }

    const fetchAdminData = async () => {
      try {
        const [statsResponse, usersResponse, interviewsResponse] = await Promise.all([
          adminApi.getDashboard(),
          adminApi.getAllUsers(),
          adminApi.getInterviews(5)
        ]);

        setStats(statsResponse.stats);
        setUsers(usersResponse.users);
        setRecentInterviews(interviewsResponse.interviews);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAdmin]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      // Show success message
      alert('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      
      // Update local state
      setUsers(users.filter(user => user.id !== userId));
      
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-danger-600" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-primary-600" />;
      default:
        return <Activity className="w-4 h-4 text-warning-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (!isAdmin()) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingScreen message="Loading admin panel..." icon={Shield} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border-0 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage your interview system and oversee all activities</p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-primary-600" />
            <span className="text-sm font-medium text-primary-600">Administrator</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg border-0 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>



        <div className="bg-white rounded-xl shadow-lg border-0 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalInterviews || 0}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-0 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Recent Activity</p>
              <p className="text-2xl font-bold text-gray-900">{recentInterviews?.length || 0}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border-0">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'interviews', name: 'Interviews', icon: Calendar },
              { id: 'reports', name: 'Reports', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h3>
              
              {/* Recent Interviews */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Interviews</h4>
                <div className="space-y-3">
                  {recentInterviews.map((interview) => (
                    <div key={interview.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(interview.status)}
                        <div>
                          <p className="font-medium text-gray-900">{interview.candidate_name}</p>
                          <p className="text-sm text-gray-600">Interviewer: {interview.interviewer_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(interview.status)}`}>
                          {interview.status}
                        </span>
                        <Link
                          to={`/interviews/${interview.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Manage Users</h3>
                <span className="text-sm text-gray-600">{users.length} total users</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}



          {/* Interviews Tab */}
          {activeTab === 'interviews' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">All Interviews</h3>
                <Link
                  to="/interviews"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All Interviews
                </Link>
              </div>
              
              <div className="space-y-3">
                {recentInterviews.map((interview) => (
                  <div key={interview.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(interview.status)}
                      <div>
                        <p className="font-medium text-gray-900">{interview.candidate_name}</p>
                        <p className="text-sm text-gray-600">
                          {interview.status === 'uncertain' 
                            ? 'Date and time to be determined'
                            : `${new Date(interview.scheduled_date).toLocaleDateString()} at ${new Date(interview.scheduled_date).toLocaleTimeString()}`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                      <p className="text-sm text-gray-600">Interviewer: {interview.interviewer_name}</p>
                      <Link
                        to={`/interviews/${interview.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">System Reports</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Export Report
                  </button>
                </div>
              </div>

              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg border-0 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border-0 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Interviews</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalInterviews || 0}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border-0 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.completedInterviews || 0}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border-0 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Upcoming</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.upcomingInterviews || 0}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Reports */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Activity Report */}
                <div className="bg-white rounded-xl shadow-lg border-0 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">User Activity Report</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Active Users</p>
                        <p className="text-sm text-gray-600">Users with recent activity</p>
                      </div>
                      <span className="text-lg font-bold text-primary-600">{users.filter(u => u.role === 'user').length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Admin Users</p>
                        <p className="text-sm text-gray-600">System administrators</p>
                      </div>
                      <span className="text-lg font-bold text-primary-600">{users.filter(u => u.role === 'admin').length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">New Users (This Month)</p>
                        <p className="text-sm text-gray-600">Recently registered</p>
                      </div>
                      <span className="text-lg font-bold text-primary-600">
                        {users.filter(u => {
                          const userDate = new Date(u.created_at);
                          const now = new Date();
                          return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
                        }).length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interview Status Report */}
                <div className="bg-white rounded-xl shadow-lg border-0 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Interview Status Report</h4>
                  <div className="space-y-4">
                    {recentInterviews.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Scheduled</p>
                            <p className="text-sm text-gray-600">Upcoming interviews</p>
                          </div>
                          <span className="text-lg font-bold text-blue-600">
                            {recentInterviews.filter(i => i.status === 'scheduled').length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Completed</p>
                            <p className="text-sm text-gray-600">Finished interviews</p>
                          </div>
                          <span className="text-lg font-bold text-green-600">
                            {recentInterviews.filter(i => i.status === 'completed').length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Cancelled</p>
                            <p className="text-sm text-gray-600">Cancelled interviews</p>
                          </div>
                          <span className="text-lg font-bold text-red-600">
                            {recentInterviews.filter(i => i.status === 'cancelled').length}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No interview data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div className="bg-white rounded-xl shadow-lg border-0 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity Timeline</h4>
                <div className="space-y-4">
                  {recentInterviews.length > 0 ? (
                    recentInterviews.slice(0, 5).map((interview, index) => (
                      <div key={interview.id} className="flex items-center space-x-4 p-3 border border-gray-100 rounded-lg">
                        <div className="flex-shrink-0">
                          {getStatusIcon(interview.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            Interview: {interview.candidate_name} with {interview.interviewer_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(interview.scheduled_date).toLocaleDateString()} at{' '}
                            {new Date(interview.scheduled_date).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(interview.status)}`}>
                            {interview.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white rounded-xl shadow-lg border-0 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">System Health</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-medium text-green-800">System Status</p>
                    <p className="text-xs text-green-600">All systems operational</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-medium text-blue-800">User Management</p>
                    <p className="text-xs text-blue-600">Active and functional</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-medium text-purple-800">Interview System</p>
                    <p className="text-xs text-purple-600">Running smoothly</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin; 