import mongoose from 'mongoose';
import { Product } from './src/models/product.model.js';
import { Pool } from './src/models/pool.model.js';
import { User } from './src/models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const seedPools = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/streetsaver');
    console.log('Connected to MongoDB');

    // Check if products exist to use for pools
    const existingProducts = await Product.find();
    if (existingProducts.length === 0) {
      console.log('No products found in database. Please create products first.');
      return;
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

    // Sample pools data using existing products
    const pools = [
      {
        productId: existingProducts[0]._id,
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
        productId: existingProducts[1] ? existingProducts[1]._id : existingProducts[0]._id,
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
        productId: existingProducts[2] ? existingProducts[2]._id : existingProducts[0]._id,
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
    console.log(`Created ${pools.length} pools using existing products`);
    
  } catch (error) {
    console.error('Error seeding pools:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedPools();
