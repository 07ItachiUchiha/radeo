import React from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line
import { motion } from "framer-motion";
import { handleImageError } from "../utils/imageFallbacks";

const Hero = () => {
  // Animation variants
  const textVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.8,
        ease: "easeOut" 
      }
    }
  };

  const imageVariants = {
    initial: { opacity: 0, scale: 0.9, y: 30 },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0, 
      transition: { 
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: 0.4
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <section className="py-10 md:py-16 relative">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <motion.div 
          className="md:w-1/2 mb-8 md:mb-0"
          initial="initial"
          animate="animate"
          variants={textVariants}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span>Discover Your</span><br />
            <span className="text-gray-800">Perfect Style</span>
          </h1>
          
          <motion.p 
            className="text-lg text-gray-600 mb-6 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Explore our curated collections of premium clothing designed for comfort, style, and self-expression.
          </motion.p>
          
          <motion.div 
            className="flex gap-4"
            variants={buttonVariants}
            initial="initial"
            animate="animate"
          >
            <Link to="/collection">
              <motion.button 
                className="bg-black text-white px-6 py-3 rounded-md"
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                SHOP NOW
              </motion.button>
            </Link>
            
            <Link to="/about">
              <motion.button 
                className="border border-black px-6 py-3 rounded-md"
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                LEARN MORE
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="md:w-1/2"
          initial="initial"
          animate="animate"
          variants={imageVariants}
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02, rotate: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <img 
              src="/images/hero-image.jpg" 
              alt="Fashion Collection" 
              className="rounded-lg shadow-xl w-full"
              onError={(e) => handleImageError(e, 'hero', 'https://via.placeholder.com/800x600?text=Fashion+Collection')}
            />
            
            <motion.div 
              className="absolute -bottom-5 -left-5 bg-black text-white py-3 px-6 rounded-md"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-sm font-medium">NEW ARRIVALS</span>
              <p className="text-xs opacity-80">Summer Collection 2023</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating badges */}
      <motion.div 
        className="absolute top-1/4 right-10 bg-white p-2 rounded-full shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
      >
        <span className="block h-4 w-4 rounded-full bg-emerald-500"></span>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-1/4 left-10 bg-white p-2 rounded-full shadow-lg hidden md:block"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
      >
        <span className="block h-4 w-4 rounded-full bg-amber-500"></span>
      </motion.div>
    </section>
  );
};

export default Hero;
