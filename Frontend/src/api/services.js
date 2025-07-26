import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/signup', userData),
  getProfile: () => API.get('/auth/profile'),
};

// Product services
export const productService = {
  getAllProducts: () => API.get('/products'),
  getProductById: (id) => API.get(`/products/${id}`),
  createProduct: (productData) => API.post('/products', productData),
};

// Pool services
export const poolService = {
  getAllPools: () => API.get('/pools'),
  getPoolById: (id) => API.get(`/pools/${id}`),
  createPool: (poolData) => API.post('/pools', poolData),
  joinPool: (poolId, data) => API.post(`/pools/${poolId}/join`, data),
};

// Wallet services
export const walletService = {
  getBalance: () => API.get('/wallet'),
  addFunds: (amount) => API.post('/wallet/add', { amount }),
  getTransactions: () => API.get('/wallet/transactions'),
};

// Location services
export const locationService = {
  calculateDistance: (origin, destination) => 
    API.post('/distance', { origin, destination }),
  updateLocation: (coordinates) => 
    API.post('/location/update', coordinates),
};