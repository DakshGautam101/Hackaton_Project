import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'Vegetables',
  },
  pricePerKg: {
    required: true,
    type: Number,
  },
  minOrderQuantity: {
    required: true,
    type: Number,
    default: 1,
  },
  availableQuantity: {
    type: Number,
    default: 0,
  },
  totalSold: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
