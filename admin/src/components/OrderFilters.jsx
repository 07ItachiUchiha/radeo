import React from 'react';

const OrderFilters = ({ 
  filterStatus, 
  setFilterStatus, 
  filterPayment, 
  setFilterPayment,
  applyFilters,
  clearFilters,
  statusOptions
}) => {
  return (
    <div className="bg-white p-4 rounded-md shadow mb-6 flex flex-wrap gap-4 items-end">
      <div className="min-w-[180px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">All Statuses</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      
      <div className="min-w-[180px]">
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
        <select 
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">All Methods</option>
          <option value="COD">Cash on Delivery</option>
          <option value="stripe">Stripe</option>
        </select>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={applyFilters}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Apply Filters
        </button>
        <button 
          onClick={clearFilters}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default OrderFilters;
