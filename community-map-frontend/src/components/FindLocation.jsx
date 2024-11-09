import React, { useEffect, useState } from "react";
import { Box, Input, Button, VStack, HStack } from '@chakra-ui/react';
import axios from 'axios';


const FindLocation = () => {
    // const [mapCenter, setMapCenter] = useState(resources.length ? [parseFloat(resources[0].latitude), parseFloat(resources[0].longitude)] : [51.505, -0.09]);
    // const [zoomLevel, setZoomLevel] = useState(13); // Initialize with both state and setter for zoom
    // const [latitude, setLatitude] = useState(null); // State for latitude to display
    // const [longitude, setLongitude] = useState(null); // State for longitude to display
  
    // Separate fields for each address component
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
  
  
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
  
    const OPEN_CAGE_API_KEY = import.meta.env.VITE_OPEN_CAGE_API_KEY; // Replace with your OpenCage API key
  
    // useEffect(() => {
    //   if (resources.length > 0) {
    //     setMapCenter([parseFloat(resources[0].latitude), parseFloat(resources[0].longitude)]);
    //   }
    // }, [resources]);
  
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
  
    const handleSave = async (resourceData) => {
      try {
        const response = await api.post('/resources', resourceData); // Use api instance here
        console.log("Resource saved successfully:", response.data);
        // Optionally, close the modal or reset state here
        closeModal();
      } catch (error) {
        console.error("Error saving resource:", error);
      }
    };
  
    return (
        <div>
        {/* Address input fields */}
<VStack mb="4">
  <Input
    type="text"
    value={street}
    onChange={(e) => setStreet(e.target.value)}
    placeholder="Street Address"
    padding="8px"
    width="45%"
    mr="2"
  />
  <Input
    type="text"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    placeholder="City"
    padding="8px"
    width="25%"
    mr="2"
    />
    
  <Input
    type="text"
    value={state}
    onChange={(e) => setState(e.target.value)}
    placeholder="State"
    padding="8px"
    width="10%"
    mr="2"
    />
  <Input
    type="text"
    value={zipCode}
    onChange={(e) => setZipCode(e.target.value)}
    placeholder="Zip Code"
    padding="8px"
    width="15%"
    />
  
  <Button onClick={handleGeocode} padding="8px" ml="2">Find Location</Button>

    <AddResourceModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave}/>
      <Button fontSize={12} h={6}  onClick={openModal}>Add Resource</Button>
    </VStack>
    </div>
    )
}

export default FindLocation;