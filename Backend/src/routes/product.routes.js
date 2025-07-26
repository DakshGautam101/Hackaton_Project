import express from 'express';
import { createProduct, getAllProducts, getProductById } from '../controllers/product.controller.js';
import { protectRoute } from '../middlewares/verify.js';

const router = express.Router();

// Supplier creates a product
router.post('/', protectRoute, createProduct);

// Get all available products
router.get('/', protectRoute, getAllProducts);

// Get a product by ID
router.get('/:id', protectRoute, getProductById);

export default router;
