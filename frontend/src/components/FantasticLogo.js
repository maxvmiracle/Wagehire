import React from 'react';
import { Briefcase, Sparkles } from 'lucide-react';

const FantasticLogo = ({ size = 'large', showSparkles = true }) => {
  return (
    <div className={`fantastic-logo ${size}`}>
      {/* Background glow effect */}
      <div className="logo-glow-bg"></div>
      
      {/* Main logo container */}
      <div className="logo-container">
        {/* Icon with enhanced effects */}
        <div className="logo-icon-enhanced">
          <div className="icon-glow"></div>
          <div className="icon-shine"></div>
          <div className="icon-sparkle"></div>
          <Briefcase className="icon-main" />
          
          {/* Floating sparkles around icon */}
          {showSparkles && (
            <>
              <Sparkles className="sparkle sparkle-1" />
              <Sparkles className="sparkle sparkle-2" />
              <Sparkles className="sparkle sparkle-3" />
            </>
          )}
        </div>
        
        {/* Text with enhanced effects */}
        <div className="logo-text-enhanced">
          <span className="text-main">Wagehire</span>
          <span className="text-shadow">Wagehire</span>
          <span className="text-glow">Wagehire</span>
        </div>
      </div>
      
      {/* Particle effects */}
      <div className="logo-particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>
    </div>
  );
};

export default FantasticLogo; 