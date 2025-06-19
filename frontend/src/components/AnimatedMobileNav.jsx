import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: {
    opacity: 0,
    y: "-100%",
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: "-100%",
    transition: {
      duration: 0.3,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.2 }
  }
};

const AnimatedMobileNav = ({ isOpen, setIsOpen, navItems }) => {
  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== "undefined" ? 
    window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  
  const variants = prefersReducedMotion ? {} : containerVariants;
  const itemVariation = prefersReducedMotion ? {} : itemVariants;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-nav"
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 bg-white flex flex-col p-5"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">ShopEase</h2>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(false)}
              className="p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          <nav className="flex-1">
            <ul className="space-y-4">
              {navItems.map((item, index) => (
                <motion.li key={index} variants={itemVariation}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-lg font-medium border-b border-gray-100"
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedMobileNav;
