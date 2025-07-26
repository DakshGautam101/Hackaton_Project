import { useState } from 'react';
import { poolService } from '../../../api/services';

const PoolCard = ({ pool, onJoinSuccess }) => {
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoinPool = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await poolService.joinPool(pool._id, { quantity: Number(quantity) });
      onJoinSuccess();
      setQuantity('');
    } catch (err) {
      setError('Failed to join pool. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progress = (pool.currentQuantity / pool.targetQuantity) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{pool.product.name}</h3>
          <p className="text-sm text-gray-600">by {pool.supplier.name}</p>
        </div>
        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
          {pool.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm">
          <span className="font-medium">Price:</span> ₹{pool.pricePerKg}/kg
        </p>
        <p className="text-sm">
          <span className="font-medium">Target:</span> {pool.targetQuantity}kg
        </p>
        <p className="text-sm">
          <span className="font-medium">Current:</span> {pool.currentQuantity}kg
        </p>
        <p className="text-sm">
          <span className="font-medium">Ends:</span>{' '}
          {new Date(pool.endDate).toLocaleDateString()}
        </p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-orange-500 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {pool.status === 'OPEN' && (
        <form onSubmit={handleJoinPool} className="space-y-3">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity in kg"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
            min="1"
            required
          />
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:bg-gray-400"
          >
            {loading ? 'Joining...' : 'Join Pool'}
          </button>
        </form>
      )}
    </div>
  );
};

export default PoolCard;