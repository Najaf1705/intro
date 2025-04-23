import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';

// Async thunk to fetch previous interviews
export const fetchUserPreviousInterviews = createAsyncThunk(
  'userPreviousInts/fetchUserPreviousInterviews',
  async (user, thunkAPI) => {
    // If user is not signed in, return empty array
    if (!user?.primaryEmailAddress?.emailAddress) {
      return [];
    }
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(MockInterview.createdAt));
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userPreviousIntsSlice = createSlice({
  name: 'userPreviousInts',
  initialState: {
    interviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPreviousInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPreviousInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = action.payload;
      })
      .addCase(fetchUserPreviousInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default userPreviousIntsSlice.reducer;