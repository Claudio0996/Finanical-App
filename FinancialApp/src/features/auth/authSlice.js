import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authStatus: "checking",
  user: null,
  token: null,
  logoutReason: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state, action) {
      state.authStatus = "unauthenticated";
      state.user = null;
      state.token = null;
      state.logoutReason = action.payload;
    },
    updateToken(state, action) {
      state.token = action.payload;
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

export const { logout, updateToken } = authSlice.actions;

export default authSlice.reducer;
