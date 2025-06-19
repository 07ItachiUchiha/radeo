import React from 'react';

const OrderDetails = ({ order, currency }) => {
  return (
    <div className="bg-gray-50 p-4 border-t">
      <h4 className="font-medium mb-2">Order Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h5 className="font-medium text-sm mb-1">Items</h5>
          <ul className="text-sm space-y-2 bg-white p-2 rounded">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between items-center border-b pb-1 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span>{item.name}</span>
                  <span className="text-xs text-gray-500">
                    (Size: {item.size}, Qty: {item.quantity})
                  </span>
                </div>
                <span className="font-medium">{item.price * item.quantity} {currency}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-medium text-sm mb-1">Shipping Address</h5>
          <div className="text-sm bg-white p-2 rounded">
            <p>{order.address.firstName} {order.address.lastName}</p>
            <p>{order.address.street}</p>
            <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
            <p>{order.address.country}</p>
            <p className="mt-1">Phone: {order.address.phone}</p>
            <p>Email: {order.address.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
