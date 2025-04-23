import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    jobPosition: '',
    jobDesc: '',
    experience: '',
    questions: [], // Add questions field
  },
};

const currentInterviewDetailSlice = createSlice({
  name: 'currentInterviewDetail',
  initialState,
  reducers: {
    updateCurrentInterviewDetail: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    clearCurrentInterviewDetail: (state) => {
      state.data = initialState.data;
    },
  },
});

export const { updateCurrentInterviewDetail, clearCurrentInterviewDetail } =
  currentInterviewDetailSlice.actions;

export default currentInterviewDetailSlice.reducer;