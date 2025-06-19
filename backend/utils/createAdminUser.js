import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";
import connectDB from "../config/mongodb.js";

// Load environment variables
dotenv.config();

// Create an admin user
const createAdmin = async () => {
  try {
    await connectDB();
    
    // Admin credentials
    const adminName = "Admin User";
    const adminEmail = "admin@shop.com";
    const adminPassword = "Hadies07@";  // You can change this
    
    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin already exists with this email!");
      await mongoose.connection.close();
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(adminPassword, salt);
    
    // Create admin
    const newAdmin = await userModel.create({
      name: adminName,
      email: adminEmail,
      password: hashPassword,
      role: "admin"
    });
    
    await newAdmin.save();
    console.log("Admin user created successfully!");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    
    // Close the MongoDB connection
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

// Run the function
createAdmin();
