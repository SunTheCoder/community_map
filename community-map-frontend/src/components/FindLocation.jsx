import React, { useState } from "react";
import { Input, Button, VStack } from '@chakra-ui/react';
import axios from 'axios';

const FindLocation = ({ resources, updateMapCenter }) => {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const OPEN_CAGE_API_KEY = import.meta.env.VITE_OPEN_CAGE_API_KEY;

  const handleGeocode = async () => {
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
        updateMapCenter(lat, lng, 15); // Update the map center in Header
      } else {
        alert('Address not found. Please try again.');
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert('Error fetching location. Please try again.');
    }
  };

  return (
    <VStack mb="4">
      <Input
        type="text"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        placeholder="Street Address"
        padding="8px"
        width="300px"
      />
      <Input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City"
        padding="8px"
        width="300px"
      />
      <Input
        type="text"
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder="State"
        padding="8px"
        width="300px"
      />
      <Input
        type="text"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        placeholder="Zip Code"
        padding="8px"
        width="300px"
      />
      <Button onClick={handleGeocode} padding="8px" ml="2">Find Location</Button>
    </VStack>
  );
};

export default FindLocation;
