import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import * as jwt_decode from "jwt-decode";

const Profile = () => {
  const { backendUrl, currency, token } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
  });
  const [activeTab, setActiveTab] = useState("orders");

  const statusColors = {
    "Order Placed": "text-blue-600 bg-blue-50",
    "Processing": "text-purple-600 bg-purple-50",
    "Packed": "text-orange-600 bg-orange-50",
    "Shipped": "text-indigo-600 bg-indigo-50",
    "Out for delivery": "text-yellow-600 bg-yellow-50",
    "Delivered": "text-green-600 bg-green-50",
    "Cancelled": "text-red-600 bg-red-50"
  };

  const statusDescriptions = {
    "Order Placed": "We've received your order and are processing it",
    "Processing": "Your order is being processed",
    "Packed": "Your items have been packed and are ready for shipping",
    "Shipped": "Your order is on the way",
    "Out for delivery": "Your order is out for delivery today",
    "Delivered": "Your order has been delivered successfully",
    "Cancelled": "This order was cancelled"
  };

  const getUserInfo = () => {
    try {
      if (token) {
        const decoded = jwt_decode.jwtDecode(token);
        const userId = decoded.id;
        
        // Fetch user details
        axios.post(
          `${backendUrl}/api/user/details`,
          { userId },
          { headers: { token } }
        ).then(response => {
          if (response.data.success) {
            setUserInfo(response.data.user);
          }
        }).catch(error => {
          console.error("Error fetching user details:", error);
        });
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      
      if (res.data.success) {
        // Group orders by orderId
        const groupedOrders = res.data.orders.reduce((acc, order) => {
          acc.push({
            id: order._id,
            date: order.date,
            status: order.status,
            items: order.items,
            amount: order.amount,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            address: order.address
          });
          return acc;
        }, []);
        
        // Sort by date (most recent first)
        groupedOrders.sort((a, b) => b.date - a.date);
        setOrders(groupedOrders);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
    fetchOrders();
  }, [token]);

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <main className="border-t pt-8 min-h-[80vh]">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Title text1={"MY"} text2={"PROFILE"} />
        </div>

        {/* User Info Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="bg-gray-100 rounded-full p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold">{userInfo.name || "User"}</h3>
              <p className="text-gray-600">{userInfo.email || ""}</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6 border-b">
          <div className="flex flex-wrap -mb-px">
            <button
              onClick={() => setActiveTab("orders")}
              className={`inline-block p-4 ${
                activeTab === "orders"
                  ? "border-b-2 border-black font-medium"
                  : "hover:border-b-2 hover:border-gray-300"
              }`}
            >
              My Orders
            </button>
            <button
              onClick={() => setActiveTab("tracking")}
              className={`inline-block p-4 ${
                activeTab === "tracking"
                  ? "border-b-2 border-black font-medium"
                  : "hover:border-b-2 hover:border-gray-300"
              }`}
            >
              Track Order
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`inline-block p-4 ${
                activeTab === "settings"
                  ? "border-b-2 border-black font-medium"
                  : "hover:border-b-2 hover:border-gray-300"
              }`}
            >
              Account Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "orders" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">My Orders</h3>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-600">You haven't placed any orders yet</h3>
                <p className="mt-2 text-gray-500">Browse our collection and place your first order</p>
                <Link to="/collection" className="mt-4 inline-block px-6 py-2 bg-black text-white hover:bg-gray-800">
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row justify-between gap-2">
                      <div>
                        <span className="text-xs text-gray-500">ORDER PLACED</span>
                        <p className="font-medium">{formatDate(order.date)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">ORDER ID</span>
                        <p className="font-medium">{order.id.slice(-8)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">TOTAL</span>
                        <p className="font-medium">{order.amount} {currency}</p>
                      </div>
                      <div>
                        <Link 
                          to={`#tracking-${order.id}`} 
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("tracking");
                          }}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Track Order
                        </Link>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <span className={`text-sm px-2 py-1 rounded ${statusColors[order.status] || 'bg-gray-100'}`}>
                          {order.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {order.payment ? "(Paid)" : "(Payment Pending)"} • {order.paymentMethod}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Items in this order</h4>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span>{item.name} - {item.size} ({item.quantity})</span>
                                <span className="font-medium">{item.price * item.quantity} {currency}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Shipping Address</h4>
                          <p className="text-sm">{order.address.firstName} {order.address.lastName}</p>
                          <p className="text-sm">{order.address.street}</p>
                          <p className="text-sm">{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                          <p className="text-sm">{order.address.country}</p>
                          <p className="text-sm mt-1">Phone: {order.address.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "tracking" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Track Your Order</h3>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">You don't have any orders to track</p>
              </div>
            ) : (
              <div className="space-y-8">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID: <span className="font-medium text-black">{order.id.slice(-8)}</span></p>
                        <p className="text-sm text-gray-500">Placed on: <span className="font-medium text-black">{formatDate(order.date)}</span></p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6">{statusDescriptions[order.status]}</p>
                    
                    <div className="relative">
                      {/* Progress bar */}
                      <div className="h-1 bg-gray-200 w-full absolute top-5"></div>
                      
                      {/* Track order steps */}
                      <div className="flex justify-between relative">
                        {/* Order Placed */}
                        <div className={`flex flex-col items-center`}>
                          <div className={`w-10 h-10 rounded-full z-10 flex items-center justify-center ${
                            ["Order Placed", "Processing", "Packed", "Shipped", "Out for delivery", "Delivered"].includes(order.status) 
                              ? "bg-green-500 text-white" 
                              : "bg-gray-300"
                          }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-xs mt-2 text-center">Order Placed</span>
                        </div>
                        
                        {/* Processing */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full z-10 flex items-center justify-center ${
                            ["Processing", "Packed", "Shipped", "Out for delivery", "Delivered"].includes(order.status) 
                              ? "bg-green-500 text-white" 
                              : "bg-gray-300"
                          }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <span className="text-xs mt-2 text-center">Processing</span>
                        </div>
                        
                        {/* Shipped */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full z-10 flex items-center justify-center ${
                            ["Packed", "Shipped", "Out for delivery", "Delivered"].includes(order.status) 
                              ? "bg-green-500 text-white" 
                              : "bg-gray-300"
                          }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                          </div>
                          <span className="text-xs mt-2 text-center">Packed</span>
                        </div>
                        
                        {/* Out for Delivery */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full z-10 flex items-center justify-center ${
                            ["Shipped", "Out for delivery", "Delivered"].includes(order.status) 
                              ? "bg-green-500 text-white" 
                              : "bg-gray-300"
                          }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                          </div>
                          <span className="text-xs mt-2 text-center">Shipped</span>
                        </div>
                        
                        {/* Delivered */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full z-10 flex items-center justify-center ${
                            ["Out for delivery", "Delivered"].includes(order.status) 
                              ? "bg-green-500 text-white" 
                              : "bg-gray-300"
                          }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span className="text-xs mt-2 text-center">Out for delivery</span>
                        </div>
                        
                        {/* Delivered */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full z-10 flex items-center justify-center ${
                            ["Delivered"].includes(order.status) 
                              ? "bg-green-500 text-white" 
                              : "bg-gray-300"
                          }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-xs mt-2 text-center">Delivered</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h4 className="font-medium text-sm mb-2">Order Summary</h4>
                      <div className="flex justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">{order.items.length} Item{order.items.length !== 1 ? 's' : ''}</span>
                          <span className="text-sm text-gray-500 mt-1">Payment: {order.payment ? "Completed" : "Pending"}</span>
                        </div>
                        <Link to="/orders" className="text-blue-600 text-sm hover:underline">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === "settings" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-500">Account settings will be available soon...</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Profile;
