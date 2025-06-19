import express from "express";
import { loginUser, registerUser, adminLogin, createAdmin, getUserDetails } from "../controllers/userController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/Auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/create-admin", createAdmin);
userRouter.post("/details", authUser, getUserDetails);
// Add a simple route to verify token validity
userRouter.get("/verify", authUser, (req, res) => {
  res.json({ success: true, message: "Token is valid" });
});

export default userRouter;