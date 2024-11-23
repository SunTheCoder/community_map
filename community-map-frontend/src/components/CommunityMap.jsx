import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, } from 'react-leaflet';
import { Box, Input, Button, VStack, HStack } from '@chakra-ui/react';
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

const CommunityMap = ({ resources, mapCenter, zoomLevel }) => {
  // const [mapCenter, setMapCenter] = useState(resources.length ? [parseFloat(resources[0].latitude), parseFloat(resources[0].longitude)] : [51.505, -0.09]);
//   const [zoomLevel, setZoomLevel] = useState(13); // Initialize with both state and setter for zoom
const isValidLatLng = (lat, lng) => typeof lat === "number" && !isNaN(lat) && typeof lng === "number" && !isNaN(lng);
const validMapCenter = isValidLatLng(mapCenter[0], mapCenter[1]) ? mapCenter : [51.505, -0.09];


  const [latitude, setLatitude] = useState(null); // State for latitude to display
  const [longitude, setLongitude] = useState(null); // State for longitude to display

  // Separate fields for each address component
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const OPEN_CAGE_API_KEY = import.meta.env.VITE_OPEN_CAGE_API_KEY; // Replace with your OpenCage API key

  return (
    <div>
      

{/* Address input fields
<VStack mb="4">
  <Input
    type="text"
    value={street}
    onChange={(e) => setStreet(e.target.value)}
    placeholder="Street Address"
    padding="8px"
    width="30"
    // mr="2"
  />
  <Input
    type="text"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    placeholder="City"
    padding="8px"
    width="30"
    mr="2"
    />
    
  <Input
    type="text"
    value={state}
    onChange={(e) => setState(e.target.value)}
    placeholder="State"
    padding="8px"
    width="30"
    mr="2"
    />
  <Input
    type="text"
    value={zipCode}
    onChange={(e) => setZipCode(e.target.value)}
    placeholder="Zip Code"
    padding="8px"
    width="30"
    />
  
  <Button onClick={handleGeocode} padding="8px" ml="2">Find Location</Button>
    </VStack> */}


      {/* Display coordinates */}
      {/* <div style={{ marginBottom: '10px' }}>
        {latitude && longitude && (
          <p>Latitude: {latitude.toFixed(6)}, Longitude: {longitude.toFixed(6)}</p>
        )}
      </div> */}

      {/* Map Container */}
      <div id="map-container" style={{ width: '1100px', height: '800px' , justifySelf: 'center'}}>
        <MapContainer center={mapCenter} zoom={zoomLevel} style={{ height: '800px', width: '1100px', borderRadius: '7.5px' }}>
          <MapViewUpdater center={validMapCenter} zoom={zoomLevel} />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Display markers for each resource */}
          {resources.map(resource => {
  const lat = parseFloat(resource.latitude);
  const lng = parseFloat(resource.longitude);

  if (!isValidLatLng(lat, lng)) {
    console.warn(`Invalid coordinates for resource ${resource.id}:`, lat, lng);
    return null; // Skip rendering this marker if coordinates are invalid
  }

  return (
    <Marker
      key={resource.id}
      position={[lat, lng]}
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
  );
})}

        </MapContainer>
      </div>
    </div>
  );
};

export default CommunityMap;
