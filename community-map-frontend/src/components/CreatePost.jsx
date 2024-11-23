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
  Text,
  Image
} from "@chakra-ui/react";
import api from "../api/api";
import { useDispatch, useSelector } from "react-redux";

const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);


  const toast = useToast();
  const { token } = useSelector((state) => state.auth);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // Generate a preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedImageUrl = imageUrl;

    // Upload the image if a file is selected
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        const uploadResponse = await api.post("/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        uploadedImageUrl = uploadResponse.data.url; // Adjust based on your backend response
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Image Upload Failed",
          description: "There was an error uploading your image.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }

    try {
      const response = await api.post(
        "/posts",
        { title, content, image_url: uploadedImageUrl },
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
      setImageFile(null);
      setPreviewUrl(null);

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
      {/* <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
        Create a New Post
      </Text> */}
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

          <FormControl id="image-upload">
            <FormLabel>Upload Image (optional)</FormLabel>
            <Input type="file" onChange={handleFileChange} />
          </FormControl>

          {previewUrl && (
            <Box>
              <Text>Image Preview:</Text>
              <Image src={previewUrl} alt="Image preview" maxH="200px" />
            </Box>
          )}


          <Button type="submit" colorScheme="teal" width="full">
            Create Post
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreatePost;
