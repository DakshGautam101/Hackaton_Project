import { Product } from '../models/product.model.js';
import { User } from '../models/user.model.js';

export const createProduct = async (req, res) => {
  try {
    const { name, pricePerKg, minOrderQuantity, description, category, availableQuantity, imageUrl } = req.body;
    
    // Get supplierId from authenticated user
    const supplierId = req.user._id;

    // Check if user is a supplier
    const user = await User.findById(supplierId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role !== 'Supplier') {
      return res.status(403).json({ message: 'Only suppliers can create products' });
    }

    if (!name || !pricePerKg || !minOrderQuantity) {
      return res.status(400).json({ message: 'Name, price, and minimum order quantity are required' });
    }

    const product = await Product.create({
      name,
      pricePerKg,
      minOrderQuantity,
      supplierId,
      description,
      category,
      availableQuantity,
      imageUrl,
      totalSold: 0
    });

    res.status(201).json({ 
      message: 'Product created successfully',
      product
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('supplierId', 'username location');

    const productsWithSupplierInfo = products.map(product => {
      const { supplierId } = product;

      return {
        ...product.toObject(),
        supplier: {
          name: supplierId?.username || 'Unknown',
          location: supplierId?.location?.coordinates || [],
        }
      };
    });

    res.status(200).json({ products: productsWithSupplierInfo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplierId', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;
    const userId = req.user._id;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user is the supplier who created this product
    if (product.supplierId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      productId, 
      updates, 
      { new: true }
    );
    
    res.status(200).json({ 
      message: 'Product updated successfully',
      product: updatedProduct 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user is the supplier who created this product
    if (product.supplierId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    
    await Product.findByIdAndDelete(productId);
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
