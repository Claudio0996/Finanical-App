import { createAsyncThunk } from "@reduxjs/toolkit";
import Register from "../services/registerService";

export const registerThunk = createAsyncThunk(
  "auth/register",
  async ({ name, email, password, confirmPassword }, thunkAPI) => {
    try {
      const userData = await Register(name, email, password, confirmPassword);
      return userData.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);
