import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//route for user register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    //check user already exists
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.json({ success: false, message: "User already Registered" });
    }

    //validating email and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be 8char+ " });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      name,
      email,
      password: hashPassword,
    });

    const user = await newUser.save();

    //create token
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//route for user login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//route for admin login
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // First try to find the admin user
    const admin = await userModel.findOne({ email, role: "admin" });

    if (admin) {
      // Check password
      const isMatch = await bcrypt.compare(password, admin.password);

      if (isMatch) {
        const token = createToken(admin._id);
        return res.json({ success: true, token });
      }
    }

    // Fallback to environment variable check (for backward compatibility)
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    }

    // If no valid credentials
    res.json({ success: false, message: "Invalid admin credentials" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//route for creating an admin user
const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ email, role: "admin" });
    if (existingAdmin) {
      return res.json({ success: false, message: "Admin already exists with this email" });
    }

    // Validating email and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be 8 characters or more" });
    }

    // Hashing admin password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const newAdmin = await userModel.create({
      name,
      email,
      password: hashPassword,
      role: "admin", // Set role as admin
    });

    const admin = await newAdmin.save();

    //create token
    const token = createToken(admin._id);
    res.json({ success: true, token, message: "Admin created successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//get user details
const getUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Check if user is authorized to get this information
    if (req.userId !== userId) {
      return res.json({ 
        success: false, 
        message: "You are not authorized to access this information" 
      });
    }

    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Return only safe user information (no password)
    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        // Add other fields as needed, but exclude sensitive information
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, adminLogin, createAdmin, getUserDetails };
