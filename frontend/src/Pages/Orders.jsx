import React, { useState, useEffect, useContext } from "react";
import Title from "../components/Title";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { AnimatePresence, motion } from "framer-motion";
import FadeIn from "../components/animations/FadeIn";
import { handleImageError, getThumbnailFallbackImage } from "../utils/imageFallbacks";
import { COLORS } from "../utils/animationUtils";

const Orders = () => {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});
  const { getImageUrl, token, backendUrl } = useContext(ShopContext);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const orderRes = await axios.post(
          backendUrl + "/api/order/user",
          { userId: "user" },
          { headers: { token } }
        );

        if (orderRes.data.success) {
          // Sort orders by date (newest first)
          const sortedOrders = orderRes.data.orders.sort((a, b) => b.date - a.date);
          setOrderData(sortedOrders);
        }
      } catch (error) {
        console.log("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, backendUrl]);

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getOrderTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Helper function to get product image
  const getProductImage = (item) => {
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      return getImageUrl(item.images[0]);
    } else if (item.image) {
      if (Array.isArray(item.image) && item.image.length > 0) {
        return getImageUrl(item.image[0]);
      } else if (typeof item.image === 'string') {
        return getImageUrl(item.image);
      }
    }
    return getThumbnailFallbackImage();
  };

  // Status color mapping for visual clarity
  const statusColors = {
    "Order Placed": "bg-blue-100 text-blue-800",
    "Processing": "bg-purple-100 text-purple-800",
    "Packed": "bg-orange-100 text-orange-800",
    "Shipped": "bg-indigo-100 text-indigo-800",
    "Out for delivery": "bg-yellow-100 text-yellow-800",
    "Delivered": "bg-green-100 text-green-800",
    "Cancelled": "bg-red-100 text-red-800"
  };

  // Animation variants
  const orderItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };
  
  const detailsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.2 }
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  return (
    <main className='border-t pt-8'>
      <FadeIn>
        <div className='text-2xl mb-6'>
          <Title text1={"MY"} text2={"ORDERS"} />
        </div>
      </FadeIn>

      {loading ? (
        <div className="flex justify-center py-10">
          <motion.div 
            className="h-10 w-10 border-t-2 border-b-2 border-black rounded-full" 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : orderData.length === 0 ? (
        <FadeIn delay={0.1}>
          <div className="text-center py-20">
            <motion.p 
              className="text-lg text-gray-600 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              You haven't placed any orders yet
            </motion.p>
            <motion.button
              onClick={() => window.location.href = '/collection'}
              className="bg-black text-white px-6 py-2.5 rounded hover:bg-gray-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Start Shopping
            </motion.button>
          </div>
        </FadeIn>
      ) : (
        <div className="space-y-6">
          {orderData.map((order, orderIndex) => (
            <motion.div 
              key={orderIndex} 
              className="border rounded-lg overflow-hidden shadow-sm"
              variants={orderItemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: orderIndex * 0.1 }}
            >
              <motion.div 
                className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
                onClick={() => toggleOrderDetails(order._id)}
                whileHover={{ backgroundColor: COLORS.gray[100] }}
              >
                <div>
                  <p className="text-sm text-gray-500">Order placed</p>
                  <p className="font-medium">{formatDate(order.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">ORDER ID</p>
                  <p className="font-medium">{order._id.slice(-8)}</p>
                </div>
                <div>
                  <span className={`text-sm px-3 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100"}`}>
                    {order.status}
                  </span>
                </div>
                <motion.div 
                  animate={{ rotate: expandedOrders[order._id] ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </motion.div>
              
              <AnimatePresence>
                {expandedOrders[order._id] && (
                  <motion.div
                    variants={detailsVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="mb-4">
                        <h3 className="font-medium text-lg">Delivery Address</h3>
                        <p className="text-gray-600">
                          {order.address.firstName} {order.address.lastName},<br />
                          {order.address.street},<br />
                          {order.address.city}, {order.address.state} {order.address.zipcode},<br />
                          {order.address.country}<br />
                          Phone: {order.address.phone}
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="font-medium text-lg">Payment</h3>
                        <p className="text-gray-600">
                          Method: {order.paymentMethod}<br />
                          Status: {order.payment ? "Paid" : "Pending"}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg mb-2">Order Items</h3>
                        <div className="divide-y">
                          {order.items.map((item, itemIndex) => (
                            <motion.div 
                              key={itemIndex}
                              className="py-3 flex items-center gap-4"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + (itemIndex * 0.05) }}
                            >
                              <img 
                                src={getProductImage(item)} 
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded" 
                                onError={(e) => handleImageError(e, 'thumbnail')}
                              />
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <div className="text-sm text-gray-500 flex gap-4">
                                  <p>Size: {item.size}</p>
                                  <p>Qty: {item.quantity}</p>
                                  <p>₹{item.price}</p>
                                </div>
                              </div>
                              <div className="font-medium">
                                ₹{item.price * item.quantity}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="border-t mt-4 pt-4">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>₹{getOrderTotal(order.items)}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-2">
                            <span>Shipping:</span>
                            <span>₹49</span>
                          </div>
                          <div className="flex justify-between font-medium mt-2">
                            <span>Total:</span>
                            <span>₹{order.amount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Orders;
