import { createAsyncThunk } from "@reduxjs/toolkit";

import RefreshSession from "../services/refreshService";

export const restoreSessionThunk = createAsyncThunk("auth/restore", async (payload, thunkAPI) => {
  try {
    const refreshedData = await RefreshSession();
    return refreshedData.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});
