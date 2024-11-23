import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null, // Load token from localStorage
    user: JSON.parse(localStorage.getItem('user')) || null, // Parse user from localStorage
    isAdmin: localStorage.getItem('isAdmin') === 'true' || null, // Load admin status
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, user, isAdmin } = action.payload;

      // Update Redux state
      state.token = token;
      state.user = user;
      state.isAdmin = isAdmin;

      // Persist to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAdmin', isAdmin); // Store as string
    },
    logout: (state) => {
      // Clear Redux state
      state.token = null;
      state.user = null;
      state.isAdmin = null;

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
