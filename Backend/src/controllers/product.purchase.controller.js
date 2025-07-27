import { Product } from '../models/product.model.js';
import { User } from '../models/user.model.js';
import { Transaction } from '../models/transactions.model.js';

export const purchaseProduct = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }
    
    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check minimum order quantity
    if (quantity < product.minOrderQuantity) {
      return res.status(400).json({ 
        message: `Minimum order quantity is ${product.minOrderQuantity}kg` 
      });
    }
    
    // Calculate total cost
    const totalCost = product.pricePerKg * quantity;
    
    // Find user and check wallet balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if wallet has enough funds
    if ((user.wallet || 0) < totalCost) {
      return res.status(400).json({ 
        message: 'Insufficient wallet balance',
        required: totalCost,
        available: user.wallet || 0
      });
    }
    
    // Deduct funds from wallet
    user.wallet = (user.wallet || 0) - totalCost;
    await user.save();
    
    // Record transaction
    const transaction = await Transaction.create({
      userId,
      type: 'debit',
      amount: totalCost,
      reason: `Purchase: ${product.name} (${quantity}kg)`,
      paymentDetails: {
        productId,
        quantity,
        pricePerKg: product.pricePerKg
      }
    });
    
    // Return success response with updated balance and transaction details
    res.status(200).json({
      success: true,
      message: `Successfully purchased ${quantity}kg of ${product.name}`,
      transaction: {
        id: transaction._id,
        product: product.name,
        quantity,
        totalCost,
        date: transaction.createdAt
      },
      balance: user.wallet
    });
    
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ message: error.message });
  }
};
