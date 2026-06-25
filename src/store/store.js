import { configureStore } from "@reduxjs/toolkit";
import { AuthApi } from "../redux/Authapi/AuthApi";
import { SessionApi } from "../redux/SessionApi";

export const store = configureStore({
  reducer: {
    [AuthApi.reducerPath]: AuthApi.reducer,
    [SessionApi.reducerPath]: SessionApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      AuthApi.middleware,
      SessionApi.middleware
    ),
});