import React, {useState, useEffect} from "react";
import { Tabs, TabList, Tab, TabPanels, TabPanel, useColorMode, Button, HStack, Flex, VStack, Text, Center, Box } from "@chakra-ui/react";
import ResourceList from "./ResourceList";
// import AddResourceModal from "./AddResourceModal";
import api from '../api/api';
import CommunityMap from "./CommunityMap";
import AddResourceModal from "./Modals/AddResourceModal";


const Header= () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [resources, setResources] = useState([]); // State for storing resources
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
    //     <HStack spacing={4} align="center">
    //         <h1>Community Map</h1>
    //         <h2>Welcome to the Community Map</h2>
    //         <Button w={20} h={6} colorScheme="teal"  fontSize={10} onClick={toggleColorMode}>
    //     {colorMode === 'light' ? 'Dark' : 'Light'} Theme
    //   </Button>
    //    </HStack>
    <>
    <Button w={20} h={6} colorScheme="teal"  fontSize={10} onClick={toggleColorMode}>
                {colorMode === 'light' ? 'Dark' : 'Light'} Theme
      </Button>
    <VStack>
    <h1 >Community Map</h1>
        <Tabs variant="soft-rounded" colorScheme="teal" p={15} >
            
            <TabList>
                <Tab flex="1">Home</Tab>
                <Tab flex="1">About</Tab>
                <Tab flex="1">Contact</Tab>
                <Tab flex="1">Resources</Tab>
                
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Text textAlign='center'>Welcome!</Text>
                    <VStack>
                        <Button m={2} onClick={openModal}>Add Resource</Button>
                    </VStack>
                    <div>
                    <CommunityMap resources={resources} /></div>

    <AddResourceModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave}/>

                </TabPanel>
                <TabPanel>
                    <Text textAlign='center'>About the Community Map</Text>
                </TabPanel>
                <TabPanel>
                    <Text textAlign='center'>admin@communitymap.com</Text>
                </TabPanel>
                <TabPanel>
                    <Box justifySelf='center'>
                        <ResourceList/>
                    </Box>
                </TabPanel>
            </TabPanels>
        </Tabs>
        <Flex direction="row" align="center" gap={20} p={15} my={8}>
            
            {/* <h2>Welcome to the Community Map</h2> */}
            
       </Flex>
       </VStack>
       </>
    )
}

export default Header;