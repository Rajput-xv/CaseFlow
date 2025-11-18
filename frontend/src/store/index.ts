import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import casesReducer from '@/features/cases/casesSlice';
import uploadReducer from '@/features/upload/uploadSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cases: casesReducer,
    upload: uploadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
