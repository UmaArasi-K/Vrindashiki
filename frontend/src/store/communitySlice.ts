import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { CommunityState, CommunityMember, NeighborhoodChallenge } from '../types';
import { communityService } from '../services/api';

const initialState: CommunityState = {
  leaderboard: [],
  challenges: [],
  isLoading: false,
  error: null,
};

/* --- Async Thunks --- */
export const fetchLeaderboard = createAsyncThunk(
  'community/fetchLeaderboard',
  async (limit: number = 20, { rejectWithValue }) => {
    try {
      const response = await communityService.getLeaderboard(limit);
      return response.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchChallenges = createAsyncThunk(
  'community/fetchChallenges',
  async (_, { rejectWithValue }) => {
    try {
      const response = await communityService.getChallenges();
      return response.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

/* --- Slice --- */
const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    /** Set leaderboard locally (demo) */
    setLeaderboardLocal(state, action: PayloadAction<CommunityMember[]>) {
      state.leaderboard = action.payload;
    },
    setChallengesLocal(state, action: PayloadAction<NeighborhoodChallenge[]>) {
      state.challenges = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* Leaderboard */
    builder.addCase(fetchLeaderboard.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchLeaderboard.fulfilled, (state, action) => {
      state.isLoading = false;
      state.leaderboard = action.payload;
    });
    builder.addCase(fetchLeaderboard.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    /* Challenges */
    builder.addCase(fetchChallenges.fulfilled, (state, action) => {
      state.challenges = action.payload;
    });
  },
});

export const { setLeaderboardLocal, setChallengesLocal } = communitySlice.actions;
export default communitySlice.reducer;
