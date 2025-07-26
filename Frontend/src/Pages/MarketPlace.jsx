import { useState, useEffect } from 'react';
import { productService } from '../api/services';
import ProductCard from '../components/features/marketplace/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: '',
    searchQuery: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    if (filters.category !== 'all' && product.category !== filters.category) return false;
    if (filters.minPrice && product.pricePerKg < filters.minPrice) return false;
    if (filters.maxPrice && product.pricePerKg > filters.maxPrice) return false;
    if (filters.searchQuery && !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>
        <p className="text-gray-600 mt-2">Browse products from trusted suppliers</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 border rounded"
            value={filters.searchQuery}
            onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
          />
          <select
            className="p-2 border rounded"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="all">All Categories</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="spices">Spices</option>
          </select>
          <input
            type="number"
            placeholder="Min Price"
            className="p-2 border rounded"
            value={filters.minPrice}
            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
          />
          <input
            type="number"
            placeholder="Max Price"
            className="p-2 border rounded"
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center text-gray-600 py-8">
          No products found matching your criteria
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;