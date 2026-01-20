import { createAsyncThunk } from "@reduxjs/toolkit";
import Login from "../services/loginService";

export const loginThunk = createAsyncThunk("auth/login", async ({ email, password }, thunkAPI) => {
  try {
    const userData = await Login(email, password);

    return userData;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});
