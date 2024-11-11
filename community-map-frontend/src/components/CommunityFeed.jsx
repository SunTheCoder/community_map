import React, { useEffect, useState } from "react";
import { Box, VStack, Text, Image, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useToast, Spinner, Center } from "@chakra-ui/react";
import ReplyForm from "./ReplyForm";
import api from "../api/api";

const CommunityFeed = ({ posts, loading }) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [postReplies, setPostReplies] = useState({}); // Store replies for each post

  const openReplyModal = (postId) => {
    setSelectedPostId(postId);
    setIsReplyModalOpen(true);
  };

  const closeReplyModal = () => {
    setSelectedPostId(null);
    setIsReplyModalOpen(false);
  };

  const fetchReplies = async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/replies`);
      setPostReplies((prevReplies) => ({ ...prevReplies, [postId]: response.data }));
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  // Fetch replies for each post when the component mounts or `posts` change
  useEffect(() => {
    posts.forEach((post) => fetchReplies(post.id));
  }, [posts]);

  return (
    <Box w="800px" p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
        Community Feed
      </Text>
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
              <Button mt={3} size="sm" colorScheme="teal" onClick={() => openReplyModal(post.id)}>
                Reply
              </Button>

              {/* Display Replies */}
              <VStack align="start" mt={4} spacing={2}>
                {postReplies[post.id]?.map((reply) => (
                  <Box
                    key={reply.id}
                    p={3}
                    borderRadius="md"
                    borderWidth="1px"
                    w="full"
                    bg="gray.50"
                  >
                    <Text fontSize="sm" fontWeight="bold">
                      Reply:
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {reply.content}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          ))}
        </VStack>
      )}

      {/* Reply Modal */}
      <Modal isOpen={isReplyModalOpen} onClose={closeReplyModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Write a Reply</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPostId && (
              <ReplyForm
                postId={selectedPostId}
                onReplyCreated={() => {
                  fetchReplies(selectedPostId); // Refresh replies after posting
                  closeReplyModal();
                }}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CommunityFeed;
