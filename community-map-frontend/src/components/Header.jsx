import React from "react";
import { Tabs, TabList, Tab, TabPanels, TabPanel, useColorMode, Button, HStack, Flex, VStack } from "@chakra-ui/react";
import ResourceList from "./ResourceList";


const Header= () => {
  const { colorMode, toggleColorMode } = useColorMode();

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
        <Tabs variant="soft-rounded" colorScheme="teal" p={15} >
            <TabList>
                <Tab>Home</Tab>
                <Tab>About</Tab>
                <Tab>Contact</Tab>
                <Tab>Resources</Tab>
                
            </TabList>
            <TabPanels>
                <TabPanel>
                    <p>Welcome!</p>

                </TabPanel>
                <TabPanel>
                    <p>About the Community Map</p>
                </TabPanel>
                <TabPanel>
                    <p>Contact the Community Map</p>
                </TabPanel>
                <TabPanel>
                    <ResourceList/>
                </TabPanel>
            </TabPanels>
        </Tabs>
        <Flex direction="row" align="center" gap={20} p={15} my={8}>
            <h1>Community Map</h1>
            {/* <h2>Welcome to the Community Map</h2> */}
            
       </Flex>
       </VStack>
       </>
    )
}

export default Header;