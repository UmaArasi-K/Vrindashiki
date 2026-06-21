/* =====================================================
   Types / DTOs — Clean Architecture Domain Models
   Single source of truth for all data shapes.
   ===================================================== */

/* --- User --- */
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  shareStreaksPublicly: boolean;
  enableNotifications: boolean;
  fitnessIntegrationConsent: boolean;
  measurementUnit: 'metric' | 'imperial';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/* --- Carbon Footprint --- */
export type EmissionCategory =
  | 'transport'
  | 'food'
  | 'energy'
  | 'shopping'
  | 'waste';

export interface FootprintEntry {
  id: string;
  userId: string;
  date: string; // ISO date string
  category: EmissionCategory;
  activity: string;
  quantity: number;
  unit: string;
  carbonKg: number; // calculated carbon in kg CO₂
  notes?: string;
  createdAt: string;
}

export interface DailySummary {
  date: string;
  totalCarbonKg: number;
  entries: FootprintEntry[];
  comparisonToAverage: number; // percentage vs user's average
}

export interface FootprintState {
  entries: FootprintEntry[];
  dailySummaries: DailySummary[];
  todayTotal: number;
  weeklyTotal: number;
  monthlyTotal: number;
  isLoading: boolean;
  error: string | null;
}

/* --- Streaks --- */
export interface Streak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string;
  totalPoints: number;
  level: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface StreakState {
  streak: Streak | null;
  isLoading: boolean;
  error: string | null;
}

/* --- Community --- */
export interface CommunityMember {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  currentStreak: number;
  totalPoints: number;
  level: number;
  rank: number;
}

export interface NeighborhoodChallenge {
  id: string;
  title: string;
  description: string;
  targetCarbonReduction: number; // in kg CO₂
  currentProgress: number;
  participants: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface CommunityState {
  leaderboard: CommunityMember[];
  challenges: NeighborhoodChallenge[];
  isLoading: boolean;
  error: string | null;
}

/* --- Notification --- */
export interface Notification {
  id: string;
  type: 'streak_reminder' | 'badge_unlocked' | 'challenge_update' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

/* --- Activity Catalog --- */
export interface ActivityOption {
  category: EmissionCategory;
  activity: string;
  unit: string;
  carbonPerUnit: number; // kg CO₂ per unit
  icon: string;
}

/* --- API Response Wrappers --- */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
}
