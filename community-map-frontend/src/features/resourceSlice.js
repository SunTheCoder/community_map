// src/features/resourceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

export const fetchResources = createAsyncThunk('resources/fetchResources', async () => {
  const response = await api.get('/resources');
  return response.data;
});

const resourceSlice = createSlice({
  name: 'resources',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchResources.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default resourceSlice.reducer;
