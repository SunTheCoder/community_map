// src/components/ChakraPlayground.jsx
import React from 'react';
import { Box, Button, Text, VStack, useColorMode } from '@chakra-ui/react';

const ChakraPlayground = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <VStack spacing={4} align="center" p={6}>
      <Text fontSize="2xl" fontWeight="bold">
        {/* Chakra UI Styling Playground */}
      </Text>
      {/* <Button w={20} h={6} colorScheme="teal"  fontSize={10} onClick={toggleColorMode}>
        {colorMode === 'light' ? 'Dark' : 'Light'} Theme
      </Button> */}
      {/* <Box
        bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
        p={1}
        borderRadius="md"
        boxShadow="xl"
      >
        <Text fontSize="lg">This box changes color based on the theme mode.</Text>
      </Box> */}
    </VStack>
  );
};

export default ChakraPlayground;
