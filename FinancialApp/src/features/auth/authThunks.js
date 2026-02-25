import { createAsyncThunk } from "@reduxjs/toolkit";

import { register, refresh, login } from "./authService";

export const restoreSessionThunk = createAsyncThunk("auth/restoreSessionThunk", async (payload, thunkApi) => {
  try {
    const refreshSession = await refresh();

    return refreshSession;
  } catch (err) {
    if (err instanceof TypeError) {
      return thunkApi.rejectWithValue({ message: "Não foi possível se conectar ao servidor" });
    }

    return thunkApi.rejectWithValue({ message: err.message });
  }
});

export const registerThunk = createAsyncThunk("auth/registerThunk", async (payload, thunkApi) => {
  try {
    const registerData = await register(payload);

    return registerData;
  } catch (err) {
    if (err instanceof TypeError) {
      return thunkApi.rejectWithValue({ message: "Não foi possível se conectar ao servidor" });
    }

    return thunkApi.rejectWithValue({ message: err.message });
  }
});

export const loginThunk = createAsyncThunk("auth/loginThunk", async (payload, thunkApi) => {
  try {
    const loginData = await login(payload);

    return loginData;
  } catch (err) {
    if (err instanceof TypeError) {
      return thunkApi.rejectWithValue({ message: "Não foi possível se conectar ao servidor" });
    }

    return thunkApi.rejectWithValue({ message: err.message });
  }
});
