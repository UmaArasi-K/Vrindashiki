import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import footprintReducer from './footprintSlice';
import streakReducer from './streakSlice';
import communityReducer from './communitySlice';

/**
 * Root Redux store — combines all domain slices.
 * Uses Redux Toolkit's configureStore for built-in
 * immutability checks and thunk middleware.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    footprint: footprintReducer,
    streak: streakReducer,
    community: communityReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
