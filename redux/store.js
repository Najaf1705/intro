import { configureStore } from '@reduxjs/toolkit';
import currentInterviewDetailReducer from './features/currentInterviewDetailSlice';

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (e) {
    console.error('Could not load state', e);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (e) {
    console.error('Could not save state', e);
  }
};

export const makeStore = () => {
  const preloadedState = loadState(); // Load persisted state

  const store = configureStore({
    reducer: {
      currentInterviewDetail: currentInterviewDetailReducer,
    },
    preloadedState, // Use the loaded state
  });

  // Save state to localStorage whenever it changes
  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
};