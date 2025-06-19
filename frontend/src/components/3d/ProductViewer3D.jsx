import React from "react";
import { getProductFallbackImage } from "../../utils/imageFallbacks";

// Fallback component for low-spec devices or if 3D fails to load
export const FallbackImage = ({ image, height = "400px" }) => {
  return (
    <div 
      className="rounded-md overflow-hidden bg-gray-100 w-full flex items-center justify-center"
      style={{ height }}
    >
      <img 
        src={image} 
        alt="Product" 
        className="object-contain max-h-full max-w-full"
      />
    </div>
  );
};

// Main component that will now always use the fallback image
// until we install the required 3D libraries
const ProductViewer3D = ({
  // These props are kept for future implementation
  // eslint-disable-next-line no-unused-vars
  modelPath,
  // eslint-disable-next-line no-unused-vars
  rotation = [0, 0, 0],
  // eslint-disable-next-line no-unused-vars
  position = [0, 0, 0],
  // eslint-disable-next-line no-unused-vars
  scale = 1,
  fallbackImage = getProductFallbackImage(),
  height = "400px"
}) => {
  // Always use the fallback image until we have the required dependencies
  return <FallbackImage image={fallbackImage} height={height} />;
};

export default ProductViewer3D;
