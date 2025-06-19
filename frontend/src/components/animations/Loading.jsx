import React from "react";
import { motion } from "framer-motion";

const Loading = ({ size = "md", color = "black", text = "" }) => {
  // Size variants
  const sizes = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };
  
  // Border sizes
  const borders = {
    sm: "border-2",
    md: "border-2",
    lg: "border-4"
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div 
        className={`${sizes[size]} ${borders[size]} rounded-full border-t-${color} border-b-${color} border-r-transparent border-l-transparent`}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      {text && (
        <motion.p 
          className="mt-4 text-gray-600 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default Loading;
