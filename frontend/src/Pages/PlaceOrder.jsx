// Checkout functionality:
// - Delivery information form
// - Payment method selection (COD or Stripe)
// - Order placement
// - Validation

import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import toast from "react-hot-toast";
import * as jwt_decode from "jwt-decode";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "../components/animations/FadeIn";
import AnimatedButton from "../components/ui/AnimatedButton";

const PlaceOrder = () => {
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, isAuthenticated } = useContext(ShopContext);
  const [method, setMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // Check authentication and if cart is empty when component mounts
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated()) {
      toast.error("Please log in to place an order");
      navigate("/login");
      return;
    }
    
    // Check if cart is empty
    let hasItems = false;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          hasItems = true;
          break;
        }
      }
      if (hasItems) break;
    }
    
    if (!hasItems) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [token, cartItems, navigate]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, street, city, state, zipcode, phone } = formData;

    if (!firstName || !lastName || !email || !street || !city || !state || !zipcode || !phone) {
      toast.error("Please fill in all required fields");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }

    return true;
  };

  const getUserId = () => {
    try {
      if (token) {
        const decoded = jwt_decode.jwtDecode(token);
        return decoded.id || null;
      }
      return null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Check if user is logged in
    if (!token) {
      toast.error("Please log in before placing an order");
      navigate("/login");
      return;
    }

    const userId = getUserId();
    if (!userId) {
      toast.error("User authentication failed. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find((product) => product._id === items));

            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Your cart is empty");
        setLoading(false);
        return;
      }

      let orderData = {
        userId: userId,
        items: orderItems,
        address: formData,
        amount: getCartAmount() + delivery_fee,
      };

      console.log("Submitting order data:", orderData);

      switch (method) {
        case "cod": {
          const res = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );

          if (res.data.success) {
            setCartItems({});
            toast.success("Order placed successfully!");
            navigate("/profile");
          } else {
            toast.error(res.data.message || "Failed to place order");
          }
          break;
        }

        case "stripe": {
          const stripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } }
          );
          if (stripe.data.success) {
            const { session_url } = stripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(stripe.data.message || "Payment processing failed");
          }
          break;
        }

        default:
          toast.error("Please select a payment method");
          break;
      }
    } catch (error) {
      console.log("Order placement error:", error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants for the form inputs
  const inputVariants = {
    focus: { scale: 1.02, borderColor: "#000000", boxShadow: "0 0 0 1px rgba(0,0,0,0.1)" },
    blur: { scale: 1, borderColor: "#e5e7eb", boxShadow: "none" }
  };

  return (
    <FadeIn>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
      >
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1={"DELIVERY"} text2={"INFORMATION"} />
          </div>

          <AnimatePresence>
            <div className="flex gap-3">
              <motion.input
                required
                onChange={onChangeHandler}
                name="firstName"
                value={formData.firstName}
                className="p-2 border flex-1"
                type="text"
                placeholder="First Name *"
                whileFocus="focus"
                initial="blur"
                animate="blur"
                exit="blur"
                variants={inputVariants}
              />
              <motion.input
                required
                onChange={onChangeHandler}
                name="lastName"
                value={formData.lastName}
                className="p-2 border flex-1"
                type="text"
                placeholder="Last Name *"
                whileFocus="focus"
                initial="blur"
                animate="blur"
                exit="blur"
                variants={inputVariants}
              />
            </div>

            <motion.input
              required
              onChange={onChangeHandler}
              name="email"
              value={formData.email}
              className="p-2 border"
              type="email"
              placeholder="Email *"
              whileFocus="focus"
              initial="blur"
              animate="blur"
              exit="blur"
              variants={inputVariants}
            />

            <motion.textarea
              required
              onChange={onChangeHandler}
              name="street"
              value={formData.street}
              className="p-2 border"
              placeholder="Street Address *"
              whileFocus="focus"
              initial="blur"
              animate="blur"
              exit="blur"
              variants={inputVariants}
            />

            <motion.input
              required
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
              className="p-2 border"
              type="text"
              placeholder="Town / City *"
              whileFocus="focus"
              initial="blur"
              animate="blur"
              exit="blur"
              variants={inputVariants}
            />

            <div className="flex gap-3">
              <motion.input
                required
                onChange={onChangeHandler}
                name="state"
                value={formData.state}
                className="p-2 border w-full sm:max-w-[150px]"
                type="text"
                placeholder="State *"
                whileFocus="focus"
                initial="blur"
                animate="blur"
                exit="blur"
                variants={inputVariants}
              />
              <motion.input
                required
                onChange={onChangeHandler}
                name="zipcode"
                value={formData.zipcode}
                className="p-2 border w-full sm:max-w-[150px]"
                type="text"
                placeholder="ZIP Code *"
                whileFocus="focus"
                initial="blur"
                animate="blur"
                exit="blur"
                variants={inputVariants}
              />
              <motion.input
                required
                onChange={onChangeHandler}
                name="country"
                value={formData.country}
                className="p-2 border w-full sm:max-w-[150px]"
                type="text"
                placeholder="Country *"
                whileFocus="focus"
                initial="blur"
                animate="blur"
                exit="blur"
                variants={inputVariants}
              />
            </div>

            <motion.input
              required
              onChange={onChangeHandler}
              name="phone"
              value={formData.phone}
              className="p-2 border"
              type="tel"
              placeholder="Phone *"
              whileFocus="focus"
              initial="blur"
              animate="blur"
              exit="blur"
              variants={inputVariants}
            />
          </AnimatePresence>
        </div>

        <div className="w-full sm:max-w-[380px]">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1={"YOUR"} text2={"ORDER"} />
          </div>
          <CartTotal />
          <div>
            <p className="font-medium my-4">SELECT PAYMENT METHOD</p>
            <div className="flex flex-col gap-3">
              <motion.div
                onClick={() => setMethod("cod")}
                className={`p-5 flex cursor-pointer border ${
                  method === "cod" ? "border-blue-500" : "border-black"
                }`}
                whileHover={{ scale: 1.01, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.99 }}
              >
                <input
                  onChange={() => setMethod("cod")}
                  type="radio"
                  checked={method === "cod"}
                />
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col ml-2">
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-xs">Pay with cash upon delivery</p>
                  </div>
                  <motion.img
                    className="h-10"
                    src={assets.cash_on_delivery}
                    alt="cod"
                    whileHover={{ rotate: 5 }}
                  />
                </div>
              </motion.div>
              <motion.div
                onClick={() => setMethod("stripe")}
                className={`p-5 flex cursor-pointer border ${
                  method === "stripe" ? "border-blue-500" : "border-black"
                }`}
                whileHover={{ scale: 1.01, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.99 }}
              >
                <input
                  onChange={() => setMethod("stripe")}
                  type="radio"
                  checked={method === "stripe"}
                />
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col ml-2">
                    <p className="font-semibold">Stripe</p>
                    <p className="text-xs">Pay with card via Stripe</p>
                  </div>
                  <motion.img 
                    className="h-5" 
                    src={assets.stripe} 
                    alt="stripe" 
                    whileHover={{ rotate: 5 }}
                  />
                </div>
              </motion.div>
            </div>
            
            <AnimatedButton
              type="submit"
              disabled={loading}
              fullWidth={true}
              size="lg"
              className="mt-6"
            >
              {loading ? "Processing..." : "Place Order"}
            </AnimatedButton>
          </div>
        </div>
      </form>
    </FadeIn>
  );
};

export default PlaceOrder;
