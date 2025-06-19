import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({success: false, message: "Not Authorized"});
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check for database-based admin user
    if (decoded.id) {
      const admin = await userModel.findOne({ _id: decoded.id, role: "admin" });
      if (admin) {
        // Store admin info in request
        req.admin = admin;
        return next();
      }
    }

    // Fallback to old environment variable based check
    if (decoded === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return next();
    }
    
    return res.json({success: false, message: "Invalid Credentials"});
  } catch (error) {
    res.json({success: false, message: error.message});
  }
};

export default adminAuth;
