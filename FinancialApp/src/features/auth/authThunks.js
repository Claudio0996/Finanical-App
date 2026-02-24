import { createAsyncThunk } from "@reduxjs/toolkit";

import { register, refresh } from "./authService";

export const restoreSessionThunk = createAsyncThunk("auth/restoreSessionThunk", async (payload, thunkApi) => {
  try {
    const refreshSession = await refresh();

    return refreshSession;
  } catch (err) {
    if (err instanceof TypeError) {
      return thunkApi.rejectWithValue({ silent: true, message: "Não foi possível se conectar ao servidor" });
    }
    if (err.type !== "HTTP_ERROR") {
      return thunkApi.rejectWithValue({ silent: true, message: err.message });
    }

    return thunkApi.rejectWithValue({ message: err.message });
  }
});

export const registerThunk = createAsyncThunk("auth/registerThunk", async (payload, thunkApi) => {
  try {
    const registerData = await register(payload);

    return registerData;
  } catch (err) {
    console.log(err);
    if (err instanceof TypeError) {
      return thunkApi.rejectWithValue({ silent: true, message: "Não foi possível se conectar ao servidor" });
    }
    if (err.type !== "HTTP_ERROR") {
      return thunkApi.rejectWithValue({ silent: true, message: err.message });
    }

    return thunkApi.rejectWithValue({ message: err.message });
  }
});
