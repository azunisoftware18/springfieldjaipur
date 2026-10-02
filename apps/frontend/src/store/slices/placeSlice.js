import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPlace: null,
};

const placeSlice = createSlice({
  name: "place",

  initialState,

  reducers: {
    setCurrentPlace: (state, action) => {
      state.currentPlace = action.payload;
    },
  },
});

export const { setCurrentPlace } = placeSlice.actions;

export default placeSlice.reducer;