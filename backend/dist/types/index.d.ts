/** Shared TypeScript interfaces used across the backend */
export interface User {
    id: string;
    email: string;
    displayName: string;
    createdAt: string;
    preferences: UserPreferences;
}
export interface UserPreferences {
    shareStreaksPublicly: boolean;
    enableNotifications: boolean;
    fitnessIntegrationConsent: boolean;
    measurementUnit: 'metric' | 'imperial';
}
export interface FootprintEntry {
    id: string;
    userId: string;
    category: string;
    subCategory: string;
    amount: number;
    unit: string;
    co2e: number;
    note?: string;
    date: string;
    createdAt: string;
}
export interface DailySummary {
    date: string;
    totalCo2e: number;
    entryCount: number;
}
export interface Streak {
    currentStreak: number;
    longestStreak: number;
    lastLoggedDate: string | null;
    badges: Badge[];
    totalPoints: number;
}
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
}
export interface CommunityMember {
    id: string;
    displayName: string;
    totalPoints: number;
    currentStreak: number;
    rank: number;
    avatar: string;
}
export interface NeighborhoodChallenge {
    id: string;
    title: string;
    description: string;
    targetCo2e: number;
    currentCo2e: number;
    participants: number;
    endsAt: string;
    joined: boolean;
}
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
/** Extends Express Request to include the decoded JWT user */
export interface AuthenticatedUser {
    userId: string;
    email: string;
}
//# sourceMappingURL=index.d.ts.map