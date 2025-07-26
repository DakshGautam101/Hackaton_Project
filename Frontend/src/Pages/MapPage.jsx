import { useState, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { locationService } from '../api/services';
import MapComponent from '../components/features/map/MapComponent';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MapPage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const { data } = await locationService.getAllLocations();
      setLocations(data);
    } catch (err) {
      setError('Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  const filteredMarkers = locations
    .filter(location => selectedType === 'all' || location.type === selectedType)
    .map(location => ({
      position: { lat: location.latitude, lng: location.longitude },
      name: location.user.username,
      type: location.user.role.toLowerCase(),
      rating: location.user.rating
    }));

  if (!isLoaded) return <LoadingSpinner />;

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#fcfaf8]">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between border-b border-[#f3ece7] px-10 py-3">
          <h1 className="text-2xl font-bold text-[#1b130e]">Location Map</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-full ${
                selectedType === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('vendor')}
              className={`px-4 py-2 rounded-full ${
                selectedType === 'vendor'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Vendors
            </button>
            <button
              onClick={() => setSelectedType('supplier')}
              className={`px-4 py-2 rounded-full ${
                selectedType === 'supplier'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Suppliers
            </button>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="max-w-[960px] flex-1 space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <LoadingSpinner />
            ) : (
              <MapComponent
                markers={filteredMarkers}
                center={{ lat: 19.0760, lng: 72.8777 }} // Mumbai coordinates
                onMarkerClick={(marker) => console.log('Marker clicked:', marker)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;