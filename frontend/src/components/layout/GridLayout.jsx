import React from 'react';
import { motion } from 'framer-motion';

const GridLayout = ({
  children,
  cols = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  gap = 'gap-4',
  className = '',
  staggerDelay = 0.05,
  fadeIn = true,
}) => {
  // Animation variants for the grid container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        when: 'beforeChildren',
      },
    },
  };

  // Animation variants for individual grid items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  // Check if the child is already a motion component
  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      if (!child) return null;
      
      // If fadeIn is false or the child is already a motion component, return the child as is
      if (!fadeIn || child.type === motion.div) {
        return child;
      }
      
      // Otherwise, wrap the child in a motion.div
      return (
        <motion.div variants={itemVariants} key={index}>
          {child}
        </motion.div>
      );
    });
  };

  return (
    <motion.div
      className={`grid ${cols} ${gap} ${className}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {renderChildren()}
    </motion.div>
  );
};

export default GridLayout;
