import React from 'react';
import { Briefcase, Sparkles, Users, Calendar, User, Shield, Mail, FileText, Settings, Home } from 'lucide-react';

const LoadingScreen = ({ message = "Loading...", icon = Briefcase }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Sparkles 
              className="text-white/20 w-2 h-2" 
              style={{
                transform: `scale(${0.5 + Math.random() * 0.5})`
              }}
            />
          </div>
        ))}
      </div>

      {/* Main loading container */}
      <div className="relative z-10 text-center">
        {/* Falling icon animation */}
        <div className="relative mb-8">
          {/* Icon container with glow effect */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            
            {/* Main icon with bounce animation */}
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-6 shadow-2xl animate-bounce">
              {React.createElement(icon, { className: "w-12 h-12 text-white drop-shadow-lg" })}
            </div>
            
            {/* Floating particles around the icon */}
            <div className="absolute -top-2 -right-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
            <div className="absolute -bottom-2 -left-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div className="absolute -top-1 -left-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>

        {/* Loading text with gradient */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Wagehire
          </h2>
          <p className="text-blue-200 text-lg font-medium">{message}</p>
          
          {/* Animated dots */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-full rounded-full animate-pulse" 
                 style={{ 
                   width: '60%',
                   animation: 'progress 2s ease-in-out infinite'
                 }}>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-8 left-8 opacity-30">
        <div className="w-16 h-16 border-2 border-white/30 rounded-full animate-spin"></div>
      </div>
      <div className="absolute bottom-8 right-8 opacity-30">
        <div className="w-12 h-12 border-2 border-white/30 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes progress {
            0%, 100% { width: 20%; }
            50% { width: 80%; }
          }
        `
      }} />
    </div>
  );
};

export default LoadingScreen; 