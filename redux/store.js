import { configureStore } from '@reduxjs/toolkit';
import currentInterviewDetailReducer from './features/currentInterviewDetailSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      currentInterviewDetail: currentInterviewDetailReducer,
    },
  });
};