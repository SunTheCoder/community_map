// src/pages/HomePage.jsx
import React, { useState } from 'react';
import AddResourceModal from '../components/Modals/AddResourceModal';
import ChakraPlayground from '../components/ChakraPlayground';
import { Box, Button, HStack, Text, VStack, useColorMode } from '@chakra-ui/react';
import Header from '../components/Header';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
        <Header/>
        
      <VStack>
      <Text fontSize="2xl" fontWeight="bold" >Welcome to the Community Map</Text>
      
      {/* Render the AddResourceModal and pass isOpen and onClose props */}
      <AddResourceModal isOpen={isModalOpen} onClose={closeModal} />
      <ChakraPlayground/>
      <Button fontSize={12} h={6}  onClick={openModal}>Add Resource</Button>
    </VStack>
    </>
  );
};

export default HomePage;
