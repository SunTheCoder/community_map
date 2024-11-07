// src/features/resourceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

// Async action to fetch resources from the API
export const fetchResources = createAsyncThunk('resources/fetchResources', async () => {
  const response = await api.get('/resources');
  return response.data;
});

const resourceSlice = createSlice({
  name: 'resources',
  initialState: {
    resourceList: [], // Initialize as an array within an object
  },
  reducers: {
    setResources: (state, action) => {
      state.resourceList = action.payload;
    },
    addResource: (state, action) => {
      state.resourceList.push(action.payload); // Add new resource to the list
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchResources.fulfilled, (state, action) => {
      state.resourceList = action.payload; // Update resourceList in the state
    });
  },
});

export const { setResources, addResource } = resourceSlice.actions;
export default resourceSlice.reducer;
