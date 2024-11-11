import React, { useEffect, useState } from "react";
import { Box, VStack, Text, Image, Spinner, Center } from "@chakra-ui/react";
import api from "../api/api";
import CreatePost from "./CreatePost";

const CommunityFeed = ({ posts, loading }) => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refresh, setRefresh] = useState(false); // State to trigger refresh

//   const fetchPosts = async () => {
//     setLoading(true); // Reset loading state for a better user experience
//     try {
//       const response = await api.get("/posts");
//       setPosts(response.data);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Refetch posts whenever refresh state changes
//   useEffect(() => {
//     fetchPosts();
//   }, [refresh]);

//   // Callback to handle post creation
//   const handlePostCreated = () => {
//     setRefresh((prev) => !prev); // Toggle refresh state to trigger re-fetch
//   };

  return (
    <Box w="100%" p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
        Community Feed
      </Text>
      {/* CreatePost component with callback */}
      {/* <CreatePost onPostCreated={handlePostCreated} /> */}
      {loading ? (
        <Center>
          <Spinner size="lg" />
        </Center>
      ) : (
        <VStack spacing={4} align="stretch">
          {posts.map((post) => (
            <Box
              key={post.id}
              p={4}
              boxShadow="md"
              borderRadius="md"
              borderWidth="1px"
            >
              <Text fontSize="xl" fontWeight="bold">
                {post.title}
              </Text>
              <Text fontSize="md" color="gray.600">
                {post.content}
              </Text>
              {post.image_url && (
                <Image
                  src={post.image_url}
                  alt={post.title}
                  borderRadius="md"
                  mt={2}
                  maxHeight="200px"
                  objectFit="cover"
                />
              )}
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default CommunityFeed;
