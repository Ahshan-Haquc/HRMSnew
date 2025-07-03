import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/auth/authSlice';
import authApi from "./features/auth/authApi";
import employeeApi from "./features/employee/employeeApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(employeeApi.middleware),
});
