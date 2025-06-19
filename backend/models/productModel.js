import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: {
      type: [String], // Changed from image to images array
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    details: {
      type: Array,
      default: [],
    },
    sizes: {
      type: Array,
      default: [],
    },
    bestseller: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const productModel = mongoose.models.products || mongoose.model("products", productSchema);

export default productModel;
