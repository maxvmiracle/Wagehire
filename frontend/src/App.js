import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import DebugInfo from './components/DebugInfo';

// Lazy load pages for better performance
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Interviews = React.lazy(() => import('./pages/Interviews'));
const InterviewDetail = React.lazy(() => import('./pages/InterviewDetail'));
const EditInterview = React.lazy(() => import('./pages/EditInterview'));
const ScheduleInterview = React.lazy(() => import('./pages/ScheduleInterview'));
const Candidates = React.lazy(() => import('./pages/Candidates'));
const AddCandidate = React.lazy(() => import('./pages/AddCandidate'));
const CandidateDetail = React.lazy(() => import('./pages/CandidateDetail'));
const Users = React.lazy(() => import('./pages/Users'));
const Admin = React.lazy(() => import('./pages/Admin'));
const Profile = React.lazy(() => import('./pages/Profile'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = React.lazy(() => import('./pages/VerifyEmail'));

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error);
    console.error('Error Info:', errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
              <p className="text-gray-600 mb-4">
                The application encountered an error. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Refresh Page
              </button>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  // Debug logging
  console.log('App component rendering...');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('API URL:', process.env.REACT_APP_API_URL);

  // Show debug info if URL contains debug parameter
  const showDebug = window.location.search.includes('debug=true');

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            {showDebug && <DebugInfo />}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Suspense fallback={<LoadingScreen message="Loading application..." />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="interviews" element={<Interviews />} />
                  <Route path="interviews/:id" element={<InterviewDetail />} />
                  <Route path="interviews/:id/edit" element={<EditInterview />} />
                  <Route path="interviews/schedule/new" element={<ScheduleInterview />} />
                  <Route path="candidates" element={<Candidates />} />
                  <Route path="candidates/add" element={<AddCandidate />} />
                  <Route path="candidates/:id" element={<CandidateDetail />} />
                  <Route path="users" element={<Users />} />
                  <Route path="admin" element={<Admin />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App; 