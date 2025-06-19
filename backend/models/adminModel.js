import mongoose from "mongoose";
import validator from "validator";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

// Validate email format before saving
adminSchema.pre('save', function(next) {
  if (!validator.isEmail(this.email)) {
    throw new Error('Invalid email format');
  }
  next();
});

const adminModel = mongoose.model("Admin", adminSchema);

export default adminModel;
