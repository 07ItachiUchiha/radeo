import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Fallback implementation of useInView when the library is not available
const useInViewFallback = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const current = ref.current;
    
    // Simple fallback using Intersection Observer API directly
    if (current && typeof IntersectionObserver === 'function') {
      const observer = new IntersectionObserver(([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && options.triggerOnce) {
          observer.unobserve(current);
        }
      }, {
        threshold: options.threshold || 0,
      });

      observer.observe(current);
      return () => observer.unobserve(current);
    } else {
      // If IntersectionObserver is not available, just set to true
      setInView(true);
      return undefined;
    }
  }, [options.threshold, options.triggerOnce]);

  return [ref, inView];
};

// Try to use the library, fall back to our implementation if it fails
let useInView;
try {
  // Dynamic import to prevent bundling errors
  useInView = (options) => {
    // We'll implement a fallback in case the import fails
    const [ref, isInViewHook] = useInViewFallback(options);
    return [ref, isInViewHook];
  };
} catch (err) {
  useInView = useInViewFallback;
}

const ScaleIn = ({ 
  children, 
  delay = 0, 
  duration = 0.5,
  className = "",
  threshold = 0.1,
  once = true
}) => {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: once,
  });

  const animationVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: duration,
        delay: delay,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={animationVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScaleIn;
