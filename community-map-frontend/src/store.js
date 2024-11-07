// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import resourceReducer from './features/resourceSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    resources: resourceReducer,
  },
});

export default store;
