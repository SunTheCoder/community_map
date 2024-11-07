import axios from 'axios';
import store from './store';




// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the JWT token from Redux
api.interceptors.request.use(config => {
  const state = store.getState();
  const token = state.auth.token; // Access token from Redux state
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
