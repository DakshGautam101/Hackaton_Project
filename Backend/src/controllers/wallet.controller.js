import { User } from '../models/user.model.js';
import { Transaction } from '../models/transactions.model.js';

export const getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id; // Get from auth middleware
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ balance: user.wallet || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id; // Get from auth middleware
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 transactions
    
    // Transform transactions to match frontend format
    const formattedTransactions = transactions.map(txn => ({
      id: txn._id,
      type: txn.type,
      title: txn.reason || (txn.type === 'credit' ? 'Money Added' : 'Money Spent'),
      description: txn.reason || 'Transaction',
      amount: txn.type === 'credit' ? txn.amount : -txn.amount,
      date: txn.createdAt.toISOString().split('T')[0],
      status: 'completed'
    }));
    
    res.json({ transactions: formattedTransactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWallet = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    res.json({ balance: user.wallet, transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFunds = async (req, res) => {
  try {
    // Block direct wallet funding - require payment verification
    return res.status(400).json({ 
      message: 'Direct fund addition is not allowed. Please use the secure payment gateway.'
    });

    // The code below will not execute as we're returning early
    // This prevents any direct API call to add funds without proper payment verification
    const userId = req.user.id;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.wallet = (user.wallet || 0) + parseFloat(amount);
    await user.save();

    const txn = await Transaction.create({
      userId,
      type: 'credit',
      amount: parseFloat(amount),
      reason: 'Funds added to wallet'
    });

    res.json({ 
      balance: user.wallet, 
      transaction: txn,
      message: `₹${amount} added to your wallet successfully!`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const spendFunds = async (req, res) => {
  try {
    const userId = req.user.id; // Get from auth middleware
    const { amount, reason } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if ((user.wallet || 0) < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    user.wallet = (user.wallet || 0) - parseFloat(amount);
    await user.save();

    const txn = await Transaction.create({
      userId,
      type: 'debit',
      amount: parseFloat(amount),
      reason: reason || 'Funds spent from wallet',
    });

    res.json({ 
      balance: user.wallet, 
      transaction: txn,
      message: `₹${amount} deducted from your wallet`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
