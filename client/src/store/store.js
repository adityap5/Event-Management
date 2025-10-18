import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import eventReducer from './eventSlice';

const store = configureStore({
  reducer: {
    profiles: profileReducer,
    events: eventReducer,
  },
});

export default store;