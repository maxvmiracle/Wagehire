import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  UserCheck,
  LogOut,
  Menu,
  Bell,
  User,
  Home,
  CalendarCheck,
  Users2,
  BarChart3,
  Shield,
  UserCog,
  UserX,
  X,
  Briefcase
} from 'lucide-react';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="mobile-nav-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`mobile-nav ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Mobile sidebar header */}
          <div className="p-3 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="wagehire-logo">
                <div className="wagehire-logo-icon">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="wagehire-logo-text">Wagehire</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors touch-target"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const isProfileItem = item.name === 'My Profile';
              const isProfileComplete = profileCompletion === 100;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center p-2.5 rounded-xl transition-colors touch-target ${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="font-medium text-sm">{item.name}</span>
                  {isProfileItem && !isProfileComplete && (
                    <span className="ml-auto px-1.5 py-0.5 text-xs bg-warning-100 text-warning-700 rounded-full">
                      {profileCompletion}%
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile sidebar footer */}
          <div className="p-3 border-t border-gray-200/50">
            <div className="flex items-center p-2.5 rounded-xl bg-gray-50">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-primary-600" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-2 p-2.5 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center touch-target"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="sidebar-responsive">
        <div className="flex flex-col items-center space-y-4">
          {mainNavigation.map((item) => {
            const Icon = item.icon;
            const isProfileItem = item.name === 'My Profile';
            const isProfileComplete = profileCompletion === 100;
            
            return (
              <div key={item.name} className="group relative">
                <Link
                  to={item.href}
                  className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 touch-target hover:scale-150 hover:shadow-2xl hover:-translate-y-1 ${
                    isActive(item.href)
                      ? 'bg-white/90 text-primary-700 shadow-lg'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {isProfileItem && !isProfileComplete && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-warning-500 rounded-full"></div>
                  )}
                </Link>
                
                {/* Tooltip */}
                <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
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

      {/* Main content */}
      <div className="content-wrapper">
        {/* Mobile top bar */}
        <div className="mobile-top-bar">
          <div className="flex items-center justify-between px-3 py-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 touch-target"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1.5">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg touch-target">
                <Bell className="w-4 h-4" />
              </button>
              <Link
                to="/profile"
                className="flex items-center space-x-1.5 text-xs text-white hover:text-white/80 backdrop-blur-md rounded-xl px-2 py-1.5 transition-all duration-300 hover:scale-105 touch-target border border-white/20"
              >
                <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium truncate max-w-[80px]">{user?.name}</span>
                {isAdmin() && (
                  <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 text-white hover:text-white/80 backdrop-blur-md rounded-xl transition-all duration-300 hover:scale-105 touch-target border border-white/20"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="content-main">
          {/* Top bar with user info - positioned absolute for desktop */}
          <div className="hidden lg:flex items-center justify-end absolute top-3 right-3 z-10">
            <div className="flex items-center space-x-1.5">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white/90 backdrop-blur-sm rounded-lg transition-colors shadow-sm touch-target">
                <Bell className="w-4 h-4" />
              </button>
              <Link
                to="/profile"
                className="flex items-center space-x-1.5 text-xs text-white hover:text-white/80 backdrop-blur-md rounded-xl px-3 py-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 border border-white/20"
              >
                <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium">{user?.name}</span>
                {isAdmin() && (
                  <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-white hover:text-white/80 backdrop-blur-md rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 border border-white/20 touch-target"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="pt-12 lg:pt-16 pb-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 