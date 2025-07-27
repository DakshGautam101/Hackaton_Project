import e from "express";
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Vendor', 'Supplier'],
    default: 'Vendor',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  bio: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  businessName: {
    type: String,
    default: '',
  },
  businessType: {
    type: String,
    default: 'Street Food Vendor',
  },
  location: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [lng, lat]
    // required: true
  }
}
,
  joinedDate: {
    type: Date,
    default: Date.now,
  }

});

userSchema.index({ location: '2dsphere' }); 

export const User = mongoose.model('User', userSchema)|| mongoose.model('User', userSchema, 'users');