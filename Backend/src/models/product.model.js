import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  pricePerKg: {
    required: true,
    type: Number,
  },
  minOrderQuantity: {
    required: true,
    type: Number,
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
