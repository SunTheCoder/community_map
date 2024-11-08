import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';

const MapViewUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom); // Set the map view to the specified center and zoom
    }
  }, [center, zoom, map]);
  return null;
};

const CommunityMap = ({ resources }) => {
  // Default to the first resource's location or fallback to a standard location
  const [mapCenter, setMapCenter] = useState(resources.length ? [parseFloat(resources[0].latitude), parseFloat(resources[0].longitude)] : [51.505, -0.09]);
  const [zoomLevel] = useState(13); // Define the zoom level you want for the first resource

  useEffect(() => {
    // Update map center to the first resource's coordinates if available
    if (resources.length > 0) {
      setMapCenter([parseFloat(resources[0].latitude), parseFloat(resources[0].longitude)]);
    }
  }, [resources]);

  return (
    <div id="map-container" style={{ width: '100%', height: '400px' }}>
      <MapContainer center={mapCenter} zoom={zoomLevel} style={{ height: '400px', width: '100%' }}>
        {/* MapViewUpdater component to control the map's view based on the first resource */}
        <MapViewUpdater center={mapCenter} zoom={zoomLevel} />

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
              <p>{resource.type}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CommunityMap;
