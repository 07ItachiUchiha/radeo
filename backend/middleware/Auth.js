import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Authentication middleware that verifies user tokens
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required. Please log in.",
        code: "AUTH_REQUIRED"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token format", 
        code: "INVALID_TOKEN_FORMAT" 
      });
    }

    // Verify user exists
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found", 
        code: "USER_NOT_FOUND" 
      });
    }

    // Set userId in the request body if not already set
    if (!req.body.userId) {
      req.body.userId = decoded.id;
    }
    
    // Set userId in request for future middleware or route handlers
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token", 
        code: "INVALID_TOKEN" 
      });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        message: "Token expired", 
        code: "TOKEN_EXPIRED" 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      code: "SERVER_ERROR" 
    });
  }
};

export default authUser;
