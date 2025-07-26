import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async ()=>{

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB successfully");
        return mongoose.connection;
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
        
    }



}