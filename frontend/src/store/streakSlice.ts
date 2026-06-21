import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { StreakState, Streak, Badge } from '../types';
import { streakService } from '../services/api';

const initialState: StreakState = {
  streak: null,
  isLoading: false,
  error: null,
};

/* --- Async Thunks --- */
export const fetchStreak = createAsyncThunk(
  'streak/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await streakService.getStreak();
      return response.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

/* --- Slice --- */
const streakSlice = createSlice({
  name: 'streak',
  initialState,
  reducers: {
    /** Set streak data locally (demo mode) */
    setStreakLocal(state, action: PayloadAction<Streak>) {
      state.streak = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    incrementStreak(state) {
      if (state.streak) {
        state.streak.currentStreak += 1;
        state.streak.lastLogDate = new Date().toISOString();
        if (state.streak.currentStreak > state.streak.longestStreak) {
          state.streak.longestStreak = state.streak.currentStreak;
        }
      }
    },
    addPoints(state, action: PayloadAction<number>) {
      if (state.streak) {
        state.streak.totalPoints += action.payload;
        state.streak.level = Math.floor(state.streak.totalPoints / 100) + 1;
      }
    },
    unlockBadge(state, action: PayloadAction<Badge>) {
      if (state.streak) {
        const existing = state.streak.badges.find(b => b.id === action.payload.id);
        if (existing) {
          existing.isUnlocked = true;
          existing.unlockedAt = new Date().toISOString();
        } else {
          state.streak.badges.push({
            ...action.payload,
            isUnlocked: true,
            unlockedAt: new Date().toISOString(),
          });
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStreak.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchStreak.fulfilled, (state, action) => {
      state.isLoading = false;
      state.streak = action.payload;
    });
    builder.addCase(fetchStreak.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setStreakLocal, incrementStreak, addPoints, unlockBadge } = streakSlice.actions;
export default streakSlice.reducer;
