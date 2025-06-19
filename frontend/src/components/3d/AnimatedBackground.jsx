import React, { useRef, useState, useEffect } from "react";

// Fallback implementation for useInView
const useInViewFallback = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const current = ref.current;
    
    if (current && typeof IntersectionObserver === 'function') {
      const observer = new IntersectionObserver(([entry]) => {
        setInView(entry.isIntersecting);
      }, {
        threshold: options.threshold || 0,
      });

      observer.observe(current);
      return () => observer.unobserve(current);
    } else {
      setInView(true);
      return undefined;
    }
  }, [options.threshold]);

  return [ref, inView];
};

// CSS-based animated background as fallback
const AnimatedBackgroundFallback = ({ className, intensity = 1 }) => {
  const [ref, inView] = useInViewFallback({
    threshold: 0.1,
  });
  
  // Generate random gradient points for the background
  const generateGradientPoints = () => {
    return [
      `rgba(218, 234, 241, ${0.4 * intensity})`,
      `rgba(200, 231, 237, ${0.2 * intensity})`,
      `rgba(167, 187, 199, ${0.3 * intensity})`,
      `rgba(255, 211, 181, ${0.1 * intensity})`
    ];
  };
  
  const gradientColors = generateGradientPoints();
  
  const backgroundStyle = {
    background: `radial-gradient(circle at 50% 50%, 
                ${gradientColors[0]} 0%, 
                ${gradientColors[1]} 25%, 
                ${gradientColors[2]} 75%, 
                ${gradientColors[3]} 100%)`,
    animation: 'gradient-shift 15s ease infinite alternate',
  };
  
  return (
    <div 
      ref={ref} 
      className={`${className} overflow-hidden`}
      style={inView ? backgroundStyle : {}}
    >
      <style jsx="true">{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

// Main component that will try to use Three.js if available
const AnimatedBackground = (props) => {
  // Always use the fallback for now until we install the required libraries
  return <AnimatedBackgroundFallback {...props} />;
};

export default AnimatedBackground;
