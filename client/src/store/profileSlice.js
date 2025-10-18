import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchProfiles = createAsyncThunk(
  'profiles/fetchProfiles',
  async () => {
    const response = await axios.get(`${API_URL}/profiles`);
    return response.data;
  }
);

export const createProfile = createAsyncThunk(
  'profiles/createProfile',
  async (profileData) => {
    const response = await axios.post(`${API_URL}/profiles`, profileData);
    return response.data;
  }
);

export const updateProfileTimezone = createAsyncThunk(
  'profiles/updateTimezone',
  async ({ profileId, timezone }) => {
    const response = await axios.patch(`${API_URL}/profiles/${profileId}/timezone`, { timezone });
    return response.data;
  }
);

const profileSlice = createSlice({
  name: 'profiles',
  initialState: {
    profiles: [],
    currentProfile: null,
    selectedProfiles: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentProfile: (state, action) => {
      state.currentProfile = action.payload;
    },
    setSelectedProfiles: (state, action) => {
      state.selectedProfiles = action.payload;
    },
    toggleSelectedProfile: (state, action) => {
      const profile = action.payload;
      const exists = state.selectedProfiles.some(p => p._id === profile._id);
      if (exists) {
        state.selectedProfiles = state.selectedProfiles.filter(p => p._id !== profile._id);
      } else {
        state.selectedProfiles.push(profile);
      }
    },
    resetSelectedProfiles: (state) => {
      state.selectedProfiles = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => { state.loading = true; })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.profiles.unshift(action.payload);
      })
      .addCase(updateProfileTimezone.fulfilled, (state, action) => {
        const index = state.profiles.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.profiles[index] = action.payload;

        if (state.currentProfile?._id === action.payload._id) state.currentProfile = action.payload;

        state.selectedProfiles = state.selectedProfiles.map(p =>
          p._id === action.payload._id ? action.payload : p
        );
      });
  },
});

export const { setCurrentProfile, setSelectedProfiles, toggleSelectedProfile, resetSelectedProfiles } = profileSlice.actions;
export default profileSlice.reducer;