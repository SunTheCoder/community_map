import React, { useState } from "react";
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Text
} from "@chakra-ui/react";
import api from "../api/api";
import { useDispatch, useSelector } from "react-redux";

const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const toast = useToast();
  const { token } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await api.post(
        "/posts",
        { title, content, image_url: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast({
        title: "Post created.",
        description: "Your post has been successfully added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
  
      // Clear the form
      setTitle("");
      setContent("");
      setImageUrl("");
  
      // Trigger refresh in CommunityFeed by calling the handler
      onPostCreated(response.data);
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "There was an error creating your post.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  return (
    <Box p={4} w="100%" maxW="500px" mx="auto" boxShadow="md" borderRadius="md">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
        Create a New Post
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="title" isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
            />
          </FormControl>

          <FormControl id="content" isRequired>
            <FormLabel>Content</FormLabel>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here"
            />
          </FormControl>

          <FormControl id="image-url">
            <FormLabel>Image URL (optional)</FormLabel>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter an image URL"
            />
          </FormControl>

          <Button type="submit" colorScheme="teal" width="full">
            Create Post
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreatePost;
