// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';  // Use the custom Axios instance
import { useDispatch, useSelector } from 'react-redux';
import { fetchResources } from '../features/resourceSlice';
import CommunityMap from '../components/CommunityMap';

import AddResourceModal from '../components/Modals/AddResourceModal';
import ChakraPlayground from '../components/ChakraPlayground';
import { Box, Button, HStack, Text, VStack, useColorMode } from '@chakra-ui/react';
import Header from '../components/Header';
import SimpleMap from '../components/SimpleMap';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resources, setResources] = useState([]); // State for storing resources

//   const apiUrl = import.meta.env.VITE_API_URL;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

//   const dispatch = useDispatch();
//   const resources = useSelector((state) => state.resources.resourceList);

//   useEffect(() => {
//     dispatch(fetchResources()); // Fetch resources on mount
//   }, [dispatch]);
useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get('/resources');
        setResources(response.data); // Update the resources state with the fetched data
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchResources();
  }, []);
  

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
      
    <AddResourceModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave}/>
      {/* Render the AddResourceModal and pass isOpen and onClose props */}
      {/* <ChakraPlayground/> */}
      <Button m={2} onClick={openModal}>Add Resource</Button>
    </VStack>

    <CommunityMap resources={resources} />
    {/* <SimpleMap/>/ */}
    </>
  );
};

export default HomePage;
