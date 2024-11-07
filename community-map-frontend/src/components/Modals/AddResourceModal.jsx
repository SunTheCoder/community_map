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
    coordinates: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    phone_number: '',
  });

  // Hook: theme-aware background colors
  const bgColor = useColorModeValue("white", "gray.700");
  const overlayBg = useColorModeValue("rgba(0, 0, 0, 0.5)", "rgba(255, 255, 255, 0.1)");

  // Event handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setResourceData({
      ...resourceData,
      [name]: name === "zip_code" ? String(value) : value, // Ensure zip_code is a string
    });
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
