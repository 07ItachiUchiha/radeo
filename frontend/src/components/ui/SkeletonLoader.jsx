import React from "react";
import { motion } from "framer-motion";

const SkeletonLoader = ({ 
  type = "rectangle", // rectangle, circle, text, card
  width,
  height,
  className = "",
  count = 1,
  animated = true
}) => {
  // Define base styles
  const baseClasses = "bg-gray-200 rounded";
  
  // Type-specific default sizes and classes
  const typeStyles = {
    rectangle: `${height || "h-24"} ${width || "w-full"}`,
    circle: `rounded-full ${height || "h-16"} ${width || "w-16"}`,
    text: `h-4 ${width || "w-3/4"} mb-2`,
    card: "w-full h-64"
  };

  // Create skeleton array for multiple items
  const skeletons = [];
  for (let i = 0; i < count; i++) {
    skeletons.push(i);
  }

  // Animation variants
  const shimmerVariants = {
    initial: {
      backgroundPosition: "-500px 0",
    },
    animate: {
      backgroundPosition: "500px 0",
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      },
    },
  };

  // If it's a card, return a product card skeleton
  if (type === "card") {
    return (
      <div className={`${className}`}>
        {skeletons.map((index) => (
          <div key={index} className="rounded overflow-hidden shadow-sm">
            <motion.div
              className={`${baseClasses} aspect-square`}
              variants={animated ? shimmerVariants : {}}
              initial={animated ? "initial" : undefined}
              animate={animated ? "animate" : undefined}
              style={animated ? { backgroundImage: "linear-gradient(90deg, #f0f0f0 0px, #f8f8f8 40px, #f0f0f0 80px)" } : {}}
            />
            <div className="p-3">
              <motion.div
                className={`${baseClasses} h-4 w-2/3 mb-2`}
                variants={animated ? shimmerVariants : {}}
                initial={animated ? "initial" : undefined}
                animate={animated ? "animate" : undefined}
                style={animated ? { backgroundImage: "linear-gradient(90deg, #f0f0f0 0px, #f8f8f8 40px, #f0f0f0 80px)" } : {}}
              />
              <motion.div
                className={`${baseClasses} h-4 w-1/4`}
                variants={animated ? shimmerVariants : {}}
                initial={animated ? "initial" : undefined}
                animate={animated ? "animate" : undefined}
                style={animated ? { backgroundImage: "linear-gradient(90deg, #f0f0f0 0px, #f8f8f8 40px, #f0f0f0 80px)" } : {}}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // For other types, return simple skeletons
  return (
    <div className={`${className} space-y-2`}>
      {skeletons.map((index) => (
        <motion.div
          key={index}
          className={`${baseClasses} ${typeStyles[type]}`}
          variants={animated ? shimmerVariants : {}}
          initial={animated ? "initial" : undefined}
          animate={animated ? "animate" : undefined}
          style={animated ? { backgroundImage: "linear-gradient(90deg, #f0f0f0 0px, #f8f8f8 40px, #f0f0f0 80px)" } : {}}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
