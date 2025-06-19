import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


const VerifyPayment = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const handleVerifyPayment = async () => {
    try {
      if (!token) {
        return null;
      }

      const res = await axios.post(backendUrl + "/api/order/verifystripe",{ success, orderId },{ headers: { token } });

      if (res.data.success) {
        setCartItems({});
        navigate('/orders')
      }else{
        navigate('/cart')
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    handleVerifyPayment();
  }, [token]);

  if (success === "false") {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-5">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-semibold text-red-700 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6">
            Your payment was not successful. Your order has been cancelled.
          </p>
          <button
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
            onClick={() => navigate("/cart")}
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-5">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center max-w-md">
          <div className="text-green-600 text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-semibold text-green-700 mb-2">Payment Successful</h1>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully! Redirecting you to your orders...
          </p>
          <div className="w-8 h-8 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }
};

export default VerifyPayment;
