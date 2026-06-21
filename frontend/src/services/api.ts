import apiClient from './apiClient';
import type {
  FootprintEntry,
  DailySummary,
  Streak,
  CommunityMember,
  NeighborhoodChallenge,
  User,
  ApiResponse,
} from '../types';

/* ============================
   Auth Service
   ============================ */
export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },

  async signup(email: string, password: string, displayName: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const { data } = await apiClient.post('/auth/signup', { email, password, displayName });
    return data;
  },

  async getProfile(): Promise<ApiResponse<User>> {
    const { data } = await apiClient.get('/auth/profile');
    return data;
  },

  async updatePreferences(preferences: Partial<User['preferences']>): Promise<ApiResponse<User>> {
    const { data } = await apiClient.patch('/auth/preferences', preferences);
    return data;
  },
};

/* ============================
   Footprint Service
   ============================ */
export const footprintService = {
  async logEntry(entry: Omit<FootprintEntry, 'id' | 'userId' | 'createdAt'>): Promise<ApiResponse<FootprintEntry>> {
    const { data } = await apiClient.post('/footprint/entries', entry);
    return data;
  },

  async getEntries(startDate?: string, endDate?: string): Promise<ApiResponse<FootprintEntry[]>> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const { data } = await apiClient.get(`/footprint/entries?${params}`);
    return data;
  },

  async getDailySummaries(days?: number): Promise<ApiResponse<DailySummary[]>> {
    const { data } = await apiClient.get(`/footprint/summaries?days=${days || 7}`);
    return data;
  },

  async deleteEntry(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.delete(`/footprint/entries/${id}`);
    return data;
  },
};

/* ============================
   Streak Service
   ============================ */
export const streakService = {
  async getStreak(): Promise<ApiResponse<Streak>> {
    const { data } = await apiClient.get('/streaks/me');
    return data;
  },

  async getBadges(): Promise<ApiResponse<Streak['badges']>> {
    const { data } = await apiClient.get('/streaks/badges');
    return data;
  },
};

/* ============================
   Community Service
   ============================ */
export const communityService = {
  async getLeaderboard(limit?: number): Promise<ApiResponse<CommunityMember[]>> {
    const { data } = await apiClient.get(`/community/leaderboard?limit=${limit || 20}`);
    return data;
  },

  async getChallenges(): Promise<ApiResponse<NeighborhoodChallenge[]>> {
    const { data } = await apiClient.get('/community/challenges');
    return data;
  },

  async joinChallenge(challengeId: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post(`/community/challenges/${challengeId}/join`);
    return data;
  },
};
