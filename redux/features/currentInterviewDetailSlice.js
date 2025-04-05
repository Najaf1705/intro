import { createSlice } from '@reduxjs/toolkit';

const currentInterviewDetailSlice = createSlice({
  name: 'currentInterviewDetail',
  initialState: {
    data: {},
  },
  reducers: {
    updateCurrentInterviewDetail: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { updateCurrentInterviewDetail } = currentInterviewDetailSlice.actions;
export default currentInterviewDetailSlice.reducer;