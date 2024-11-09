// import React, { useState } from 'react';
// import './AddResourceModal.css'

// const AddResourceModal = ({ isOpen, onClose, onSave }) => {
//   const [resourceData, setResourceData] = useState({
//     name: '',
//     location: '',
//     type: '',
//     accessibility: '',
//     comments: '',
//     description: '',
//     votes_accuracy: 0,
//     votes_verified: 0,
//     coordinates: '',
//     street_address: '',
//     city: '',
//     state: '',
//     zip_code: '',
//     phone_number: '',
//   });

//   const handleChange = (e) => {
//     setResourceData({ ...resourceData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(resourceData);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <button onClick={onClose}>Close</button>
//         <form onSubmit={handleSubmit}>
//           <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
//           <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
//           <input type="text" name="type" placeholder="Type" onChange={handleChange} required />
//           <input type="text" name="accessibility" placeholder="Accessibility" onChange={handleChange} />
//           <input type="text" name="comments" placeholder="Comments" onChange={handleChange} />
//           <input type="text" name="description" placeholder="Description" onChange={handleChange} />
//           <input type="text" name="coordinates" placeholder="Coordinates" onChange={handleChange} />
//           <input type="text" name="street_address" placeholder="Street Address" onChange={handleChange} />
//           <input type="text" name="city" placeholder="City" onChange={handleChange} />
//           <input type="text" name="state" placeholder="State" onChange={handleChange} />
//           <input type="text" name="zip_code" placeholder="Zip Code" onChange={handleChange} required />
//           <input type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} />
//           <button type="submit">Save Resource</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddResourceModal;


import React, { useState } from 'react';
import { Box, Flex, Button, Input, FormControl, FormLabel, useColorModeValue } from "@chakra-ui/react";
import axios from 'axios';

const AddResourceModal = ({ isOpen, onClose, onSave }) => {
  // Hook: useState to manage resource data
  const [resourceData, setResourceData] = useState({
    name: '',
    location: '',
    type: '',
    accessibility: '',
    comments: '',
    description: '',
    votes_accuracy: 0,
    votes_verified: 0,
    latitude: '',
    longitude: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    phone_number: '',
  });

  // Hook: theme-aware background colors
  const bgColor = useColorModeValue("white", "gray.700");
  const overlayBg = useColorModeValue("rgba(0, 0, 0, 0.5)", "rgba(255, 255, 255, 0.1)");

   // Timeout for debouncing
   let debounceTimeout;
   const fetchCoordinates = async () => {
    const { street_address, city, state, zip_code } = resourceData;
  
    // Filter out empty fields for the address
    const addressParts = [street_address, city, state, zip_code].filter(Boolean);
    const address = addressParts.join(", ");
    console.log("Formatted Address for Geocoding:", address);
  
    const OPEN_CAGE_API_KEY = import.meta.env.VITE_OPEN_CAGE_API_KEY;
  
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
        params: {
          q: address,
          key: OPEN_CAGE_API_KEY,
        },
      });
      
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        console.log("Geocoded location:", lat, lng);
        // setMapCenter([lat, lng]); // Update the map center to the geocoded location
        setResourceData((prevData) => ({
          ...prevData,
          latitude: lat,
          longitude: lng,
        }));
      } else {
        alert('Address not found. Please try again.');
        console.warn("Geocode response has no results:", response.data);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };
  

  // Event handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setResourceData((prevData) => ({
      ...prevData,
      [name]: name === "zip_code" ? String(value) : value, // Ensure zip_code is a string
    }));

    if (["street_address", "city", "state", "zip_code"].includes(name)) {
      // Call the geocoding API after a slight delay to reduce API calls
      setTimeout(fetchCoordinates, 500);
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(resourceData);
    onClose();
  };

  // Early return if modal is not open
  if (!isOpen) return null;

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      background={overlayBg}
      justifyContent="center"
      alignItems="center"
      zIndex="1000"
      onClick={onClose}
    >
      <Box
        background={bgColor}
        padding="20px"
        borderRadius="8px"
        width="300px"
        onClick={(e) => e.stopPropagation()}
      >
        <Button onClick={onClose} mb={4}>Close</Button>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" placeholder="Name" onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Type</FormLabel>
            <Input type="text" name="type" placeholder="Type" onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Accessibility</FormLabel>
            <Input type="text" name="accessibility" placeholder="Accessibility" onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Street Address</FormLabel>
            <Input type="text" name="street_address" placeholder="Street Address" onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Latitude</FormLabel>
            <Input type="number" name="latitude"  step="0.000001" // Allows six decimal places
    value={resourceData.latitude || ''} placeholder="e.g., 37.7749" onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Longitude</FormLabel>
            <Input type="number" name="longitude"  step="0.000001" // Allows six decimal places
    value={resourceData.longitude || ''} placeholder="e.g., 37.7749" onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>City</FormLabel>
            <Input type="text" name="city" placeholder="City" onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>State</FormLabel>
            <Input type="text" name="state" placeholder="State" onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Zip Code</FormLabel>
            <Input type="number" name="zip_code" placeholder="Zip Code" onChange={handleChange} />
          </FormControl>
          <Button type="submit" colorScheme="blue" mt={4}>Save Resource</Button>
        </form>
      </Box>
    </Flex>
  );
};

export default AddResourceModal;
