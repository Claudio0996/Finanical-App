import { createAsyncThunk } from "@reduxjs/toolkit";

import transactionService from "./transactionService";

const fetchTransactions = createAsyncThunk("transactions/fetchTransactions", async (payload, thunkApi) => {
  try {
    const transactions = await transactionService.getTransactions(payload);

    return transactions;
  } catch (err) {
    return thunkApi.rejectWithValue(err.message);
  }
});

export default fetchTransactions;
