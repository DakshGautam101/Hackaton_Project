import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { purchaseProduct } from '../controllers/product.purchase.controller.js';
import { protectRoute, requireSupplier } from '../middlewares/verify.js';

const router = express.Router();

// Supplier creates a product - restricted to suppliers only
router.post('/', protectRoute, requireSupplier, createProduct);

// Get all available products (public endpoint)
router.get('/', getAllProducts);

// Get a product by ID (public endpoint)
router.get('/:id', getProductById);

// Update a product - restricted to suppliers only
router.put('/:id', protectRoute, requireSupplier, updateProduct);

// Delete a product - restricted to suppliers only
router.delete('/:id', protectRoute, requireSupplier, deleteProduct);

// Purchase a product using wallet funds - any authenticated user can purchase
router.post('/purchase', protectRoute, purchaseProduct);

export default router;
