import productModel from "../models/productModel.js";
import fs from 'fs';
import path from 'path';

// Add product with multiple images
const addProduct = async (req, res) => {
  try {
    const { name, price, category, subCategory, description, details, sizes, bestseller } = req.body;
    
    // Get the file paths for uploaded images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }
    
    // Create array of image paths
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    // Parse JSON strings if they come as strings
    const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes || [];
    const parsedDetails = typeof details === 'string' ? JSON.parse(details) : details || [];
    const isBestseller = bestseller === 'true' || bestseller === true;

    // Create a new product
    const product = await productModel.create({
      name,
      price: Number(price),
      images: imagePaths, // Store array of image paths
      category,
      subCategory: subCategory || category,
      description,
      details: parsedDetails,
      sizes: parsedSizes,
      bestseller: isBestseller,
    });

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single product by ID
const getProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, subCategory, description, details, sizes, bestseller } = req.body;
    
    // Find the product
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    
    // Process new images if uploaded
    let updatedImages = [...product.images]; // Start with existing images
    
    // If new files are uploaded, add them
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(file => `/uploads/${file.filename}`);
      updatedImages = [...updatedImages, ...newImagePaths];
    }
    
    // Remove images if specified in request
    const imagesToDelete = req.body.deleteImages ? 
      (typeof req.body.deleteImages === 'string' ? 
        [req.body.deleteImages] : JSON.parse(req.body.deleteImages)) : [];
    
    // Delete image files
    for (const imageToDelete of imagesToDelete) {
      if (updatedImages.includes(imageToDelete)) {
        // Remove from DB array
        updatedImages = updatedImages.filter(img => img !== imageToDelete);
        
        // Delete file from storage
        const imagePath = path.join(process.cwd(), imageToDelete.substring(1));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }
    
    // Ensure at least one image remains
    if (updatedImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product must have at least one image",
      });
    }
    
    // Parse fields
    const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes || product.sizes;
    const parsedDetails = typeof details === 'string' ? JSON.parse(details) : details || product.details;
    const isBestseller = bestseller === 'true' || bestseller === true;
    
    // Update the product
    const updatedProduct = await productModel.findByIdAndUpdate(
      id, 
      {
        name: name || product.name,
        price: Number(price || product.price),
        images: updatedImages,
        category: category || product.category,
        subCategory: subCategory || product.subCategory,
        description: description || product.description,
        details: parsedDetails,
        sizes: parsedSizes,
        bestseller: bestseller !== undefined ? isBestseller : product.bestseller
      },
      { new: true }
    );
    
    return res.status(200).json({
      success: true,
      product: updatedProduct,
      message: "Product updated successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a product and its images
const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete all image files
    if (product.images && Array.isArray(product.images)) {
      for (const imagePath of product.images) {
        if (imagePath.startsWith('/uploads/')) {
          const fullPath = path.join(process.cwd(), imagePath.substring(1));
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      }
    } 
    // Backward compatibility for old products with single image
    else if (product.image && typeof product.image === 'string') {
      if (product.image.startsWith('/uploads/')) {
        const imagePath = path.join(process.cwd(), product.image.substring(1));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    await productModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { addProduct, getProducts, getProduct, updateProduct, deleteProduct };
