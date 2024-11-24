import React, { useEffect, useState } from "react";
// import axios from "axios";
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
    <div>
      <h1>{userData.username}'s Profile</h1>
      <p>Welcome to your profile page, {userData.username}!</p>

      <h2>Your Posts</h2>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>Created At: {new Date(post.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't created any posts yet.</p>
      )}

      <h2>Your Replies</h2>
      {replies.length > 0 ? (
        <ul>
          {replies.map((reply) => (
            <li key={reply.id}>
              <p>{reply.content}</p>
              <small>
                Replied to a {reply.record_type} (ID: {reply.record_id}) on{" "}
                {new Date(reply.created_at).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't replied to anything yet.</p>
      )}
    </div>
  );
};

export default Profile;
