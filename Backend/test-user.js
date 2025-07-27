// test-user.js - Script to create a test user

import { connectDB } from './src/lib/ConnectDB.js';
import { User } from './src/models/user.model.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createTestUser = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists');
      console.log('Email: test@example.com');
      console.log('Password: password123');
      process.exit(0);
    }

    // Create salt & hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create user
    const user = await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      username: 'Test User',
      phone: '1234567890',
      role: 'Vendor',
      wallet: 1000
    });

    console.log('Test user created successfully:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    console.log('User ID:', user._id);
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();
