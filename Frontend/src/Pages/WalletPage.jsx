import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { walletService, paymentService } from '../services/apiServices.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [balanceData, transactionsData] = await Promise.all([
        walletService.getWalletBalance().catch(() => ({ balance: 0 })),
        walletService.getTransactionHistory().catch(() => ({ transactions: mockTransactions }))
      ]);
      
      setBalance(balanceData.balance || 0);
      setTransactions(transactionsData.transactions || mockTransactions);
    } catch (err) {
      setError('Failed to load wallet data');
      console.error('Wallet error:', err);
      // Use mock data as fallback
      setBalance(12450);
      setTransactions(mockTransactions);
    } finally {
      setLoading(false);
    }
  };

  const mockTransactions = [
    {
      id: 1,
      type: 'credit',
      title: 'Pool Savings - Vegetables',
      description: 'Bulk order savings from Fresh Vegetables Pool',
      amount: 850,
      date: '2024-03-10',
      status: 'completed'
    },
    {
      id: 2,
      type: 'debit',
      title: 'Spices Purchase',
      description: 'Turmeric and chili powder order',
      amount: -1200,
      date: '2024-03-08',
      status: 'completed'
    },
    {
      id: 3,
      type: 'credit',
      title: 'Referral Bonus',
      description: 'Bonus for referring Priya Sharma',
      amount: 500,
      date: '2024-03-05',
      status: 'completed'
    },
    {
      id: 4,
      type: 'debit',
      title: 'Packaging Materials',
      description: 'Food containers and bags',
      amount: -800,
      date: '2024-03-03',
      status: 'completed'
    },
    {
      id: 5,
      type: 'credit',
      title: 'Pool Savings - Equipment',
      description: 'Bulk order savings from Kitchen Equipment Pool',
      amount: 1200,
      date: '2024-03-01',
      status: 'completed'
    },
    {
      id: 6,
      type: 'debit',
      title: 'Monthly Subscription',
      description: 'StreetSaver Premium membership',
      amount: -299,
      date: '2024-02-28',
      status: 'completed'
    }
  ];

  const quickActions = [
    { title: 'Add Funds', icon: Plus, action: () => setShowAddFunds(true), color: 'bg-green-500' },
    { title: 'Request Payout', icon: ArrowUpRight, action: () => alert('Payout requested'), color: 'bg-blue-500' },
    { title: 'View Statement', icon: CreditCard, action: () => alert('Statement downloaded'), color: 'bg-purple-500' },
    { title: 'Auto-reload', icon: TrendingUp, action: () => alert('Auto-reload settings'), color: 'bg-orange-500' }
  ];

  const stats = [
    { label: 'Total Earned', value: '₹45,230', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Total Spent', value: '₹32,780', icon: DollarSign, color: 'text-red-600' },
    { label: 'This Month', value: '₹3,200', icon: Clock, color: 'text-blue-600' },
    { label: 'Pending', value: '₹0', icon: CheckCircle, color: 'text-gray-600' }
  ];

  const handleAddFunds = async () => {
    if (!addAmount || addAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    const amount = parseFloat(addAmount);
    
    try {
      console.log('Adding funds with amount:', amount);
      
      // Step 1: Create an order on the server
      const orderData = await paymentService.createWalletOrder(amount);
      console.log('Order created successfully:', orderData);
      
      // Step 2: Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_OWSQc20OQGeF58", // Use env variable with fallback
        amount: orderData.amount,
        currency: orderData.currency,
        name: "StreetSaver",
        description: "Wallet Funding",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // Add amount to the payload for updating the wallet
            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amount
            };
            
            // Step 3: Verify the payment on server and update wallet
            const result = await paymentService.verifyWalletPayment(paymentData);
            
            alert(result.message || `₹${amount} added to your wallet successfully!`);
            setAddAmount('');
            setShowAddFunds(false);
            
            // Refresh wallet data
            fetchWalletData();
          } catch (err) {
            console.error('Payment verification error:', err);
            alert(err.message || 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.username || "",
          email: user?.email || "",
          contact: user?.phone || ""
        },
        theme: {
          color: "#F97316"
        }
      };
      
      // Step 4: Initialize Razorpay
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      
    } catch (err) {
      console.error('Add funds error:', err);
      alert('Failed to add funds: ' + (err.message || 'Unknown error. Please try again.'));
    }
  };

  const getTransactionIcon = (type) => {
    return type === 'credit' ? ArrowDownLeft : ArrowUpRight;
  };

  const getTransactionColor = (type) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
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
              <Link to="/dashboard" className="text-gray-700 hover:text-orange-500 transition-colors">Dashboard</Link>
              <Link to="/marketplace" className="text-gray-700 hover:text-orange-500 transition-colors">Marketplace</Link>
              <Link to="/wallet" className="text-orange-500 font-medium">Wallet</Link>
              <Link to="/profile" onClick={logout} className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors">
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.username}'s Wallet
          </h1>
          <p className="text-gray-600">Manage your funds and track your transactions</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-lg p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-orange-100 text-sm">Current Balance</p>
                  <h2 className="text-4xl font-bold">
                    {loading ? '...' : `₹${balance.toLocaleString()}`}
                  </h2>
                </div>
                <Wallet className="h-12 w-12 text-orange-200" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Account Status</p>
                  <p className="font-semibold">Active</p>
                </div>
                <div className="text-right">
                  <p className="text-orange-100 text-sm">Last Updated</p>
                  <p className="font-semibold">Just now</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center">
                    <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {transactions.map(transaction => {
                  const Icon = getTransactionIcon(transaction.type);
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                          <Icon className={`h-5 w-5 ${getTransactionColor(transaction.type)}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{transaction.title}</h4>
                          <p className="text-gray-600 text-sm">{transaction.description}</p>
                          <p className="text-gray-500 text-xs">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'credit' ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">{transaction.status}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity flex flex-col items-center space-y-2`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{action.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Funds Modal */}
            {showAddFunds && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Funds</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {[500, 1000, 2000].map(amount => (
                      <button
                        key={amount}
                        onClick={() => setAddAmount(amount.toString())}
                        className="py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddFunds}
                      className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                    >
                      Add Funds
                    </button>
                    <button
                      onClick={() => setShowAddFunds(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Micro-Credit */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Micro-Credit Available</h3>
              <p className="text-blue-100 text-sm mb-4">
                Get instant credit up to ₹10,000 for your business needs
              </p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-100 text-sm">Available Credit</p>
                  <p className="text-xl font-bold">₹8,500</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-200" />
              </div>
              <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Apply Now
              </button>
            </div>

            {/* Savings Goal */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Savings Goal</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>₹3,200 of ₹5,000</span>
                  <span>64%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                You're doing great! ₹1,800 more to reach your goal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;