// Product page that shows detailed product information
// Supports 3D product view, image gallery, size selection
// Add to cart and buy now functionality
// Related products suggestion

import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ProductItem3D from "../components/ProductItem3D";
import { AnimatePresence, motion as Motion } from "framer-motion";
import FadeIn from "../components/animations/FadeIn";
import ScaleIn from "../components/animations/ScaleIn";
import ProductViewer3D from "../components/3d/ProductViewer3D";

const Product = () => {
  const { productId } = useParams();
  const {
    products,
    currency,
    addToCart,
    getImageUrl,
    requireAuth,
    navigate,
  } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [show3DView, setShow3DView] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Reset state when product changes
    setSizeError(false);
    setSelectedSize("");
    setShow3DView(false);

    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Find product in the existing products array
        const foundProduct = products.find((item) => item._id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
          setCurrentImage(
            foundProduct.images && foundProduct.images.length > 0
              ? getImageUrl(foundProduct.images[0])
              : getImageUrl(foundProduct.image)
          );

          // Set related products based on same category
          const related = products
            .filter(
              (item) =>
                item.category === foundProduct.category &&
                item._id !== foundProduct._id
            )
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, products, getImageUrl]);
  
  const handleImageChange = (image) => {
    setCurrentImage(getImageUrl(image));
    setShow3DView(false);
  };

  const handleToggle3DView = () => {
    setShow3DView(!show3DView);
  };

  const checkSize = () => {
    if (!selectedSize) {
      setSizeError(true);
      return false;
    }
    setSizeError(false);
    return true;
  };

  const handleAddToCart = () => {
    if (checkSize()) {
      addToCart(productId, selectedSize);
      navigate("/cart");
    }
  };

  const handleBuyNow = () => {
    if (checkSize() && requireAuth()) {
      addToCart(productId, selectedSize);
      navigate("/place-order");
    }
  };

  // Animation variants
  const imagePreviewVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <main className="min-h-screen py-10">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : !product ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-medium text-gray-800">Product not found</h2>
          <p className="mt-4 text-gray-600">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/collection")}
            className="mt-6 bg-black text-white px-6 py-2 rounded"
          >
            Browse Collection
          </Motion.button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-10">
          {/* Product Images */}
          <div className="flex-1">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-2 mt-4 md:mt-0">
                {product.images &&
                  product.images.length > 0 &&
                  product.images.map((image, index) => (
                    <Motion.div
                      key={index}
                      className={`w-16 h-16 border cursor-pointer ${
                        currentImage === getImageUrl(image)
                          ? "border-black"
                          : "border-gray-200"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleImageChange(image)}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </Motion.div>
                  ))}
                <Motion.div
                  className={`w-16 h-16 flex items-center justify-center border cursor-pointer ${
                    show3DView ? "border-black bg-black text-white" : "border-gray-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggle3DView}
                  >
                    <span className="text-xs font-bold">3D</span>
                </Motion.div>
              </div>

              {/* Main Image or 3D Viewer */}
              <AnimatePresence mode="wait">
                <Motion.div
                  key={show3DView ? "3d" : "image"}
                  className="w-full h-[400px] md:h-[500px] flex items-center justify-center"
                  variants={imagePreviewVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {show3DView ? (
                    <ProductViewer3D
                      modelUrl={`/models/clothing_${Math.floor(Math.random() * 3) + 1}.glb`}
                      fallbackImage={currentImage}
                      height="100%"
                    />
                  ) : (
                    <img
                      src={currentImage}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </Motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <FadeIn>
              <h1 className="text-2xl md:text-3xl font-medium text-gray-800">
                {product.name}
              </h1>
              <p className="text-lg md:text-xl font-medium text-gray-700 mt-2">
                {product.price}
                {currency}
              </p>
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700">SELECT SIZE</h3>
                <div className="flex flex-wrap gap-3 mt-2">
                  {product.sizes &&
                    product.sizes.map((size) => (
                      <Motion.div
                        key={size}
                        className={`h-8 w-8 border flex items-center justify-center cursor-pointer ${
                          selectedSize === size
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-gray-700"
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Motion.div>
                    ))}
                </div>
                {sizeError && (
                  <Motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    Please select a size
                  </Motion.p>
                )}
              </div>

              <div className="mt-8 space-y-4">
                <Motion.button
                  className="w-full py-3 border border-black bg-black text-white font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                >
                  ADD TO CART
                </Motion.button>
                <Motion.button
                  className="w-full py-3 border border-black hover:bg-gray-100 font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                >
                  BUY NOW
                </Motion.button>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  PRODUCT DETAILS
                </h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            </FadeIn>

            {product.details && product.details.length > 0 && (
              <FadeIn delay={0.3}>
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    SPECIFICATIONS
                  </h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {product.details.map((detail, index) => (
                      <Motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        {detail}
                      </Motion.li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      )}

      {/* Related Products */}
      {!loading && product && relatedProducts.length > 0 && (
        <ScaleIn delay={0.2}>
          <div className="mt-16">
            <h2 className="text-xl font-medium mb-6">You might also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {relatedProducts.map((item) => (
                <ProductItem3D
                  key={item._id}
                  _id={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  images={item.images}
                  currency={currency}
                />
              ))}
            </div>
          </div>
        </ScaleIn>
      )}
    </main>
  );
};

export default Product;