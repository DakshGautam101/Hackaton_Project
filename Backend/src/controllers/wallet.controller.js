import { User } from '../models/user.model.js';
import { Transaction } from '../models/transactions.model.js';

export const getWallet = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user || user.role !== 'vendor') {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    res.json({ balance: user.wallet, transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFunds = async (req, res) => {
  const { userId, amount } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || user.role !== 'vendor') {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    user.wallet += amount;
    await user.save();

    const txn = await Transaction.create({
      userId,
      type: 'credit',
      amount,
      reason: 'Manual fund addition'
    });

    res.json({ balance: user.wallet, transaction: txn });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const spendFunds = async (req, res) => {
  const { userId, amount, reason } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || user.role !== 'vendor') {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    if (user.wallet < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    user.wallet -= amount;
    await user.save();

    const txn = await Transaction.create({
      userId,
      type: 'debit',
      amount,
      reason,
    });

    res.json({ balance: user.wallet, transaction: txn });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
