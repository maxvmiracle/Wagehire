import React from 'react';

const DebugInfo = () => {
  const debugInfo = {
    environment: process.env.NODE_ENV,
    apiUrl: process.env.REACT_APP_API_URL,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    localStorage: {
      token: localStorage.getItem('token') ? 'Present' : 'Not found',
      hasUser: localStorage.getItem('user') ? 'Present' : 'Not found'
    },
    window: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      location: window.location.href
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white z-50 p-4 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Debug Information</h1>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
        
        <div className="mt-4 space-y-2">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
          <button
            onClick={() => localStorage.clear()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 ml-2"
          >
            Clear Local Storage
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugInfo; 