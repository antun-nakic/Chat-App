import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: true,
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export const selectUser = (state) => state.user; // selectors
export default userSlice.reducer;
