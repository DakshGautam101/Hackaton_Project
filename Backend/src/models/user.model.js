import e from "express";
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  role :{
    type: String,
    enum: ['Vendor', 'Supplier'],
    default: 'Vendor',
  },
    email: {
    type: String,
    required: true,
    unique: true,
    },
    phone :{
    type: String,
    required: true,
    },
    password: {
    type: String,
    required: true,
    },
    profilePicture: {
    type: String,
    required: false,
    },
    bio: {
    type: String,
    },
    rating:{
    type: Number,
    default: 0,
    min:0,
    max:5,
    },
    wallet :{
      type: Number,
      default: 0,
    }
});

export const User = mongoose.model('User', userSchema)|| mongoose.model('User', userSchema, 'users');