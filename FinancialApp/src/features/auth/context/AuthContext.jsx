import { createSlice } from "@reduxjs/toolkit";
import { loginThunk } from "./loginThunk";
import { restoreSessionThunk } from "./restoreSessionThunk";
import { registerThunk } from "./registerThunk";

const initialState = {
  token: null,
  user: null,
  authStatus: "idle",
  loginStatus: "idle",
  registerError: null,
  loginError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.loginStatus = "idle";
      state.authStatus = "unauthenticated";
    },
    clearLoginError: (state) => {
      state.loginError = null;
    },
    clearRegisterError: (state) => {
      state.registerError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.token = action.payload.data.token;
      state.user = action.payload.data.user;
      state.authStatus = "authenticated";
      state.loginStatus = "succeeded";
      state.loginError = null;
    });
    builder.addCase(loginThunk.pending, (state, action) => {
      state.loginStatus = "loading";
      state.loginError = null;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      console.log(action);
      state.loginStatus = "failed";
      state.authStatus = "unauthenticated";
      state.loginError = action.payload;
    });

    builder.addCase(restoreSessionThunk.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.authStatus = "authenticated";
    });
    builder.addCase(restoreSessionThunk.pending, (state, action) => {
      state.authStatus = "checking";
    });
    builder.addCase(restoreSessionThunk.rejected, (state, action) => {
      state.authStatus = "unauthenticated";
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.token = action.payload.data.token;
      state.user = action.payload.data.user;
      state.authStatus = "authenticated";
    });
    builder.addCase(registerThunk.pending, (state, action) => {});
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.authStatus = "unauthenticated";
      state.registerError = action.payload;
    });
  },
});

export const { logout, clearLoginError, clearRegisterError } = authSlice.actions;

export default authSlice.reducer;
