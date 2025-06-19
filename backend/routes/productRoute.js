import express from "express";
import { addProduct, getProducts, getProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from '../config/multer.js';

const productRouter = express.Router();

// Routes using multer for file uploads
productRouter.post("/add", adminAuth, upload.array('images', 5), addProduct); // Allow up to 5 images
productRouter.get("/list", getProducts);
productRouter.get("/:id", getProduct);
productRouter.put("/update/:id", adminAuth, upload.array('images', 5), updateProduct);
productRouter.delete("/:id", adminAuth, deleteProduct);

export default productRouter;
