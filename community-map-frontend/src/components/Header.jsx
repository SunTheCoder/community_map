import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { fetchResources, addResource } from '../features/resourceSlice';

import { Tabs, TabList, Tab, TabPanels, TabPanel, useColorMode, Button, VStack, Text, Box, Flex } from "@chakra-ui/react";
import ResourceList from "./ResourceList";
import api from '../api/api';
import CommunityMap from "./CommunityMap";
import AddResourceModal from "./Modals/AddResourceModal";
import FindLocation from "./FindLocation";
import LoginSignupForm from "./LoginSignupForm";
import AdminPanel from "./AdminPanel";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useDispatch();

  // Access resources from the Redux store
  const resources = useSelector((state) => state.resources.resourceList);
  const { token, user } = useSelector((state) => state.auth);

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
    // Dispatch the action to fetch resources from the API
    dispatch(fetchResources());
  }, [dispatch]);

  const handleSave = async (resourceData) => {
    try {
      const response = await api.post('/resources', resourceData);
      console.log("Resource saved successfully:", response.data);
      
      // Dispatch the addResource action to update Redux store with the new resource
      dispatch(addResource(response.data));
      closeModal();
    } catch (error) {
      console.error("Error saving resource:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <Button w={20} h={6} colorScheme="teal" fontSize={10} onClick={toggleColorMode}>
        {colorMode === 'light' ? 'Dark' : 'Light'} Theme
      </Button>
      <VStack>
        <h1 style={{ fontSize: '40px' }}>Community Map</h1>
        <Tabs variant="soft-rounded" colorScheme="teal" p={15}>
          <TabList>
            <Tab flex="1">Home</Tab>
            <Tab flex="1">About</Tab>
            <Tab flex="1">Contact</Tab>
            <Tab flex="1">Resources</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {token ? (
                <>
                  <VStack spacing={4} align="center">
                    <AdminPanel />
                    <Text fontSize="lg" fontWeight="bold">
                      Welcome, {user}!
                    </Text>
                    <Button colorScheme="teal" onClick={handleLogout}>
                      Log Out
                    </Button>
                  </VStack>
                </>
              ) : (
                <LoginSignupForm />
              )}
            </TabPanel>
            <TabPanel>
              <VStack>
                <Text textAlign='center' w={400} fontSize={20} m={5}>
                  "Empowering Communities, Honoring Legacy"
                </Text>
                <Text textAlign='center' w={400}>
                  This map platform is designed to put the power of local knowledge and resources into the hands of the community...
                </Text>
              </VStack>
            </TabPanel>
            <TabPanel>
              <Text textAlign="center">Email: admin@communitymap.com</Text>
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
                <ResourceList resources={resources} />
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
