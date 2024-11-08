// src/components/SimpleMap.jsx
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SimpleMap = () => {
  const defaultPosition = [51.505, -0.09];

  return (
    <div id="map-container" style={{ width: '100%', height: '400px' }}> {/* Plain div wrapper with fixed height */}
      <MapContainer
        center={defaultPosition}
        zoom={13}
        style={{ height: '100%', width: '100%' }} // Full width and height within the wrapper
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
};

export default SimpleMap;
