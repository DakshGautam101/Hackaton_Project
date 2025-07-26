import { useState, useCallback, useRef } from 'react';
import { GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api';
import LoadingSpinner from '../../common/LoadingSpinner';

const MapComponent = ({ markers, center, onMarkerClick }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '0.75rem'
  };

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    setMap(map);

    if (markers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach(({ position }) => bounds.extend(position));
      map.fitBounds(bounds);
    } else {
      map.setCenter(center);
      map.setZoom(12);
    }
  }, [markers, center]);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
    setMap(null);
  }, []);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    if (onMarkerClick) onMarkerClick(marker);
    
    // Center the map on the clicked marker
    if (map) {
      map.panTo(marker.position);
    }
  };

  const getMarkerIcon = (type) => ({
    url: type === 'vendor' 
      ? '/assets/vendor-marker.svg'
      : '/assets/supplier-marker.svg',
    scaledSize: new window.google.maps.Size(40, 40),
    origin: new window.google.maps.Point(0, 0),
    anchor: new window.google.maps.Point(20, 40)
  });

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {markers.map((marker, index) => (
          <MarkerF
            key={`${marker.type}-${index}`}
            position={marker.position}
            icon={getMarkerIcon(marker.type)}
            onClick={() => handleMarkerClick(marker)}
            animation={window.google.maps.Animation.DROP}
          />
        ))}

        {selectedMarker && (
          <InfoWindowF
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-3 min-w-[200px]">
              <h3 className="font-semibold text-lg text-gray-800">
                {selectedMarker.name}
              </h3>
              <p className="text-sm text-gray-600 capitalize mt-1">
                {selectedMarker.type}
              </p>
              {selectedMarker.rating && (
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="text-sm ml-1 text-gray-700">
                    {selectedMarker.rating} / 5.0
                  </span>
                </div>
              )}
              <button
                onClick={() => window.open(`/profile/${selectedMarker.id}`)}
                className="mt-3 w-full bg-orange-500 text-white px-4 py-2 rounded-md 
                          text-sm hover:bg-orange-600 transition-colors"
              >
                View Profile
              </button>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>

      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <img src="/assets/vendor-marker.svg" alt="Vendor" className="w-6 h-6" />
            <span className="text-sm text-gray-700">Vendor</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/supplier-marker.svg" alt="Supplier" className="w-6 h-6" />
            <span className="text-sm text-gray-700">Supplier</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;