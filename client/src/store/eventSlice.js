import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchEventsByProfile = createAsyncThunk(
  'events/fetchByProfile',
  async (profileId) => {
    const response = await axios.get(`${API_URL}/events/profile/${profileId}`);
    return response.data;
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData) => {
    const response = await axios.post(`${API_URL}/events`, eventData);
    return response.data;
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ eventId, eventData }) => {
    const response = await axios.patch(`${API_URL}/events/${eventId}`, eventData);
    return response.data;
  }
);

export const fetchEventLogs = createAsyncThunk(
  'events/fetchLogs',
  async (eventId) => {
    const response = await axios.get(`${API_URL}/logs/event/${eventId}`);
    return response.data;
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    logs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsByProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventsByProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEventsByProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(fetchEventLogs.fulfilled, (state, action) => {
        state.logs = action.payload;
      });
  },
});

export default eventSlice.reducer;