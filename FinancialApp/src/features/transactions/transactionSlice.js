import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  fetchStatus: "idle",
  fetchError: null,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.fetchStatus = "success";
      state.items = action.payload;
      state.fetchError = null;
    });
    builder.addCase(fetchTransactions.pending, (state, action) => {
      state.fetchStatus = "loading";
      state.fetchError = null;
    });
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      state.fetchStatus = "error";
      state.fetchError = action.error;
    });
  },
});

export default transactionSlice.reducer;
