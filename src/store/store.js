import { configureStore } from "@reduxjs/toolkit";
import { AuthApi } from "../redux/Authapi/AuthApi";

export const store = configureStore({
  reducer: {
    [AuthApi.reducerPath]: AuthApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(AuthApi.middleware),
});