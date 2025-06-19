import React from "react";
import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  out: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

const PageTransition = ({ children }) => {
  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== "undefined" ? 
    window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;

  if (prefersReducedMotion) {
    return <div>{children}</div>;
  }
  
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
