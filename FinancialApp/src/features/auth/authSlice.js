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
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.authStatus = "authenticated";
      state.user = action.payload.user;
      state.token = action.payload.token;
    });

    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.authStatus = "authenticated";
      state.user = action.payload.user;
      state.token = action.payload.token;
    });

    builder.addCase(restoreSessionThunk.fulfilled, (state, action) => {
      state.authStatus = "authenticated";
      state.user = action.payload.user;
      state.token = action.payload.token;
    });

    builder.addCase(restoreSessionThunk.rejected, (state, action) => {
      state.authStatus = "unauthenticated";
      state.user = null;
      state.token = null;
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
