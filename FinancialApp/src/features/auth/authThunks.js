import { createAsyncThunk } from "@reduxjs/toolkit";

import { register, refresh } from "./authService";

export const restoreSessionThunk = createAsyncThunk("auth/restoreSessionThunk", async (payload, thunkApi) => {
  try {
    const refreshSession = await refresh();

    return refreshSession;
  } catch (err) {
    if (err.type !== "AUTH_ERROR") {
      return thunkApi.rejectWithValue({ silent: true });
    }

    return thunkApi.rejectWithValue(err.message);
  }
});

export const registerThunk = createAsyncThunk("auth/registerThunk", async (payload, thunkApi) => {
  try {
    const registerData = await register(payload);

    return registerData;
  } catch (err) {
    if (err.type !== "AUTH_ERROR") {
      return thunkApi.rejectWithValue({ silent: true });
    }

    return thunkApi.rejectWithValue(err.message);
  }
});
