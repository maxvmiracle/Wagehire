import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  Home,
  CalendarCheck,
  Users2,
  FileText,
  BarChart3,
  MessageSquare,
  Shield,
  UserCog,
  Briefcase,
  Award,
  UserX
} from 'lucide-react';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Calculate profile completion
  useEffect(() => {
    if (user && !isAdmin()) {
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
  }, [user, isAdmin]);

  // Navigation items based on user role
  const getNavigationItems = () => {
    const isProfileComplete = profileCompletion === 100;
    
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'My Interviews', href: '/interviews', icon: CalendarCheck },
      { 
        name: 'My Profile', 
        href: '/profile', 
        icon: isProfileComplete ? UserCheck : UserX 
      },
    ];

    // Admin-only items
    const adminItems = [
      { name: 'All Candidates', href: '/candidates', icon: Users2 },
      { name: 'All Users', href: '/users', icon: UserCog },
      { name: 'Admin Panel', href: '/admin', icon: Shield },
      { name: 'Reports', href: '/reports', icon: BarChart3 },
    ];

    return isAdmin() ? [...baseItems, ...adminItems] : baseItems;
  };

  const mainNavigation = getNavigationItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-50 bg-white shadow-xl rounded-2xl transition-all duration-300 ease-in-out flex flex-col lg:block ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-16 h-80`}
      >

        {/* Main Navigation - Centered vertically */}
        <div className="flex flex-col justify-center items-center h-full">
          <div className="space-y-2">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const isProfileItem = item.name === 'My Profile';
              const isProfileComplete = profileCompletion === 100;
              
              return (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.href}
                    className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 transform group-hover:scale-110 ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-900 shadow-lg scale-105'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon
                      className={`h-6 w-6 transition-all duration-300 ${
                        isActive(item.href)
                          ? 'text-primary-600'
                          : isProfileItem && !isProfileComplete
                          ? 'text-warning-500'
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                  </Link>
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                    {isProfileItem && !isProfileComplete && (
                      <div className="text-xs text-warning-300 mt-1">
                        {profileCompletion}% Complete
                      </div>
                    )}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Main content */}
      <div className="min-h-screen">
        {/* Mobile top bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <span className="font-medium">{user?.name}</span>
                {isAdmin() && (
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top bar with user info - positioned absolute */}
            <div className="hidden lg:flex items-center justify-end absolute top-4 right-4 z-10">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors shadow-sm">
                  <Bell className="w-5 h-5" />
                </button>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 bg-white rounded-lg px-3 py-2 shadow-sm transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="font-medium">{user?.name}</span>
                  {isAdmin() && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors shadow-sm"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="pt-16 lg:pt-20">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 