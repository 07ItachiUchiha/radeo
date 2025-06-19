import { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { handleImageError, getProductFallbackImage } from "../utils/imageFallbacks";

const ProductItem = ({ _id, image, images, name, price }) => {
  const { currency, getImageUrl } = useContext(ShopContext);
  
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
      <div className='overflow-hidden'>
        <img 
          className='hover:scale-110 transition ease-in-out w-full h-64 object-cover'
          src={getDisplayImage()}
          alt={name}
          onError={(e) => handleImageError(e)}
        />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{price} {currency}</p>
    </Link>
  );
};

export default ProductItem;
