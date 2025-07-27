import mongoose from 'mongoose';
import { Product } from './src/models/product.model.js';
import { User } from './src/models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const testAPI = async () => {
  try {
    console.log('🔧 Testing API and Database Connection...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/streetsaver');
    console.log('✅ Connected to MongoDB\n');

    // Test 1: Check if users exist
    console.log('📊 TEST 1: Checking Users in Database');
    console.log('==========================================');
    const userCount = await User.countDocuments();
    console.log(`Total users: ${userCount}`);
    
    if (userCount > 0) {
      const users = await User.find().limit(3);
      console.log('\nSample users:');
      users.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log(`  ID: ${user._id}`);
        console.log(`  Username: ${user.username || 'N/A'}`);
        console.log(`  Email: ${user.email || 'N/A'}`);
        console.log(`  Role: ${user.role || 'N/A'}`);
        console.log(`  Business Name: ${user.businessName || 'N/A'}`);
        console.log(`  Location: ${JSON.stringify(user.location) || 'N/A'}`);
        console.log(`  Phone: ${user.phone || 'N/A'}`);
      });
    } else {
      console.log('❌ No users found in database');
    }

    // Test 2: Check if products exist
    console.log('\n\n📦 TEST 2: Checking Products in Database');
    console.log('==========================================');
    const productCount = await Product.countDocuments();
    console.log(`Total products: ${productCount}`);
    
    if (productCount > 0) {
      const products = await Product.find().limit(3);
      console.log('\nSample products (without population):');
      products.forEach((product, index) => {
        console.log(`\nProduct ${index + 1}:`);
        console.log(`  ID: ${product._id}`);
        console.log(`  Name: ${product.name}`);
        console.log(`  Price: ${product.pricePerKg}`);
        console.log(`  Supplier ID: ${product.supplierId}`);
        console.log(`  Supplier ID Type: ${typeof product.supplierId}`);
      });
    } else {
      console.log('❌ No products found in database');
    }

    // Test 3: Test the exact API call that frontend makes
    console.log('\n\n🔍 TEST 3: Testing API Call - getAllProducts() with Population');
    console.log('================================================================');
    
    // This mimics the exact query from product.controller.js
    const productsWithSupplier = await Product.find().populate('supplierId', 'name');
    console.log(`Products with populated supplier: ${productsWithSupplier.length}`);
    
    if (productsWithSupplier.length > 0) {
      console.log('\nDetailed analysis of first 3 products:');
      productsWithSupplier.slice(0, 3).forEach((product, index) => {
        console.log(`\n=== PRODUCT ${index + 1} ANALYSIS ===`);
        console.log(`Product ID: ${product._id}`);
        console.log(`Product Name: ${product.name}`);
        console.log(`Price: ${product.pricePerKg}`);
        console.log(`Min Order: ${product.minOrderQuantity}`);
        
        console.log('\n--- Supplier Information ---');
        console.log(`Supplier ID Field Type: ${typeof product.supplierId}`);
        console.log(`Supplier ID Value: ${product.supplierId}`);
        
        if (product.supplierId && typeof product.supplierId === 'object') {
          console.log('\n--- Populated Supplier Object ---');
          console.log(`Full Supplier Object:`, JSON.stringify(product.supplierId, null, 2));
          
          // Check all possible name fields
          const nameFields = ['name', 'username', 'firstName', 'lastName', 'email', 'displayName', 'fullName', 'businessName'];
          console.log('\n--- Name Field Analysis ---');
          nameFields.forEach(field => {
            if (product.supplierId[field]) {
              console.log(`  ✅ ${field}: "${product.supplierId[field]}"`);
            } else {
              console.log(`  ❌ ${field}: undefined/null`);
            }
          });
          
          // Check location fields
          const locationFields = ['location', 'address', 'city', 'state', 'country', 'region', 'area'];
          console.log('\n--- Location Field Analysis ---');
          locationFields.forEach(field => {
            if (product.supplierId[field]) {
              console.log(`  ✅ ${field}: "${JSON.stringify(product.supplierId[field])}"`);
            } else {
              console.log(`  ❌ ${field}: undefined/null`);
            }
          });
        } else {
          console.log('❌ Supplier not populated or is not an object');
        }
        
        console.log('\n' + '='.repeat(50));
      });
    }

    // Test 4: Test with different population strategies
    console.log('\n\n🧪 TEST 4: Testing Different Population Strategies');
    console.log('==================================================');
    
    // Strategy 1: Populate all fields
    console.log('\n--- Strategy 1: Populate All Fields ---');
    const allFieldsPopulated = await Product.findOne().populate('supplierId');
    if (allFieldsPopulated && allFieldsPopulated.supplierId) {
      console.log('Available fields in supplier:');
      Object.keys(allFieldsPopulated.supplierId.toObject()).forEach(key => {
        console.log(`  ${key}: ${allFieldsPopulated.supplierId[key]}`);
      });
    }
    
    // Strategy 2: Populate specific fields
    console.log('\n--- Strategy 2: Populate Specific Fields ---');
    const specificFieldsPopulated = await Product.findOne().populate('supplierId', 'username email businessName location phone');
    if (specificFieldsPopulated && specificFieldsPopulated.supplierId) {
      console.log('Specific fields populated:');
      console.log(JSON.stringify(specificFieldsPopulated.supplierId, null, 2));
    }

    // Test 5: Check what the actual API response would look like
    console.log('\n\n📡 TEST 5: Simulating Actual API Response');
    console.log('==========================================');
    const apiResponse = {
      products: await Product.find().populate('supplierId', 'name')
    };
    
    console.log('API Response Structure:');
    console.log(`- products array length: ${apiResponse.products.length}`);
    if (apiResponse.products.length > 0) {
      console.log('- First product structure:');
      const firstProduct = apiResponse.products[0];
      console.log(JSON.stringify({
        _id: firstProduct._id,
        name: firstProduct.name,
        pricePerKg: firstProduct.pricePerKg,
        minOrderQuantity: firstProduct.minOrderQuantity,
        supplierId: firstProduct.supplierId
      }, null, 2));
    }

    // Test 6: Check if the issue is with the populate query
    console.log('\n\n🔧 TEST 6: Debugging Population Query');
    console.log('=====================================');
    
    // Check if 'name' field exists in User model
    const sampleUser = await User.findOne();
    if (sampleUser) {
      console.log('Sample user fields:');
      Object.keys(sampleUser.toObject()).forEach(key => {
        console.log(`  ${key}: ${typeof sampleUser[key]} - ${sampleUser[key]}`);
      });
      
      console.log('\n❗ IMPORTANT: The populate query uses "name" field, but check if users actually have this field!');
    }

    console.log('\n\n🎯 SUMMARY AND RECOMMENDATIONS');
    console.log('===============================');
    console.log('1. Check the console output above to see what fields are actually available');
    console.log('2. The frontend is looking for various name fields - see which ones exist');
    console.log('3. Location might be stored as coordinates object, not as text');
    console.log('4. The populate query might need to be updated based on actual field names');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the test
testAPI();
