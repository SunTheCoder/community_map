import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';
import { getResources, saveResource } from '../indexedDB'; // Import IndexedDB helper functions

// Async action to fetch resources, checking IndexedDB first
export const fetchResources = createAsyncThunk('resources/fetchResources', async () => {
  // Try to get resources from IndexedDB
  const storedResources = await getResources();
  if (storedResources.length > 0) {
    return storedResources; // Return stored resources if they exist
  }

  // If no data in IndexedDB, fetch from API
  const response = await api.get('/resources');
  
  // Save fetched resources to IndexedDB
  response.data.forEach(resource => saveResource(resource, true));
  
  return response.data;
});

const resourceSlice = createSlice({
  name: 'resources',
  initialState: {
    resourceList: [],
  },
  reducers: {
    setResources: (state, action) => {
      state.resourceList = action.payload;
    },
    addResource: (state, action) => {
      state.resourceList.push(action.payload); // Add new resource to the list
      
      // Save new resource to IndexedDB
      saveResource(action.payload);
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
