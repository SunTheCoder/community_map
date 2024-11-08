import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';

const CommunityMap = ({ resources }) => {
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default center

  useEffect(() => {
    // Set the initial map center to the first resource's coordinates if available
    if (resources.length > 0) {
      setMapCenter([parseFloat(resources[0].latitude), parseFloat(resources[0].longitude)]);
    }
  }, [resources]);

  return (
    <div id="map-container" style={{ width: '100%', height: '400px' }}>
      <MapContainer center={mapCenter} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Display markers for each resource */}
        {resources.map(resource => (
          <Marker
            key={resource.id}
            position={[parseFloat(resource.latitude), parseFloat(resource.longitude)]} // Ensure coordinates are parsed as floats
            icon={new Icon({
              iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>
              <h3>{resource.name}</h3>
              <p>{resource.description}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CommunityMap;
