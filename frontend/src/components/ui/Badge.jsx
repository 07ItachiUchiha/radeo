simport React from "react";
import { motion } from "framer-motion";

const Badge = ({ 
  children, 
  variant = "primary", 
  size = "md",
  animation = true,
  className = "" 
}) => {
  // Variant styles
  const variants = {
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-indigo-100 text-indigo-800",
    neutral: "bg-gray-100 text-gray-800",
  };
  
  // Size styles
  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5"
  };
  
  // Animation variants
  const badgeAnimation = animation ? {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  } : {};
  
  const badgeClasses = `inline-block rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <motion.span
      className={badgeClasses}
      initial={animation ? "initial" : undefined}
      animate={animation ? "animate" : undefined}
      whileHover={animation ? "hover" : undefined}
      whileTap={animation ? "tap" : undefined}
      variants={badgeAnimation}
    >
      {children}
    </motion.span>
  );
};

export default Badge;
