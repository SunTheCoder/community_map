// import { VStack, Box, Text, Image, Button } from '@chakra-ui/react';

// const NewsFeed = ({ posts }) => {
//   return (
//     <VStack spacing={4} align="stretch">
//       {posts.map((post) => (
//         <Box key={post.id} p={5} shadow="md" borderWidth="1px" borderRadius="lg">
//           <Image borderRadius="md" src={post.image} alt={post.title} />
//           <Text fontSize="xl" fontWeight="bold" mt={2}>{post.title}</Text>
//           <Text mt={2} noOfLines={2}>{post.excerpt}</Text>
//           <Button mt={4} variant="link" colorScheme="teal">
//             Read more
//           </Button>
//         </Box>
//       ))}
//     </VStack>
//   );
// };

// export default NewsFeed;

// or

import { Box, Text, Image, Button, VStack, useBreakpointValue } from '@chakra-ui/react';

const NewsFeed = ({ posts }) => {
  return (
    <VStack spacing={4} align="stretch">
      {posts.map((post) => (
        <Box
          key={post.id}
          maxW="sm"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="lg"
          _hover={{ boxShadow: 'xl', transform: 'scale(1.02)', transition: 'transform 0.2s' }}
          p={5}
        >
          {/* Optional: Image */}
          {post.image && (
            <Image
              borderRadius="md"
              src={post.image}
              alt={post.title}
              objectFit="cover"
              boxSize="200px"
              mb={4}
            />
          )}

          {/* Title */}
          <Text fontSize="2xl" fontWeight="semibold" noOfLines={1}>
            {post.title}
          </Text>

          {/* Excerpt */}
          <Text mt={2} noOfLines={3}>
            {post.excerpt}
          </Text>

          {/* Read More Button */}
          <Button mt={4} variant="solid" colorScheme="teal" size="sm">
            Read More
          </Button>
        </Box>
      ))}
    </VStack>
  );
};
