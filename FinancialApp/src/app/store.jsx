import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/context/AuthContext";

const store = configureStore({
  reducer: { auth: authReducer },
});

export default store;
