import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import FadeIn from "../components/animations/FadeIn";
import { handleImageError, getProductFallbackImage } from "../utils/imageFallbacks";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, getImageUrl, requireAuth } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();
   
  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  // Helper function to get product image
  const getProductImage = (product) => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return getImageUrl(product.images[0]);
    } else if (product.image) {
      if (Array.isArray(product.image) && product.image.length > 0) {
        return getImageUrl(product.image[0]);
      } else if (typeof product.image === 'string') {
        return getImageUrl(product.image);
      }
    }
    return getProductFallbackImage();
  };

  const handleCheckout = () => {
    // Check if user is authenticated before proceeding to checkout
    if (requireAuth()) {
      navigate("/place-order");
    }
  };

  // Animation variants
  const cartItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0, 
      x: -50,
      transition: { duration: 0.3 }
    }
  };

  return (
    <main className='border-t pt-14'>
      <FadeIn>
        <div className='text-2xl mb-3'>
          <Title text={"YOUR"} text2={"CART"} />
        </div>
      </FadeIn>

      <AnimatePresence>
        {cartData.map((item) => {
          const productData = products.find(
            (product) => product._id === item._id
          );

          if (!productData) return null;

          return (
            <Motion.div
              key={`${item._id}-${item.size}`}
              className='py-2 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
              variants={cartItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <div className='flex items-start gap-6'>
                <Motion.img
                  className='w-16 sm:w-20 h-20 object-cover'
                  src={getProductImage(productData)}
                  alt={productData.name}
                  onError={(e) => handleImageError(e)}
                  whileHover={{ scale: 1.05 }}
                />
                <div>
                  <Motion.p 
                    className='text-sm sm:text-lg font-medium'
                    whileHover={{ x: 3 }}
                  >
                    {productData.name}
                  </Motion.p>

                  <div className='flex items-center gap-5 mt-2'>
                    <p>
                      {productData.price}
                      {currency}
                    </p>
                    <p> Size: {item.size}</p>
                  </div>
                </div>
              </div>

              <div className='flex justify-center'>
                <Motion.div 
                  className='flex border items-center'
                  whileHover={{ boxShadow: "0 0 5px rgba(0,0,0,0.2)" }}
                >
                  <Motion.button
                    className='w-8 h-8'
                    onClick={() =>
                      updateQuantity(item._id, item.size, item.quantity - 1)
                    }
                    whileTap={{ scale: 0.9 }}
                  >
                    -
                  </Motion.button>
                  <input
                    className='w-10 text-center outline-none'
                    type='number'
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item._id, item.size, parseInt(e.target.value))
                    }
                  />
                  <Motion.button
                    className='w-8 h-8'
                    onClick={() =>
                      updateQuantity(item._id, item.size, item.quantity + 1)
                    }
                    whileTap={{ scale: 0.9 }}
                  >
                    +
                  </Motion.button>
                </Motion.div>
              </div>

              <div className='flex justify-end font-medium pr-4'>
                {productData.price * item.quantity}
                {currency}
              </div>
            </Motion.div>
          );
        })}
      </AnimatePresence>

      {cartData.length === 0 && (
        <FadeIn>
          <div className="text-center py-20">
            <Motion.p 
              className="text-lg text-gray-600 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Your cart is empty
            </Motion.p>
            <Motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/collection')}
              className="bg-black text-white px-6 py-2 rounded"
            >
              Start Shopping
            </Motion.button>
          </div>
        </FadeIn>
      )}

      {cartData.length > 0 && (
        <FadeIn delay={0.2}>
          <CartTotal />
          <div className='flex justify-end'>
            <Motion.button
              onClick={handleCheckout}
              className='mt-4 bg-black text-white px-6 py-3 uppercase'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Checkout
            </Motion.button>
          </div>
        </FadeIn>
      )}
    </main>
  );
};

export default Cart;
