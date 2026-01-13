import React, { useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const MapComponent = ({ center, markers = [] }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '12px'
  };

  const defaultCenter = useMemo(() => ({
    lat: center?.latitude || 28.6139,
    lng: center?.longitude || 77.2090
  }), [center]);

  const [selectedMarker, setSelectedMarker] = React.useState(null);

  // Fallback if Google Maps API key is not available
  if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
    return (
      <div style={mapContainerStyle} className="map-fallback">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          background: '#f0f0f0',
          borderRadius: '12px',
          color: '#666'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p>🗺️ Map view requires Google Maps API key</p>
            <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
              Please add REACT_APP_GOOGLE_MAPS_API_KEY to your .env file
            </p>
            <div style={{ marginTop: '20px', fontSize: '0.85rem', color: '#999' }}>
              <p>Locations found: {markers.length}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={markers.length > 0 ? 12 : 10}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}
        
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
                {selectedMarker.title}
              </h3>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;

