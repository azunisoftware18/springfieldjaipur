import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import placeReducer from "./slices/placeSlice";
import bookingReducer from "./slices/bookingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    place: placeReducer,
    booking: bookingReducer
  },
});