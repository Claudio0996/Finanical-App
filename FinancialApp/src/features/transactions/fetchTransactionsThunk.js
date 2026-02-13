import { createAsyncThunk } from "@reduxjs/toolkit";

import transactionService from "./transactionService";

const fetchTransactions = createAsyncThunk("transactions/fetchTransactions", async (payload, thunkApi) => {
  try {
    const transactions = await transactionService.getTransactions(payload);

    return transactions;
  } catch (err) {
    if (err.type === "SESSION_EXPIRED") {
      thunkApi.dispatch(logout(err.message));
      return thunkApi.rejectWithValue({ silent: true });
    }

    return thunkApi.rejectWithValue(err.message);
  }
});

export default fetchTransactions;
