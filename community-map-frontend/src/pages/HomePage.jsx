// src/pages/HomePage.jsx
import React, { useState } from 'react';
import api from '../api/api';  // Use the custom Axios instance

import AddResourceModal from '../components/Modals/AddResourceModal';
import ChakraPlayground from '../components/ChakraPlayground';
import { Box, Button, HStack, Text, VStack, useColorMode } from '@chakra-ui/react';
import Header from '../components/Header';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

//   const apiUrl = import.meta.env.VITE_API_URL;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  

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
    <>
        <Header/>
        
      <VStack>
      {/* <Text fontSize="2xl" fontWeight="bold" >Welcome to the Community Map</Text> */}
      
      {/* Render the AddResourceModal and pass isOpen and onClose props */}
      <AddResourceModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave}/>
      <ChakraPlayground/>
      <Button fontSize={12} h={6}  onClick={openModal}>Add Resource</Button>
    </VStack>
    </>
  );
};

export default HomePage;
