import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
  isAuthChecked: false, // 🔥 NEW
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isAuthChecked = true;
    },

    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isAuthChecked = true;
    },

    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
  },
});

export const { login, logout, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;