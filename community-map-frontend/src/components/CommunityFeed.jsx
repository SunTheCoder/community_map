import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Textarea,
  VStack,
  Text,
  Image,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
  Spinner,
  Center,
  Flex,
} from "@chakra-ui/react";
import { FaTrash, FaEdit } from "react-icons/fa";
import ReplyForm from "./ReplyForm";
import api from "../api/api";

const CommunityFeed = ({ posts, loading }) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [editingPost, setEditingPost] = useState(null); // Post being edited
  const [postReplies, setPostReplies] = useState({}); // Store replies for each post
  const toast = useToast();

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

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      toast({ title: "Post deleted successfully", status: "success" });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({ title: "Failed to delete post", status: "error" });
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await api.delete(`/replies/${replyId}`);
      toast({ title: "Reply deleted successfully", status: "success" });
    } catch (error) {
      console.error("Error deleting reply:", error);
      toast({ title: "Failed to delete reply", status: "error" });
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
  };

  const saveEditedPost = async () => {
    try {
      await api.put(`/posts/${editingPost.id}`, { content: editingPost.content });
      toast({ title: "Post updated successfully", status: "success" });
      setEditingPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
      toast({ title: "Failed to update post", status: "error" });
    }
  };

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
            <Box key={post.id} p={4} boxShadow="md" borderRadius="md" borderWidth="1px">
              <Flex justifyContent="space-between" alignItems="center">
                {editingPost && editingPost.id === post.id ? (
                  <Textarea
                    value={editingPost.content}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, content: e.target.value })
                    }
                    mb={2}
                  />
                ) : (
                  <Text fontSize="xl" fontWeight="bold">
                    {post.title}
                  </Text>
                )}
                <Flex gap={2}>
                  <IconButton
                    size="sm"
                    icon={<FaEdit />}
                    aria-label="Edit Post"
                    onClick={() => handleEditPost(post)}
                  />
                  <IconButton
                    size="sm"
                    icon={<FaTrash />}
                    aria-label="Delete Post"
                    onClick={() => handleDeletePost(post.id)}
                  />
                </Flex>
              </Flex>
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
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text fontSize="sm" fontWeight="bold" color="gray.600">
                        {reply.username}:
                      </Text>
                      <Flex gap={2}>
                        <IconButton
                          size="xs"
                          icon={<FaEdit />}
                          aria-label="Edit Reply"
                          onClick={() => console.log("Edit Reply not implemented")}
                        />
                        <IconButton
                          size="xs"
                          icon={<FaTrash />}
                          aria-label="Delete Reply"
                          onClick={() => handleDeleteReply(reply.id)}
                        />
                      </Flex>
                    </Flex>
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
