import mongoose from 'mongoose';
import { Product } from './src/models/product.model.js';
import { Pool } from './src/models/pool.model.js';
import { User } from './src/models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/streetsaver');
    console.log('Connected to MongoDB');

    // Create a sample supplier user first
    const supplierData = {
      username: 'FreshFarmsCo',
      email: 'supplier@freshfarms.com',
      phone: '+91-9876543210',
      password: 'password123',
      role: 'Supplier',
      location: 'Mumbai'
    };

    let supplier = await User.findOne({ email: supplierData.email });
    if (!supplier) {
      supplier = await User.create(supplierData);
      console.log('Created supplier user');
    }

    // Check if products exist, if not create minimal ones for pools
    let existingProducts = await Product.find();
    if (existingProducts.length === 0) {
      // Create minimal products just for pools
      const products = [
        {
          name: 'Fresh Onions',
          pricePerKg: 25,
          minOrderQuantity: 10,
          supplierId: supplier._id
        },
        {
          name: 'Premium Potatoes',
          pricePerKg: 18,
          minOrderQuantity: 15,
          supplierId: supplier._id
        },
        {
          name: 'Mixed Spices Pack',
          pricePerKg: 120,
          minOrderQuantity: 5,
          supplierId: supplier._id
        }
      ];
      existingProducts = await Product.insertMany(products);
      console.log('Created minimal products for pools');
    }

    // Check if pools already exist
    const existingPools = await Pool.find();
    if (existingPools.length > 0) {
      console.log('Pools already exist in database');
      return;
    }

    // Create a sample vendor user for joining pools
    const vendorData = {
      username: 'VendorRaj',
      email: 'vendor@example.com',
      phone: '+91-9876543211',
      password: 'password123',
      role: 'Vendor',
      location: 'Mumbai'
    };

    let vendor = await User.findOne({ email: vendorData.email });
    if (!vendor) {
      vendor = await User.create(vendorData);
      console.log('Created vendor user');
    }

    // Sample pools data
    const pools = [
      {
        productId: existingProducts[0]._id, // Fresh Onions
        totalRequiredQuantity: 500,
        joinedVendors: [
          {
            vendorId: vendor._id,
            quantity: 50
          }
        ],
        isClosed: false
      },
      {
        productId: existingProducts[1]._id, // Premium Potatoes
        totalRequiredQuantity: 300,
        joinedVendors: [
          {
            vendorId: vendor._id,
            quantity: 30
          }
        ],
        isClosed: false
      },
      {
        productId: existingProducts[2]._id, // Mixed Spices Pack
        totalRequiredQuantity: 100,
        joinedVendors: [
          {
            vendorId: vendor._id,
            quantity: 10
          }
        ],
        isClosed: false
      }
    ];

    // Insert pools
    await Pool.insertMany(pools);
    console.log('Sample pools created successfully!');
    
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedProducts();
