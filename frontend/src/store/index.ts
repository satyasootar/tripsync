import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import tripsReducer from "./trips-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
