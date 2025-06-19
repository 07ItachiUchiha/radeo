import express from "express";
import {
  allOrders,
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  updateStatus,
  userOrders,
  verifyStripePayment,
} from "../controllers/orderController.js";
import authUser from "../middleware/Auth.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

// Admin features
orderRouter.get("/admin/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Payment/order features - ensure authUser middleware is correctly applied
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// User features
orderRouter.post("/userorders", authUser, userOrders);

// Verify payment
orderRouter.post("/verifystripe", authUser, verifyStripePayment);

export default orderRouter;
