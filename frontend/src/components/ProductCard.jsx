import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Badge from "./ui/Badge";
import { handleImageError, getProductFallbackImage } from "../utils/imageFallbacks";

const ProductCard = ({ 
  product, 
  currency = "₹",
  getImageUrl,
  addToCart
}) => {
  const { _id, name, price, images, image, bestseller, category } = product;
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);
  
  // Get the image URL
  const imageSource = () => {
    if (images && images.length > 0) {
      return getImageUrl(images[0]);
    } else if (image) {
      if (Array.isArray(image) && image.length > 0) {
        return getImageUrl(image[0]);
      } else if (typeof image === 'string') {
        return getImageUrl(image);
      }
    }
    return getProductFallbackImage();
  };

  // Add to cart handler
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedSize && addToCart) {
      addToCart(_id, selectedSize);
    }
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      y: -10,
      transition: { type: "spring", stiffness: 300 },
    }
  };

  // Image animation variants
  const imageVariants = {
    hover: { 
      scale: 1.1,
      transition: { type: "spring", stiffness: 300 },
    }
  };

  return (
    <Link to={`/product/${_id}`}>
      <motion.div 
        className="relative overflow-hidden rounded-lg shadow-sm bg-white"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="overflow-hidden aspect-square">
          <motion.img
            src={imageSource()}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => handleImageError(e)}
            variants={imageVariants}
            whileHover="hover"
          />
        </div>
        
        {/* Badges */}
        {bestseller && (
          <div className="absolute top-2 left-2">
            <Badge variant="warning">Best Seller</Badge>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <Badge variant="neutral">{category}</Badge>
        </div>
        
        {/* Product Info */}
        <div className="p-3">
          <h3 className="font-medium text-gray-800 truncate">{name}</h3>
          <div className="flex justify-between items-center mt-1">
            <p className="font-semibold">{price}{currency}</p>
            
            {/* Quick Size Selector */}
            {isHovered && product.sizes && product.sizes.length > 0 && (
              <div className="flex gap-1">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size}
                    className={`h-6 w-6 text-xs flex items-center justify-center rounded-full ${
                      selectedSize === size 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Add to Cart Button */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-10 bg-black flex items-center justify-center text-white"
          initial={{ opacity: 0, y: '100%' }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            y: isHovered ? 0 : '100%'
          }}
          transition={{ duration: 0.2 }}
          onClick={handleAddToCart}
        >
          <span>Add to Cart</span>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
