import express from 'express';
import cors from 'cors';
import { connectDB } from './lib/ConnectDB.js';
import authRoutes from './routes/auth.routes.js';
import poolRoutes from './routes/pool.routes.js';
import productRoutes from './routes/product.routes.js';
import walletRoutes from './routes/wallet.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import profileRoutes from './routes/profile.routes.js';
import distanceRoutes from './routes/distance.routes.js';

const app = express();

//  Body parser middleware
app.use(express.json());

//  CORS middleware
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"];
app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins for development
    callback(null, true);
  },
  credentials: true,
}));


app.use('/api/auth', authRoutes);
app.use('/api/pools', poolRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/distance', distanceRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message
  });
});

app.listen(5000, async () => {
  console.log("Server is running on port 5000");
  try {
    await connectDB();
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
});
