import mongoose from "mongoose";

const poolSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  totalRequiredQuantity: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  joinedVendors: [
    {
      vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      }
    }
  ],
  isClosed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export const Pool = mongoose.models.Pool || mongoose.model("Pool", poolSchema);
