import { configureStore } from '@reduxjs/toolkit';
import { formReducer } from './slices/formSlice';
import { submissionsReducer } from './slices/submissionsSlice';

/**
 * Redux store configuration
 * This store combines all reducers and configures middleware
 */
export const store = configureStore({
  reducer: {
    form: formReducer,
    submissions: submissionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 