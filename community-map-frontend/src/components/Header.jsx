import React from "react";
import { useColorMode, Button, HStack, Flex, VStack } from "@chakra-ui/react";


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
    <VStack>
        <Flex direction="row" align="center" gap={20} p={15} my={8}>
            <h1>Community Map</h1>
            <h2>Welcome to the Community Map</h2>
            <Button w={20} h={6} colorScheme="teal"  fontSize={10} onClick={toggleColorMode}>
        {colorMode === 'light' ? 'Dark' : 'Light'} Theme
      </Button>
       </Flex>
       </VStack>
    )
}

export default Header;