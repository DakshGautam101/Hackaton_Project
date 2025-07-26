import { useState } from 'react';
import axios from 'axios';
import Map from '../components/Map';

const LocationForm = () => {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [distanceData, setDistanceData] = useState(null);

  const geocodeAddress = async () => {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address,
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        },
      }
    );
    const location = res.data.results[0].geometry.location;
    setCoordinates(location);

    // Send to backend to calculate distance
    const distanceRes = await axios.post('http://localhost:5000/api/distance', {
      origin: location,
      destination: {
        lat: 19.0760, // Sample dest (Mumbai)
        lng: 72.8777,
      },
    });

    setDistanceData(distanceRes.data);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <input
        className="p-2 w-full border"
        placeholder="Enter address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={geocodeAddress} className="bg-orange-500 text-white p-2 mt-2 w-full">
        Get Location & Distance
      </button>

      {coordinates && <Map center={coordinates} />}

      {distanceData && (
        <div className="mt-4 text-center">
          <p><strong>Distance:</strong> {(distanceData.distance / 1000).toFixed(2)} km</p>
          <p><strong>Duration:</strong> {(distanceData.duration / 60).toFixed(1)} minutes</p>
        </div>
      )}
    </div>
  );
};

export default LocationForm;
