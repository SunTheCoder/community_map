import React, { useEffect, useState } from "react";
// import axios from "axios";
import { Text, Box, List, ListItem, Spinner, Center, VStack, Heading } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import api from '../api/api';

const Profile = () => {
  const [userData, setUserData] = useState(null); // Store full user data including id
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the token from Redux state
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        // Fetch user info first
        const userResponse = await api.get(`/auth/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}` // Use Redux token if available
          }
        });
        const user = userResponse.data; // Assuming the response contains user data including `id`
        setUserData(user);
        console.log("Fetched user profile:", user);
        // Fetch posts and replies based on user ID
        const profileResponse = await api.get(`/users/${user.id}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userData) {
    return <p>Error loading user data.</p>;
  }

  return (
    <Box maxWidth="800px" margin="auto" padding={4} >
  <Heading as="h1" size="xl" mb={4}>{userData.username}'s Profile</Heading>
  <Text fontSize="lg" mb={6}>Welcome to your profile page, {userData.username}!</Text>

  <Box mb={8}>
    <Heading as="h2" size="lg" mb={3}>Your Details</Heading>
    <Text>ID: {userData.id}</Text>
    <Text>Email: {userData.email || "Please Add Email"}</Text>
  </Box>

  <Box mb={8}>
    <Heading as="h2" size="lg" mb={3}>Your Posts</Heading>
    {posts.length > 0 ? (
      <VStack spacing={4} align="stretch">
        {posts.map((post) => (
          <Box key={post.id} p={4} borderWidth={1} borderRadius="md">
            <Heading as="h3" size="md" mb={2}>{post.title}</Heading>
            <Text mb={2}>{post.content}</Text>
            <Text fontSize="sm" color="gray.500">
              Created At: {new Date(post.created_at).toLocaleString()}
            </Text>
          </Box>
        ))}
      </VStack>
    ) : (
      <Text>You haven't created any posts yet.</Text>
    )}
  </Box>

  <Box>
    <Heading as="h2" size="lg" mb={3}>Your Replies</Heading>
    {replies.length > 0 ? (
      <VStack spacing={4} align="stretch">
        {replies.map((reply) => (
          <Box key={reply.id} p={4} borderWidth={1} borderRadius="md">
            <Text mb={2}>{reply.content}</Text>
            <Text fontSize="sm" color="gray.500">
              Replied to a {reply.record_type} (ID: {reply.record_id}) on{" "}
              {new Date(reply.created_at).toLocaleString()}
            </Text>
          </Box>
        ))}
      </VStack>
    ) : (
      <Text>You haven't replied to anything yet.</Text>
    )}
  </Box>
</Box>
  );
};

export default Profile;
