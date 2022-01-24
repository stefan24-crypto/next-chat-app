import { configureStore } from "@reduxjs/toolkit";
import dataSlice from "./data-slice";
import authSlice from "./auth-slice";

const store = configureStore({
  reducer: { data: dataSlice.reducer, auth: authSlice.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
