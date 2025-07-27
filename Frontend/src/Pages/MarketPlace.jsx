import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Search, Filter, ShoppingCart, Star, MapPin, Clock, Plus, X, AlertCircle, CheckCircle } from 'lucide-react';
import { productService, walletService } from '../services/apiServices.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const MarketPlace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [purchaseStatus, setPurchaseStatus] = useState(null); // 'success', 'error', or null
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    if (isAuthenticated) {
      fetchWalletBalance();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productService.getAllProducts();
      if (data.products && data.products.length > 0) {
        // Transform API data to match expected format
        const transformedProducts = data.products.map((product, index) => ({
          id: product._id || index + 1,
          _id: product._id,
          name: product.name,
          price: product.pricePerKg,
          originalPrice: Math.round(product.pricePerKg * 1.4), // Calculate 40% markup
          moq: `${product.minOrderQuantity}kg minimum`,
          supplier: product.supplierId?.name || 'Unknown Supplier',
          rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
          reviews: Math.floor(Math.random() * 200) + 50, // Random reviews 50-250
          image: getProductImage(product.name),
          category: getProductCategory(product.name),
          savings: Math.round(((Math.round(product.pricePerKg * 1.4) - product.pricePerKg) / Math.round(product.pricePerKg * 1.4)) * 100),
          location: getRandomLocation(),
          delivery: getRandomDelivery()
        }));
        setProducts(transformedProducts);
      } else {
        // If no products from API, use mock data
        setProducts(mockProducts);
        setError('Using sample data - API products not available');
      }
    } catch (err) {
      setError('Failed to load products from server - showing sample data');
      console.error('Products fetch error:', err);
      // Always fallback to mock data if API fails
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to generate missing data
  const getProductImage = (name) => {
    const imageMap = {
      'onion': 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=400',
      'potato': 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=400',
      'tomato': 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
      'spice': 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=400',
      'box': 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=400',
      'plate': 'https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    
    for (const [key, url] of Object.entries(imageMap)) {
      if (name.toLowerCase().includes(key)) return url;
    }
    return 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400';
  };

  const getProductCategory = (name) => {
    if (name.toLowerCase().includes('onion') || name.toLowerCase().includes('potato') || name.toLowerCase().includes('tomato')) {
      return 'vegetables';
    }
    if (name.toLowerCase().includes('spice')) return 'spices';
    if (name.toLowerCase().includes('box') || name.toLowerCase().includes('plate') || name.toLowerCase().includes('packaging')) {
      return 'packaging';
    }
    return 'other';
  };

  const getRandomLocation = () => {
    const locations = ['Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Chennai', 'Kolkata'];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getRandomDelivery = () => {
    const options = ['1-2 days', '2-3 days', '3-4 days', 'Same day'];
    return options[Math.floor(Math.random() * options.length)];
  };
  
  const fetchWalletBalance = async () => {
    try {
      const data = await walletService.getWalletBalance();
      setWalletBalance(data.balance || 0);
    } catch (err) {
      console.error('Failed to fetch wallet balance:', err);
    }
  };
  
  const handleBuyNow = (product) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    setSelectedProduct(product);
    setQuantity(product.moq ? parseInt(product.moq) || 1 : 1);
    setShowPurchaseModal(true);
    setPurchaseStatus(null);
  };
  
  const handlePurchase = async () => {
    if (!selectedProduct || !quantity || quantity <= 0) return;
    
    setPurchaseLoading(true);
    setPurchaseStatus(null);
    
    try {
      const result = await productService.purchaseProduct(selectedProduct._id, quantity);
      setPurchaseStatus('success');
      setPurchaseMessage(result.message || 'Purchase successful!');
      setWalletBalance(result.balance || 0);
      
      // After 3 seconds, close the modal
      setTimeout(() => {
        setShowPurchaseModal(false);
        setPurchaseStatus(null);
      }, 3000);
    } catch (err) {
      setPurchaseStatus('error');
      setPurchaseMessage(err.message || 'Failed to complete purchase');
    } finally {
      setPurchaseLoading(false);
    }
  };  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'spices', name: 'Spices' },
    { id: 'packaging', name: 'Packaging' },
    { id: 'equipment', name: 'Equipment' }
  ];

  const mockProducts = [
    {
      id: 1,
      _id: '1',
      name: 'Fresh Onions',
      price: 25,
      originalPrice: 35,
      moq: '10kg minimum',
      supplier: 'Fresh Farms Co.',
      rating: 4.8,
      reviews: 124,
      image: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'vegetables',
      savings: 29,
      location: 'Mumbai',
      delivery: '2-3 days'
    },
    {
      id: 2,
      _id: '2',
      name: 'Premium Potatoes',
      price: 18,
      originalPrice: 25,
      moq: '15kg minimum',
      supplier: 'AgriSource Ltd.',
      rating: 4.6,
      reviews: 89,
      image: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'vegetables',
      savings: 28,
      location: 'Delhi',
      delivery: '1-2 days'
    },
    {
      id: 3,
      _id: '3',
      name: 'Quality Tomatoes',
      price: 30,
      originalPrice: 40,
      moq: '8kg minimum',
      supplier: 'Organic Growers',
      rating: 4.7,
      reviews: 156,
      image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'vegetables',
      savings: 25,
      location: 'Pune',
      delivery: '1-2 days'
    },
    {
      id: 4,
      _id: '4',
      name: 'Mixed Spices Pack',
      price: 120,
      originalPrice: 150,
      moq: '5kg minimum',
      supplier: 'Spice Masters',
      rating: 4.9,
      reviews: 203,
      image: 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'spices',
      savings: 20,
      location: 'Mumbai',
      delivery: '3-4 days'
    },
    {
      id: 5,
      _id: '5',
      name: 'Food Packaging Boxes',
      price: 8,
      originalPrice: 12,
      moq: '100 pieces minimum',
      supplier: 'PackPro Industries',
      rating: 4.5,
      reviews: 87,
      image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'packaging',
      savings: 33,
      location: 'Delhi',
      delivery: '2-3 days'
    },
    {
      id: 6,
      _id: '6',
      name: 'Disposable Plates',
      price: 15,
      originalPrice: 20,
      moq: '200 pieces minimum',
      supplier: 'EcoServe Ltd.',
      rating: 4.3,
      reviews: 142,
      image: 'https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'packaging',
      savings: 25,
      location: 'Bangalore',
      delivery: '2-3 days'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.supplier?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        const priceA = typeof a.price === 'string' ? parseInt(a.price.replace(/[^\d]/g, '')) : a.price;
        const priceB = typeof b.price === 'string' ? parseInt(b.price.replace(/[^\d]/g, '')) : b.price;
        return priceA - priceB;
      case 'price-high':
        const priceHighA = typeof a.price === 'string' ? parseInt(a.price.replace(/[^\d]/g, '')) : a.price;
        const priceHighB = typeof b.price === 'string' ? parseInt(b.price.replace(/[^\d]/g, '')) : b.price;
        return priceHighB - priceHighA;
      case 'rating':
        return b.rating - a.rating;
      case 'savings':
        const savingsA = typeof a.savings === 'string' ? parseInt(a.savings.replace(/[^\d]/g, '')) : a.savings;
        const savingsB = typeof b.savings === 'string' ? parseInt(b.savings.replace(/[^\d]/g, '')) : b.savings;
        return savingsB - savingsA;
      default:
        return b.reviews - a.reviews;
    }
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-gray-900">StreetSaver</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-orange-500 transition-colors">Home</Link>
              <Link to="/marketplace" className="text-orange-500 font-medium">Marketplace</Link>
              <Link to="/about" className="text-gray-700 hover:text-orange-500 transition-colors">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-orange-500 transition-colors">Contact</Link>
              {user ? (
                <Link to="/dashboard" className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors">
                  Dashboard
                </Link>
              ) : (
                <Link to="/auth" className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors">
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Marketplace</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover wholesale prices on quality ingredients, packaging, and equipment for your street food business
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products, suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="savings">Best Savings</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedProducts.length} of {products.length} products
          </p>
        </div>

        {/* Info Message */}
        {error && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              sortedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  Save {typeof product.savings === 'string' ? product.savings : `${product.savings}%`}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ShoppingCart className="h-5 w-5 text-orange-500" />
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-600 ml-1">({product.reviews})</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3">{product.supplier}</p>

                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl font-bold text-orange-500">
                    {typeof product.price === 'string' ? product.price : `₹${product.price}/kg`}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {typeof product.originalPrice === 'string' ? product.originalPrice : `₹${product.originalPrice}/kg`}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{product.moq}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {product.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {product.delivery}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button 
                    className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                    onClick={() => handleBuyNow(product)}
                  >
                    Buy Now
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Star className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Purchase Modal */}
      {showPurchaseModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Complete Purchase</h3>
              <button 
                onClick={() => {
                  if (!purchaseLoading) setShowPurchaseModal(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            {purchaseStatus === 'success' ? (
              <div className="text-center py-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-green-800">{purchaseMessage}</h3>
                <p className="mt-2 text-gray-600">Your new wallet balance: ₹{walletBalance}</p>
              </div>
            ) : purchaseStatus === 'error' ? (
              <div className="text-center py-4">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-800">Purchase Failed</h3>
                <p className="mt-2 text-gray-600">{purchaseMessage}</p>
                <button 
                  onClick={() => setPurchaseStatus(null)} 
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name} 
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{selectedProduct.name}</h4>
                      <p className="text-sm text-gray-500">{selectedProduct.supplier}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Price per kg:</span>
                    <span className="font-medium">₹{selectedProduct.price}</span>
                  </div>
                  
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Your wallet balance:</span>
                    <span className="font-medium">₹{walletBalance}</span>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Quantity (kg):</label>
                    <input 
                      type="number" 
                      min="1"
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-orange-200"
                    />
                    {selectedProduct.moq && (
                      <p className="text-xs text-gray-500 mt-1">Minimum order: {selectedProduct.moq}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-between font-semibold text-lg mb-6 pt-2 border-t">
                    <span>Total Amount:</span>
                    <span>₹{(selectedProduct.price * quantity).toFixed(2)}</span>
                  </div>
                  
                  {walletBalance < (selectedProduct.price * quantity) && (
                    <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
                      <AlertCircle className="inline-block mr-2 h-4 w-4" />
                      Insufficient wallet balance. Please add funds to your wallet.
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setShowPurchaseModal(false)}
                    className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    disabled={purchaseLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handlePurchase}
                    disabled={purchaseLoading || walletBalance < (selectedProduct.price * quantity)}
                    className={`flex-1 py-2 rounded-lg text-white ${
                      purchaseLoading || walletBalance < (selectedProduct.price * quantity)
                        ? 'bg-orange-300'
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    {purchaseLoading ? 'Processing...' : 'Confirm Purchase'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="h-8 w-8 text-orange-500" />
                <span className="text-xl font-bold text-white">StreetSaver</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering street food vendors through collaborative savings and community support.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
                <li><Link to="/marketplace" className="hover:text-orange-500 transition-colors">Marketplace</Link></li>
                <li><Link to="/dashboard" className="hover:text-orange-500 transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Help Center</a></li>
                <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 StreetSaver. All rights reserved. Made with ❤️ for street food vendors.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketPlace;