import React, { useState, useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { handleImageError, getProductFallbackImage } from "../utils/imageFallbacks";
import { ShopContext } from "../context/ShopContext";

const ProductItem3D = ({ _id, image, images, name, price }) => {
  const { currency, getImageUrl } = useContext(ShopContext);
  const [isHovered, setIsHovered] = useState(false);

  // Get the correct image source based on the available data
  const getDisplayImage = () => {
    // If images array exists and has content, use the first image
    if (images && Array.isArray(images) && images.length > 0) {
      return getImageUrl(images[0]);
    }
    // If using older format with image property
    else if (image) {
      if (Array.isArray(image) && image.length > 0) {
        return getImageUrl(image[0]);
      } else if (typeof image === 'string') {
        return getImageUrl(image);
      }
    }
    // Return fallback image
    return getProductFallbackImage();
  };

  return (
    <Link onClick={() => scrollTo(0,0)} to={`/product/${_id}`} className='text-gray-700 cursor-pointer'>
      <motion.div 
        className="relative overflow-hidden rounded-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ 
          y: -10, 
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="overflow-hidden aspect-square">
          <motion.img
            src={getDisplayImage()}
            alt={name}
            onError={(e) => handleImageError(e)}
            className="w-full h-full object-cover"
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              rotateY: isHovered ? 5 : 0,
              rotateX: isHovered ? -5 : 0,
            }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ transformStyle: "preserve-3d" }}
          />
        </div>
        
        <motion.div 
          className="p-3 bg-white"
          animate={{ 
            y: isHovered ? -5 : 0,
            opacity: isHovered ? 1 : 0.9
          }}
        >
          <motion.h3 
            className="font-medium text-gray-800 truncate"
            animate={{ 
              color: isHovered ? "#000000" : "#374151"
            }}
          >
            {name}
          </motion.h3>
          <p className="text-gray-600 mt-1">{price}{currency}</p>
          
          <motion.div 
            className="mt-2 w-full h-8 bg-black text-white flex items-center justify-center text-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              height: isHovered ? 32 : 0 
            }}
          >
            View Details
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default ProductItem3D;
