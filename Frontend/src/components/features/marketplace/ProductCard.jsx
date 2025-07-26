const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-orange-600 font-bold">₹{product.pricePerKg}/kg</span>
          <span className="text-sm text-gray-600">Min: {product.minOrderQty}kg</span>
        </div>
        <div className="mt-3">
          <p className="text-sm text-gray-600">Supplier: {product.supplier.name}</p>
          <div className="flex items-center mt-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-600 ml-1">{product.supplier.rating}/5</span>
          </div>
        </div>
        <button 
          className="w-full mt-4 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors"
          onClick={() => alert('Order functionality coming soon!')}
        >
          Order Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;