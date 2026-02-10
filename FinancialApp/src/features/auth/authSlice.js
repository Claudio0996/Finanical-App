import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authStatus: "checking",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.authStatus = "unauthenticated";
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.authStatus = "authenticated";
      state.user = action.payload;
    });

    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.authStatus = "authenticated";
      state.user = action.payload;
    });

    builder.addCase(restoreSessionThunk.fulfilled, (state, action) => {
      state.authStatus = "authenticated";
      state.user = action.payload;
    });

    builder.addCase(restoreSessionThunk.rejected, (state, action) => {
      state.authStatus = "unauthenticated";
      state.user = null;
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
