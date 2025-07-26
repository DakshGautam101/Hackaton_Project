import { Product } from '../models/product.model.js';
import { User } from '../models/user.model.js';

export const createProduct = async (req, res) => {
  try {
    const { name, pricePerKg, minOrderQuantity, supplierId } = req.body;

    const user  = await User.findById(supplierId);
    if (!user) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    if( user.role !== 'Supplier'){
      return res.status(403).json({ message: 'Only suppliers can create products' });
    }

    if (!name || !pricePerKg || !minOrderQuantity || !supplierId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const product = await Product.create({
      name,
      pricePerKg,
      minOrderQuantity,
      supplierId,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('supplierId', 'name');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplierId', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
