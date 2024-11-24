import React, { useEffect, useState } from "react";
import { Text, Box, VStack, Heading, Button, Textarea, Input, useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import api from '../api/api';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState([]);
  const [editingPost, setEditingPost] = useState(null); // Tracks the post being edited
  const [editingReply, setEditingReply] = useState(null); // Tracks the reply being edited
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userResponse = await api.get(`/auth/user`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const user = userResponse.data;
        setUserData(user);

        const profileResponse = await api.get(`/users/${user.id}/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPosts(profileResponse.data.posts || []);
        setReplies(profileResponse.data.replies || []);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditPost = (post) => {
    setEditingPost(post); // Set the post being edited
  };

  const handleEditReply = (reply) => {
    setEditingReply(reply); // Set the reply being edited
  };

  const handleUpdatePost = async () => {
    try {
      const response = await api.put(`/posts/${editingPost.id}`, {
        title: editingPost.title,
        content: editingPost.content,
      });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === editingPost.id ? response.data : post
        )
      );
      toast({ title: "Post updated successfully", status: "success" });
      setEditingPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
      toast({ title: "Failed to update post", status: "error" });
    }
  };

  const handleUpdateReply = async () => {
    try {
      const response = await api.put(`/replies/${editingReply.id}`, {
        content: editingReply.content,
      });
      setReplies((prev) =>
        prev.map((reply) =>
          reply.id === editingReply.id ? response.data : reply
        )
      );
      toast({ title: "Reply updated successfully", status: "success" });
      setEditingReply(null);
    } catch (error) {
      console.error("Error updating reply:", error);
      toast({ title: "Failed to update reply", status: "error" });
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      toast({ title: "Post deleted successfully", status: "success" });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({ title: "Failed to delete post", status: "error" });
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await api.delete(`/replies/${replyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReplies((prev) => prev.filter((reply) => reply.id !== replyId));
      toast({ title: "Reply deleted successfully", status: "success" });
    } catch (error) {
      console.error("Error deleting reply:", error);
      toast({ title: "Failed to delete reply", status: "error" });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>Error loading user data.</p>;

  return (
    <Box maxWidth="800px" margin="auto" padding={4}>
      <Heading as="h1" size="xl" mb={4}>{userData.username}'s Profile</Heading>

      <Text fontSize="lg" mb={6}>Welcome to your profile page, {userData.username}!</Text>

      <Box mb={8}>
        <Heading as="h2" size="lg" mb={3}>Your Posts</Heading>
        {posts.length > 0 ? (
          <VStack spacing={4} align="stretch">
            {posts.map((post) =>
              editingPost && editingPost.id === post.id ? (
                <Box key={post.id} p={4} borderWidth={1} borderRadius="md">
                  <Input
                    value={editingPost.title}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, title: e.target.value })
                    }
                    mb={2}
                  />
                  <Textarea
                    value={editingPost.content}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, content: e.target.value })
                    }
                  />
                  <Button mt={2} colorScheme="teal" onClick={handleUpdatePost}>
                    Save
                  </Button>
                  <Button
                    mt={2}
                    ml={2}
                    onClick={() => setEditingPost(null)}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Box key={post.id} p={4} borderWidth={1} borderRadius="md">
                  <Heading as="h3" size="md" mb={2}>{post.title}</Heading>
                  <Text mb={2}>{post.content}</Text>
                  <Button
                    size="sm"
                    onClick={() => handleEditPost(post)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    ml={2}
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete
                  </Button>
                </Box>
              )
            )}
          </VStack>
        ) : (
          <Text>You haven't created any posts yet.</Text>
        )}
      </Box>

      <Box>
        <Heading as="h2" size="lg" mb={3}>Your Replies</Heading>
        {replies.length > 0 ? (
          <VStack spacing={4} align="stretch">
            {replies.map((reply) =>
              editingReply && editingReply.id === reply.id ? (
                <Box key={reply.id} p={4} borderWidth={1} borderRadius="md">
                  <Textarea
                    value={editingReply.content}
                    onChange={(e) =>
                      setEditingReply({ ...editingReply, content: e.target.value })
                    }
                  />
                  <Button mt={2} colorScheme="teal" onClick={handleUpdateReply}>
                    Save
                  </Button>
                  <Button
                    mt={2}
                    ml={2}
                    onClick={() => setEditingReply(null)}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Box key={reply.id} p={4} borderWidth={1} borderRadius="md">
                  <Text mb={2}>{reply.content}</Text>
                  <Button
                    size="sm"
                    onClick={() => handleEditReply(reply)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    ml={2}
                    onClick={() => handleDeleteReply(reply.id)}
                  >
                    Delete
                  </Button>
                </Box>
              )
            )}
          </VStack>
        ) : (
          <Text>You haven't replied to anything yet.</Text>
        )}
      </Box>
    </Box>
  );
};

export default Profile;
