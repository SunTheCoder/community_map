import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { fetchResources, addResource } from '../features/resourceSlice';
import { syncUnsyncedResources, saveResource } from "../indexedDB";


import { Tabs, TabList, Tab, TabPanels, TabPanel, useColorMode, Button, VStack, Text, Box, Flex, useToast } from "@chakra-ui/react";
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

  const toast = useToast();

  // Access resources from the Redux store
  const resources = useSelector((state) => state.resources.resourceList);
  const { token, user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0); // Track active tab index

  // Derived state to determine if map tab is active
  const isMapTabActive = activeTabIndex === 2; // Assuming the map tab is the third tab

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
    dispatch(fetchResources());
    window.addEventListener('beforeunload', syncUnsyncedResources); // Sync on refresh/unload
    return () => {
      window.removeEventListener('beforeunload', syncUnsyncedResources);
    };
    // Dispatch the action to fetch resources from the API
  }, [dispatch]);

   // Update map center when resources change
   useEffect(() => {
    if (resources.length > 0) {
      const firstResource = resources[0];
      setMapCenter([parseFloat(firstResource.latitude), parseFloat(firstResource.longitude)]);
    }
  }, [resources]);

  useEffect(() => {
    if (isMapTabActive) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100); // Add a slight delay to ensure the tab is fully rendered
    }
  }, [isMapTabActive]);

  const handleSave = async (resourceData) => {
    // Wrap the save operation in a promise
    const savePromise = new Promise(async (resolve, reject) => {
      try {
        // Save to the backend
        const response = await api.post('/resources', resourceData);
        console.log("Resource saved successfully:", response.data);

        // Dispatch to Redux
        dispatch(addResource(response.data));

        // Save to IndexedDB with `isSynced: true` as it has been saved to the backend
        await saveResource(response.data, true);

        resolve(response.data); // Resolve the promise on success
      } catch (error) {
        console.error("Error saving resource to backend:", error);

        // If backend save fails, save to IndexedDB as `isSynced: false` to retry later
        await saveResource(resourceData, false);

        reject(error); // Reject the promise on failure
      }
    });

    // Display the loading toast until the promise resolves or rejects
    toast.promise(savePromise, {
      loading: { title: "Saving resource", description: "Please wait..." },
      success: { title: "Resource saved", description: "Resource added successfully!" },
      error: { title: "Save failed", description: "Could not save the resource." },
    });

    // Await the save promise, and close the modal only if it resolves
    try {
      await savePromise;
      closeModal(); // Close the modal after successful save
    } catch (error) {
      // Optionally handle any additional error behavior here
    }
  };


  const handleLogout = async () => {
    await syncUnsyncedResources(); // Sync unsynced data before logout

    dispatch(logout());
  };

  return (
    <>
    <Button w={20} h={6} colorScheme="teal" fontSize={10} onClick={toggleColorMode}>
      {colorMode === 'light' ? 'Dark' : 'Light'} Theme
    </Button>
    <VStack spacing={4} align="center">
      <h1 style={{ fontSize: '40px' }}>Community Map</h1>
      <Tabs index={activeTabIndex} onChange={(index) => setActiveTabIndex(index)} variant="line" colorScheme="teal" p={4}>
        <TabList justifyContent="center" maxWidth="500px" mx="auto">
          <Tab width="130px" textAlign="center" flexShrink={0}>Home</Tab>
          <Tab width="130px" textAlign="center" flexShrink={0}>About</Tab>
          <Tab width="130px" textAlign="center" flexShrink={0}>Map</Tab>
          <Tab width="130px" textAlign="center" flexShrink={0}>Resources</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {token ? (
              <VStack spacing={4} align="center">
                <AdminPanel />
                <Text fontSize="lg" fontWeight="bold">
                  Welcome, {user}!
                </Text>
                <Button colorScheme="teal" onClick={handleLogout}>
                  Log Out
                </Button>
              </VStack>
            ) : (
              <LoginSignupForm />
            )}
          </TabPanel>
          <TabPanel>
            <VStack>
              <Text textAlign="center" w={400} fontSize={20} m={5}>
                "Empowering Communities, Honoring Legacy"
              </Text>
              <Text textAlign="center" w={400}>
                This map platform is designed to put the power of local knowledge and resources into the hands of the community...
              </Text>
            </VStack>
          </TabPanel>
          <TabPanel>
            <div key={isMapTabActive ? 'map-active' : 'map-inactive'}>
              <CommunityMap resources={resources} mapCenter={mapCenter} zoomLevel={zoomLevel} />
            </div>
          </TabPanel>
          <TabPanel>
            <VStack m={2}>
              <FindLocation resources={resources} updateMapCenter={updateMapCenter} />
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
    {/* <CommunityMap resources={resources} mapCenter={mapCenter} zoomLevel={zoomLevel} /> */}
  </>
  
  );
};

export default Header;
