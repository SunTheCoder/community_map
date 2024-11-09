import React, { useState, useEffect } from "react";
import { Tabs, TabList, Tab, TabPanels, TabPanel, useColorMode, Button, VStack, Text, Box, Flex } from "@chakra-ui/react";
import ResourceList from "./ResourceList";
import api from '../api/api';
import CommunityMap from "./CommunityMap";
import AddResourceModal from "./Modals/AddResourceModal";
import FindLocation from "./FindLocation";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [resources, setResources] = useState([]); // State for storing resources
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Shared state for map center and zoom level
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Initialize with a default value
  const [zoomLevel, setZoomLevel] = useState(13);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const updateMapCenter = (lat, lng, zoom = 15) => {
    setMapCenter([lat, lng]);
    setZoomLevel(zoom);
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get('/resources');
        setResources(response.data); // Update the resources state with the fetched data

        // Update map center if there are resources available
        if (response.data.length > 0) {
          const firstResource = response.data[0];
          setMapCenter([parseFloat(firstResource.latitude), parseFloat(firstResource.longitude)]);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchResources();
  }, []);

  const handleSave = async (resourceData) => {
    try {
      const response = await api.post('/resources', resourceData);
      console.log("Resource saved successfully:", response.data);
      closeModal();
    } catch (error) {
      console.error("Error saving resource:", error);
    }
  };

  return (
    <>
      <Button w={20} h={6} colorScheme="teal" fontSize={10} onClick={toggleColorMode}>
        {colorMode === 'light' ? 'Dark' : 'Light'} Theme
      </Button>
      <VStack>
        <h1>Community Map</h1>
        <Tabs variant="soft-rounded" colorScheme="teal" p={15}>
          <TabList>
            <Tab flex="1">Home</Tab>
            <Tab flex="1">About</Tab>
            <Tab flex="1">Contact</Tab>
            <Tab flex="1">Resources</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Text textAlign="center">Welcome!</Text>
            </TabPanel>
            <TabPanel>
              <Text textAlign="center">About the Community Map</Text>
            </TabPanel>
            <TabPanel>
              <Text textAlign="center">admin@communitymap.com</Text>
            </TabPanel>
            <TabPanel>
              <VStack m={2}>
                <div>
                  <FindLocation resources={resources} updateMapCenter={updateMapCenter} />
                </div>
                <Button onClick={openModal}>Add Resource</Button>
              </VStack>
              <AddResourceModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} />
              <Box justifySelf="center">
                <Text fontSize={22} fontWeight="bold">Resource List:</Text>
                <ResourceList />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Flex direction="row" align="center" gap={20} p={15} my={8} />
      </VStack>
      <CommunityMap resources={resources} mapCenter={mapCenter} zoomLevel={zoomLevel} />
    </>
  );
};

export default Header;
