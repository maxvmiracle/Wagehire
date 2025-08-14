import React, { useEffect, useState } from 'react';

const GeometricShapes = () => {
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    console.log('GeometricShapes component mounted');
    
    // Generate random shapes
    const generateShapes = () => {
      const shapeTypes = ['circle', 'hexagon', 'star', 'triangle', 'diamond'];
      const newShapes = [];

      for (let i = 0; i < 12; i++) {
        const shape = {
          id: i,
          type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
          size: Math.random() * 60 + 20, // 20-80px
          delay: Math.random() * 25, // 0-25s delay
          duration: Math.random() * 10 + 20, // 20-30s duration
          left: Math.random() * 100, // 0-100% horizontal position
        };
        newShapes.push(shape);
      }

      console.log('Generated shapes:', newShapes);
      setShapes(newShapes);
    };

    generateShapes();
  }, []);

  return (
    <div className="geometric-shapes">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={`shape ${shape.type}`}
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: `${shape.left}%`,
            animationDelay: `${shape.delay}s`,
            animationDuration: `${shape.duration}s`,
            opacity: 0.3, // Make more visible
            zIndex: 1,
          }}
        />
      ))}
    </div>
  );
};

export default GeometricShapes; 