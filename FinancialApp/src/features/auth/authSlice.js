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
    clearRegisterError(state, action) {
      state.registerError = null;
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(loginThunk.fulfilled, (state, action) => {
    //   state.authStatus = "authenticated";
    //   state.user = action.payload.user;
    //   state.token = action.payload.token;
    // });

    // builder.addCase(loginThunk.rejected, (state, action) => {
    //   state.authStatus = "unauthenticated";
    //   state.user = null;
    //   state.token = null;
    // });

    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.registerStatus = "registered";
      state.authStatus = "authenticated";
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.registerError = null;
      state.registerStatus = null;
    });

    builder.addCase(registerThunk.pending, (state, action) => {
      state.registerStatus = "loading";
      state.registerError = null;
    });

    builder.addCase(registerThunk.rejected, (state, action) => {
      if (action.payload?.silent) {
        state.registerStatus = "error";
        state.registerError = action.payload.message;
        return;
      }

      state.registerStatus = "error";
      state.registerError = action.payload.message;
      state.user = null;
      state.token = null;
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

export const { logout, updateToken, clearRegisterError } = authSlice.actions;

export default authSlice.reducer;
