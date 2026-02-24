import { createSlice } from "@reduxjs/toolkit";
import { registerThunk, restoreSessionThunk } from "./authThunks";

const initialState = {
  authStatus: "checking",
  user: null,
  token: null,
  logoutReason: null,
  registerStatus: null,
  registerError: null,
  loginStatus: null,
  loginError: null,
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
    clearRegisterError(state, _) {
      state.registerError = null;
    },
    clearLoginError(state, _) {
      state.loginError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loginStatus = null;
      state.authStatus = "authenticated";
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loginError = null;
    });

    builder.addCase(loginThunk.pending, (state, action) => {
      state.loginStatus = "loading";
      state.loginError = null;
    });

    builder.addCase(loginThunk.rejected, (state, action) => {
      state.authStatus = "unauthenticated";
      state.loginError = action.payload.message;
      state.loginStatus = "error";
    });

    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.registerStatus = null;
      state.authStatus = "authenticated";
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.registerError = null;
      state.loginError = null;
      state.loginStatus = null;
    });

    builder.addCase(registerThunk.pending, (state, action) => {
      state.registerStatus = "loading";
      state.registerError = null;
    });

    builder.addCase(registerThunk.rejected, (state, action) => {
      state.authStatus = "unauthenticated";
      state.registerStatus = "error";
      state.registerError = action.payload.message;
    });

    builder.addCase(restoreSessionThunk.fulfilled, (state, action) => {
      state.authStatus = "authenticated";
      state.user = action.payload.user;
      state.token = action.payload.token;
    });

    builder.addCase(restoreSessionThunk.pending, (state, action) => {
      state.authStatus = "checking";
    });

    builder.addCase(restoreSessionThunk.rejected, (state, action) => {
      state.authStatus = "unauthenticated";
      state.user = null;
      state.token = null;
    });
  },
});

export const { logout, updateToken, clearRegisterError, clearLoginError } = authSlice.actions;

export default authSlice.reducer;
