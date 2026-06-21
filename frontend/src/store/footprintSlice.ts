import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { FootprintState, FootprintEntry, DailySummary } from '../types';
import { footprintService } from '../services/api';

/* --- Initial State --- */
const initialState: FootprintState = {
  entries: [],
  dailySummaries: [],
  todayTotal: 0,
  weeklyTotal: 0,
  monthlyTotal: 0,
  isLoading: false,
  error: null,
};

/* --- Async Thunks --- */
export const logFootprintEntry = createAsyncThunk(
  'footprint/logEntry',
  async (entry: Omit<FootprintEntry, 'id' | 'userId' | 'createdAt'>, { rejectWithValue }) => {
    try {
      const response = await footprintService.logEntry(entry);
      return response.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchEntries = createAsyncThunk(
  'footprint/fetchEntries',
  async ({ startDate, endDate }: { startDate?: string; endDate?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await footprintService.getEntries(startDate, endDate);
      return response.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchDailySummaries = createAsyncThunk(
  'footprint/fetchSummaries',
  async (days: number = 7, { rejectWithValue }) => {
    try {
      const response = await footprintService.getDailySummaries(days);
      return response.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

/* --- Helpers --- */
function calculateTotals(entries: FootprintEntry[]) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10);
  const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString().slice(0, 10);

  const todayTotal = entries
    .filter((e) => e.date.slice(0, 10) === todayStr)
    .reduce((sum, e) => sum + e.carbonKg, 0);

  const weeklyTotal = entries
    .filter((e) => e.date.slice(0, 10) >= weekAgo)
    .reduce((sum, e) => sum + e.carbonKg, 0);

  const monthlyTotal = entries
    .filter((e) => e.date.slice(0, 10) >= monthAgo)
    .reduce((sum, e) => sum + e.carbonKg, 0);

  return { todayTotal, weeklyTotal, monthlyTotal };
}

/* --- Slice --- */
const footprintSlice = createSlice({
  name: 'footprint',
  initialState,
  reducers: {
    clearFootprintError(state) {
      state.error = null;
    },
    /** Add entry locally (for demo/offline mode) */
    addEntryLocal(state, action: PayloadAction<FootprintEntry>) {
      state.entries.unshift(action.payload);
      const totals = calculateTotals(state.entries);
      Object.assign(state, totals);
    },
    /** Set summaries locally */
    setDailySummaries(state, action: PayloadAction<DailySummary[]>) {
      state.dailySummaries = action.payload;
    },
    removeEntryLocal(state, action: PayloadAction<string>) {
      state.entries = state.entries.filter(e => e.id !== action.payload);
      const totals = calculateTotals(state.entries);
      Object.assign(state, totals);
    },
  },
  extraReducers: (builder) => {
    /* Log Entry */
    builder.addCase(logFootprintEntry.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logFootprintEntry.fulfilled, (state, action) => {
      state.isLoading = false;
      state.entries.unshift(action.payload);
      const totals = calculateTotals(state.entries);
      Object.assign(state, totals);
    });
    builder.addCase(logFootprintEntry.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    /* Fetch Entries */
    builder.addCase(fetchEntries.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchEntries.fulfilled, (state, action) => {
      state.isLoading = false;
      state.entries = action.payload;
      const totals = calculateTotals(state.entries);
      Object.assign(state, totals);
    });
    builder.addCase(fetchEntries.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    /* Daily Summaries */
    builder.addCase(fetchDailySummaries.fulfilled, (state, action) => {
      state.dailySummaries = action.payload;
    });
  },
});

export const { clearFootprintError, addEntryLocal, setDailySummaries, removeEntryLocal } = footprintSlice.actions;
export default footprintSlice.reducer;
