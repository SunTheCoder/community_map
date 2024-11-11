// ReplyForm.js

import React, { useState } from "react";
import { Box, VStack, FormControl, FormLabel, Textarea, Button, useToast } from "@chakra-ui/react";
import api from "../api/api";
import { useSelector } from "react-redux";

const ReplyForm = ({ postId, onReplyCreated }) => {
  const [content, setContent] = useState("");
  const toast = useToast();
  const { token } = useSelector((state) => state.auth);

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/replies",
        { content, record_type: "post", record_id: postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Reply created.",
        description: "Your reply has been successfully added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setContent(""); // Clear the form
      onReplyCreated(response.data); // Trigger the callback
    } catch (error) {
      console.error("Error creating reply:", error);
      toast({
        title: "Error",
        description: "There was an error creating your reply.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} w="100%" maxW="500px" mx="auto" boxShadow="md" borderRadius="md">
      <form onSubmit={handleReplySubmit}>
        <VStack spacing={4}>
          <FormControl id="reply-content" isRequired>
            <FormLabel>Reply</FormLabel>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your reply here"
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" width="full">
            Submit Reply
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ReplyForm;
