import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Structure: { [restaurantId]: { distance, duration, userLocation: { lat, lon } } }
  distances: {}
};

const distanceSlice = createSlice({
  name: 'distance',
  initialState,
  reducers: {
    setDist: (state, action) => {
      const { restaurantId, distance, duration, userLocation } = action.payload;
      state.distances[restaurantId] = {
        distance,
        duration,
        userLocation
      };
    },
    clearDistances: (state) => {
      state.distances = {};
    }
  }
});

export const { setDist, clearDistances } = distanceSlice.actions;
export default distanceSlice.reducer;
