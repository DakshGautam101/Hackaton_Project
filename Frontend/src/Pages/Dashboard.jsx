import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Users, ShoppingCart, TrendingUp, Bell, Settings, LogOut, AlertCircle, CheckCircle, X, Package, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { poolService, walletService, productService } from '../services/apiServices.js';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [pools, setPools] = useState([]);
  const [products, setProducts] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const [joinQuantity, setJoinQuantity] = useState(1);
  const [joinStatus, setJoinStatus] = useState(null); // 'success', 'error', or null
  const [joinMessage, setJoinMessage] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  
  // Determine if user is a supplier
  const isSupplier = user?.role === 'Supplier';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Always get wallet balance for both roles
      const walletData = await walletService.getWalletBalance().catch(() => ({ balance: 0 }));
      setWalletBalance(walletData.balance || 0);
      
      if (isSupplier) {
        // For suppliers, fetch their products instead of pools
        const productsData = await productService.getAllProducts().catch(() => ({ products: [] }));
        
        // Filter to only show products created by this supplier
        const supplierProducts = (productsData.products || []).filter(product => {
          // Check if supplierId is a string or an object with _id
          const productSupplierId = typeof product.supplierId === 'object' ? 
            product.supplierId?._id : product.supplierId;
          return productSupplierId === user?._id;
        });
        
        // Transform product data for display
        const transformedProducts = supplierProducts.map(product => ({
          _id: product._id,
          id: product._id,
          name: product.name || 'Product',
          price: product.pricePerKg || 0,
          minOrderQuantity: product.minOrderQuantity || 1,
          description: `Min order: ${product.minOrderQuantity}kg • ₹${product.pricePerKg}/kg`,
          totalSold: product.totalSold || 0,
          category: product.category || 'Other',
          createdAt: product.createdAt || new Date()
        }));
        
        // Set products with no mock data
        setProducts(transformedProducts);
      } else {
        // For vendors, fetch pools as before
        const poolsData = await poolService.getAllPools().catch(() => ({ pools: [] }));
        
        // Transform pool data to match expected format
        const transformedPools = (poolsData.pools || []).map(pool => {
          const currentQuantity = pool.joinedVendors?.reduce((sum, vendor) => sum + vendor.quantity, 0) || 0;
          const pricePerKg = pool.productId?.pricePerKg || 25;
          
          return {
            _id: pool._id,
            id: pool._id,
            name: pool.productId?.name ? `${pool.productId.name} Pool` : 'Product Pool',
            status: pool.isClosed ? 'closed' : 'active',
            memberCount: pool.joinedVendors?.length || 0,
            description: `${currentQuantity}/${pool.totalRequiredQuantity}kg • ${pool.joinedVendors?.length || 0} members`,
            targetAmount: pool.totalRequiredQuantity * pricePerKg,
            currentQuantity: currentQuantity,
            progressPercent: Math.round((currentQuantity / pool.totalRequiredQuantity) * 100),
            productName: pool.productId?.name || 'Unknown Product',
            totalRequiredQuantity: pool.totalRequiredQuantity
          };
        });
        
        // Set pools with no mock data
        setPools(transformedPools);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };
  
  // Display appropriate role-specific error messages
  const displayRoleError = () => {
    if (isSupplier) {
      return "As a Supplier, you can't access pool creation or join pools. You can add and manage products.";
    } else {
      return "As a Vendor, you can't access product management. You can create and join pools.";
    }
  };
  
  const openJoinPoolModal = (pool) => {
    setSelectedPool(pool);
    const defaultQuantity = 1;
    setJoinQuantity(defaultQuantity);
    setShowJoinModal(true);
    setJoinStatus(null);
  };
  
  const handleJoinPool = async () => {
    if (!selectedPool || !joinQuantity || joinQuantity <= 0) return;
    
    setJoinLoading(true);
    setJoinStatus(null);
    
    try {
      // Calculate the cost to join the pool
      const pricePerKg = selectedPool.targetAmount / selectedPool.totalRequiredQuantity || 25;
      const cost = pricePerKg * joinQuantity;
      
      if (walletBalance < cost) {
        setJoinStatus('error');
        setJoinMessage('Insufficient wallet balance. Please add funds to your wallet.');
        setJoinLoading(false);
        return;
      }
      
      const result = await poolService.joinPool(selectedPool._id, joinQuantity);
      setJoinStatus('success');
      setJoinMessage(result.message || 'Successfully joined the pool!');
      
      // Update wallet balance
      setWalletBalance(prevBalance => prevBalance - cost);
      
      // Refresh pools data
      fetchDashboardData();
      
      // After 3 seconds, close the modal
      setTimeout(() => {
        setShowJoinModal(false);
        setJoinStatus(null);
      }, 3000);
    } catch (err) {
      setJoinStatus('error');
      setJoinMessage(err.message || 'Failed to join pool');
    } finally {
      setJoinLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-gray-900">StreetSaver</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-600 hover:text-orange-500 cursor-pointer" />
              <Settings className="h-6 w-6 text-gray-600 hover:text-orange-500 cursor-pointer" />
              <Link to="/" onClick={handleLogout} className="flex items-center text-gray-600 hover:text-orange-500">
                <LogOut className="h-6 w-6 mr-1" />
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username || 'User'}!
          </h1>
          <p className="text-gray-600">
            {isSupplier 
              ? "Here's what's happening with your products and sales today." 
              : "Here's what's happening with your savings pools today."}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {isSupplier ? (
            // Supplier stats
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Package className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Products</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {loading ? '...' : products.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ₹{loading ? '...' : walletBalance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Sales</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {loading ? '...' : products.reduce((sum, product) => sum + (product.totalSold || 0), 0)}kg
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ₹{loading ? '...' : products.reduce((sum, product) => sum + ((product.totalSold || 0) * (product.price || product.pricePerKg || 0)), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Vendor stats
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Pools</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {loading ? '...' : pools.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ₹{loading ? '...' : walletBalance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-semibold text-gray-900">24</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ChefHat className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Savings</p>
                    <p className="text-2xl font-semibold text-gray-900">₹12,450</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {isSupplier ? (
            // Supplier Content
            <>
              {/* Products Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Your Products</h2>
                    <Link 
                      to="/add-product" 
                      className="inline-flex items-center text-sm bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Product
                    </Link>
                  </div>
                  <div className="p-6">
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="border rounded-lg p-4 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : products.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Yet</h3>
                        <p className="text-gray-600 mb-4">Add your first product to start selling to vendors</p>
                        <Link to="/add-product" className="text-orange-600 hover:text-orange-700 font-medium">
                          Add Your First Product →
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {products.map(product => (
                          <div key={product._id || product.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-gray-900">{product.name || 'Product'}</h3>
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                {product.category || 'Other'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{product.description || 'No description'}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                Total sold: {product.totalSold || 0}kg
                              </span>
                              <Link 
                                to={`/product/${product._id || product.id}`}
                                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                              >
                                Manage Product
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Supplier Quick Actions */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                  </div>
                  <div className="p-6 space-y-3">
                    <Link 
                      to="/add-product" 
                      className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-center block"
                    >
                      Add New Product
                    </Link>
                    <Link 
                      to="/marketplace" 
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center block"
                    >
                      View Marketplace
                    </Link>
                    <Link 
                      to="/wallet" 
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center block"
                    >
                      Manage Wallet
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">New order received</span>
                        <span className="text-gray-400">1h ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product price updated</span>
                        <span className="text-gray-400">3h ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment received</span>
                        <span className="text-gray-400">1d ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Vendor Content
            <>
              {/* Active Pools */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Your Active Pools</h2>
                  </div>
                  <div className="p-6">
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="border rounded-lg p-4 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : pools.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Pools</h3>
                        <p className="text-gray-600 mb-4">Join or create a pool to start saving money with other vendors</p>
                        <Link to="/marketplace" className="text-orange-600 hover:text-orange-700 font-medium">
                          Browse Available Pools →
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pools.slice(0, 3).map(pool => (
                          <div key={pool._id || pool.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-gray-900">{pool.name || 'Pool'}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                pool.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {pool.status || 'Active'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {pool.memberCount || 0} vendors • {pool.description || 'No description'}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                Target: ₹{pool.targetAmount?.toLocaleString() || '0'}
                              </span>
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => openJoinPoolModal(pool)}
                                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1 rounded"
                                >
                                  Join Pool
                                </button>
                                <Link 
                                  to={`/pool/${pool._id || pool.id}`} 
                                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                                >
                                  View Details
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Vendor Quick Actions */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                  </div>
                  <div className="p-6 space-y-3">
                    <Link 
                      to="/create-pool" 
                      className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-center block"
                    >
                      Create New Pool
                    </Link>
                    <Link 
                      to="/marketplace" 
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center block"
                    >
                      Browse Marketplace
                    </Link>
                    <Link 
                      to="/wallet" 
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center block"
                    >
                      Manage Wallet
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spices order delivered</span>
                        <span className="text-gray-400">2h ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">New vendor joined packaging pool</span>
                        <span className="text-gray-400">5h ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment processed</span>
                        <span className="text-gray-400">1d ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Join Pool Modal - Only shown for vendors */}
      {!isSupplier && showJoinModal && selectedPool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Join Pool</h2>
              <button 
                onClick={() => setShowJoinModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {joinStatus === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
                <p className="text-gray-600">{joinMessage}</p>
              </div>
            ) : joinStatus === 'error' ? (
              <div className="text-center py-8">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
                <p className="text-gray-600">{joinMessage}</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="bg-orange-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{selectedPool.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{selectedPool.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current Progress:</span>
                      <span className="font-medium">{selectedPool.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-4">
                      <div 
                        className="bg-orange-500 h-2.5 rounded-full" 
                        style={{ width: `${selectedPool.progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">₹{selectedPool.targetAmount?.toLocaleString() || '0'}</span> target
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{selectedPool.memberCount}</span> members
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4 bg-blue-50 p-3 rounded-lg">
                    <span className="text-blue-800">Your Wallet Balance:</span>
                    <span className="font-semibold text-blue-800">₹{walletBalance.toLocaleString()}</span>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Quantity to Order (kg):</label>
                    <input 
                      type="number" 
                      min="1"
                      value={joinQuantity} 
                      onChange={(e) => setJoinQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-orange-200"
                    />
                  </div>
                  
                  <div className="flex justify-between font-semibold text-lg mb-6 pt-2 border-t">
                    <span>Total Cost:</span>
                    {selectedPool && (
                      <span>₹{(joinQuantity * (selectedPool.targetAmount / selectedPool.totalRequiredQuantity)).toFixed(2)}</span>
                    )}
                  </div>
                  
                  {walletBalance < (joinQuantity * (selectedPool.targetAmount / selectedPool.totalRequiredQuantity)) && (
                    <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
                      <AlertCircle className="inline-block mr-2 h-4 w-4" />
                      Insufficient wallet balance. Please add funds to your wallet.
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setShowJoinModal(false)}
                    className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    disabled={joinLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleJoinPool}
                    disabled={joinLoading || walletBalance < (joinQuantity * (selectedPool.targetAmount / selectedPool.totalRequiredQuantity))}
                    className={`flex-1 py-2 rounded-lg text-white ${
                      joinLoading || walletBalance < (joinQuantity * (selectedPool.targetAmount / selectedPool.totalRequiredQuantity))
                        ? 'bg-orange-300'
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    {joinLoading ? 'Processing...' : 'Join Pool'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;