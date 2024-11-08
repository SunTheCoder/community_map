import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import axios from 'axios';

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
  const [mapCenter, setMapCenter] = useState(resources.length ? [parseFloat(resources[0].latitude), parseFloat(resources[0].longitude)] : [51.505, -0.09]);
  const [zoomLevel, setZoomLevel] = useState(13); // Initialize with both state and setter for zoom
  const [latitude, setLatitude] = useState(null); // State for latitude to display
  const [longitude, setLongitude] = useState(null); // State for longitude to display

  // Separate fields for each address component
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const OPEN_CAGE_API_KEY = import.meta.env.VITE_OPEN_CAGE_API_KEY; // Replace with your OpenCage API key

  useEffect(() => {
    if (resources.length > 0) {
      setMapCenter([parseFloat(resources[0].latitude), parseFloat(resources[0].longitude)]);
    }
  }, [resources]);

  const handleGeocode = async () => {
    // Combine address components into a single string
    const fullAddress = `${street}, ${city}, ${state} ${zipCode}`;
    
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
        params: {
          q: fullAddress,
          key: OPEN_CAGE_API_KEY,
        },
      });
      
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        setMapCenter([lat, lng]); // Update the map center to the geocoded location
        setLatitude(lat); // Set the latitude to display to the user
        setLongitude(lng); // Set the longitude to display to the user
        setZoomLevel(15); // Optional: zoom in on the location
      } else {
        alert('Address not found. Please try again.');
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert('Error fetching location. Please try again.');
    }
  };

  return (
    <div>
      {/* Address input fields */}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder="Street Address"
          style={{ padding: '8px', width: '45%', marginRight: '5px' }}
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          style={{ padding: '8px', width: '25%', marginRight: '5px' }}
        />
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State"
          style={{ padding: '8px', width: '10%', marginRight: '5px' }}
        />
        <input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="Zip Code"
          style={{ padding: '8px', width: '15%' }}
        />
        <button onClick={handleGeocode} style={{ padding: '8px', marginLeft: '5px' }}>Find Location</button>
      </div>

      {/* Display coordinates */}
      <div style={{ marginBottom: '10px' }}>
        {latitude && longitude && (
          <p>Latitude: {latitude.toFixed(6)}, Longitude: {longitude.toFixed(6)}</p>
        )}
      </div>

      {/* Map Container */}
      <div id="map-container" style={{ width: '100%', height: '400px' }}>
        <MapContainer center={mapCenter} zoom={zoomLevel} style={{ height: '400px', width: '100%' }}>
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
    </div>
  );
};

export default CommunityMap;
