import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, UserPreferences } from '../types';
import { authService } from '../services/api';

/* --- Initial State --- */
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('vrindashiki_token'),
  isAuthenticated: !!localStorage.getItem('vrindashiki_token'),
  isLoading: false,
  error: null,
};

/* --- Async Thunks --- */
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('vrindashiki_token', response.data.token);
      return response.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (
    { email, password, displayName }: { email: string; password: string; displayName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.signup(email, password, displayName);
      localStorage.setItem('vrindashiki_token', response.data.token);
      return response.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getProfile();
      return response.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

/* --- Slice --- */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('vrindashiki_token');
    },
    clearAuthError(state) {
      state.error = null;
    },
    /** Demo/local login for development without backend */
    setDemoUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.token = 'demo-token';
      state.isLoading = false;
      state.error = null;
    },
    updateUserPreferences(state, action: PayloadAction<Partial<UserPreferences>>) {
      if (state.user) {
        state.user.preferences = { ...state.user.preferences, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    /* Login */
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    /* Signup */
    builder.addCase(signup.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    /* Fetch Profile */
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(fetchProfile.rejected, (state) => {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('vrindashiki_token');
    });
  },
});

export const { logout, clearAuthError, setDemoUser, updateUserPreferences } = authSlice.actions;
export default authSlice.reducer;
