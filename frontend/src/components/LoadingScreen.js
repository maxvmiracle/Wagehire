import React from 'react';
import { Briefcase, Sparkles } from 'lucide-react';

const LoadingScreen = ({ message = "Loading...", icon = Briefcase }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
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
              className="text-blue-300/40 w-3 h-3" 
              style={{
                transform: `scale(${0.5 + Math.random() * 0.5})`
              }}
            />
          </div>
        ))}
      </div>

      {/* Simple loading content - no container */}
      <div className="relative z-10 text-center">
        {/* Icon with glow effect */}
        <div className="relative mb-8">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-xl opacity-60 animate-pulse"></div>
            
            {/* Main icon with bounce animation */}
            <div className="relative bg-gradient-to-r from-blue-500 to-blue-700 rounded-full p-6 shadow-2xl animate-bounce border border-white/30">
              {React.createElement(icon, { className: "w-12 h-12 text-white drop-shadow-lg" })}
            </div>
            
            {/* Floating particles around the icon */}
            <div className="absolute -top-2 -right-2">
              <div className="w-3 h-3 bg-blue-300 rounded-full animate-ping"></div>
            </div>
            <div className="absolute -bottom-2 -left-2">
              <div className="w-2 h-2 bg-blue-200 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div className="absolute -top-1 -left-1">
              <div className="w-2 h-2 bg-blue-100 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
            Wagehire
          </h2>
          <p className="text-white text-lg font-medium drop-shadow-lg">{message}</p>
          
          {/* Animated dots */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce drop-shadow-lg"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce drop-shadow-lg" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce drop-shadow-lg" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full animate-pulse" 
                 style={{ 
                   width: '60%',
                   animation: 'progress 2s ease-in-out infinite'
                 }}>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-8 left-8 opacity-20">
        <div className="w-16 h-16 border-2 border-white/40 rounded-full animate-spin backdrop-blur-sm"></div>
      </div>
      <div className="absolute bottom-8 right-8 opacity-20">
        <div className="w-12 h-12 border-2 border-white/40 rounded-full animate-spin backdrop-blur-sm" style={{ animationDirection: 'reverse' }}></div>
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