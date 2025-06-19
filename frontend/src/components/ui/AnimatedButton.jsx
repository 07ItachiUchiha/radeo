import React from "react";
import { motion } from "framer-motion";

const AnimatedButton = ({ 
  children, 
  onClick, 
  className = "", 
  type = "button",
  disabled = false,
  variant = "default", // default, outline, text
  size = "md", // sm, md, lg
  fullWidth = false,
  icon = null,
  iconPosition = "left",
}) => {
  // Base styles
  let baseStyle = "flex items-center justify-center transition-colors rounded-md font-medium";
  
  // Size styles
  const sizeStyles = {
    sm: "text-xs py-1.5 px-3",
    md: "text-sm py-2 px-4",
    lg: "text-base py-2.5 px-6"
  };
  
  // Variant styles
  const variantStyles = {
    default: "bg-black text-white hover:bg-gray-800",
    outline: "border border-black text-black hover:bg-black hover:text-white",
    text: "bg-transparent text-black hover:bg-gray-100"
  };
  
  // Determine final classes
  const buttonClasses = `
    ${baseStyle}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${fullWidth ? "w-full" : ""}
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${className}
  `;
  
  return (
    <motion.button
      type={type}
      onClick={disabled ? undefined : onClick}
      className={buttonClasses}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {icon && iconPosition === "left" && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="ml-2">{icon}</span>
      )}
    </motion.button>
  );
};

export default AnimatedButton;
