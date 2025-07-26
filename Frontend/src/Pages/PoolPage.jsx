import { useState, useEffect } from 'react';
import { poolService } from '../api/services.js';
import PoolCard from '../components/features/pools/PoolCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const PoolPage = () => {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('OPEN');

  useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = async () => {
    try {
      setLoading(true);
      const { data } = await poolService.getAllPools();
      setPools(data);
    } catch (err) {
      setError('Failed to fetch pools. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPools = pools.filter(pool => {
    if (filter === 'ALL') return true;
    return pool.status === filter;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Group Buying Pools</h1>
        <p className="text-gray-600 mt-2">
          Join other vendors to get better prices on bulk orders
        </p>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4">
          {['ALL', 'OPEN', 'COMPLETED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full ${
                filter === status
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPools.map(pool => (
            <PoolCard 
              key={pool._id} 
              pool={pool}
              onJoinSuccess={fetchPools}
            />
          ))}
        </div>
      )}

      {!loading && !error && filteredPools.length === 0 && (
        <div className="text-center text-gray-600 py-8">
          No pools found matching your criteria
        </div>
      )}
    </div>
  );
};

export default PoolPage;
