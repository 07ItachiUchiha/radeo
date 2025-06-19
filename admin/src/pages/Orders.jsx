import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import OrderFilters from "../components/OrderFilters";
import OrderDetails from "../components/OrderDetails";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasMore: false
  });
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});

  const statusOptions = [
    "Order Placed", 
    "Processing", 
    "Packed", 
    "Shipped", 
    "Out for delivery", 
    "Delivered",
    "Cancelled"
  ];

  const statusColors = {
    "Order Placed": "bg-blue-100 text-blue-800",
    "Processing": "bg-purple-100 text-purple-800",
    "Packed": "bg-orange-100 text-orange-800",
    "Shipped": "bg-indigo-100 text-indigo-800",
    "Out for delivery": "bg-yellow-100 text-yellow-800",
    "Delivered": "bg-green-100 text-green-800",
    "Cancelled": "bg-red-100 text-red-800"
  };

  const fetchAllOrders = async (page = 1) => {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      
      let url = `${backendUrl}/api/order/admin/list?page=${page}`;
      if (filterStatus) url += `&status=${filterStatus}`;
      if (filterPayment) url += `&paymentMethod=${filterPayment}`;
      
      const res = await axios.get(url, { headers: { token } });
      
      if (res.data.success) {
        setOrders(res.data.orders);
        setPagination(res.data.pagination);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (e, orderId) => {
    try {
      const newStatus = e.target.value;
      
      const res = await axios.post(
        backendUrl + "/api/order/status", 
        { orderId, status: newStatus }, 
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Order status updated");
        // Update the status locally without refetching all orders
        setOrders(prevOrders => prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        toast.error(res.data.message || "Failed to update status");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Error updating order status");
    }
  };
  
  const toggleOrderDetails = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };
  
  const applyFilters = () => {
    fetchAllOrders(1); // Reset to first page when filters change
  };
  
  const clearFilters = () => {
    setFilterStatus("");
    setFilterPayment("");
    fetchAllOrders(1);
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main className="px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <div className="flex gap-2">
          <span className="text-sm text-gray-500">
            Total: {pagination.totalOrders || 0} orders
          </span>
        </div>
      </div>
      
      {/* Filter section - using the OrderFilters component */}
      <OrderFilters 
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPayment={filterPayment}
        setFilterPayment={setFilterPayment}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        statusOptions={statusOptions}
      />

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-md">
          <p className="text-lg text-gray-500">No orders found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left">Order ID</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Payment</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">
                        <button 
                          onClick={() => toggleOrderDetails(order._id)}
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          <span className={expandedOrders[order._id] ? "transform rotate-90 inline-block mr-1" : "inline-block mr-1"}>▶</span>
                          {order._id.slice(-8)}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {order.address.firstName} {order.address.lastName}
                        <div className="text-xs text-gray-500">{order.address.email}</div>
                      </td>
                      <td className="py-3 px-4 text-sm">{formatDate(order.date)}</td>
                      <td className="py-3 px-4 text-sm font-medium">{order.amount} {currency}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${order.payment ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                          {order.paymentMethod} {order.payment ? "(Paid)" : "(Pending)"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatus(e, order._id)}
                          className="w-full p-1.5 text-sm border border-gray-300 rounded"
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    
                    {/* Expanded order details - using the OrderDetails component */}
                    {expandedOrders[order._id] && (
                      <tr>
                        <td colSpan="7" className="p-0">
                          <OrderDetails order={order} currency={currency} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => fetchAllOrders(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`px-4 py-2 rounded ${
                  pagination.currentPage === 1 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              
              <div className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              
              <button
                onClick={() => fetchAllOrders(pagination.currentPage + 1)}
                disabled={!pagination.hasMore}
                className={`px-4 py-2 rounded ${
                  !pagination.hasMore
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Orders;
