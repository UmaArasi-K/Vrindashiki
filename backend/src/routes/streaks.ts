import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import type { Streak, Badge, ApiResponse } from '../types';

const router = Router();

/** In-memory streak store — replace with Firestore */
const streaksByUser = new Map<string, Streak>();

const STARTER_BADGES: Badge[] = [
  {
    id: 'badge-first-log',
    name: 'First Step',
    description: 'Logged your first carbon footprint entry',
    icon: '🌱',
    earnedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'badge-week-streak',
    name: 'Week Warrior',
    description: 'Maintained a 7-day logging streak',
    icon: '🔥',
    earnedAt: new Date().toISOString(),
  },
];

function getUserStreak(userId: string): Streak {
  if (!streaksByUser.has(userId)) {
    streaksByUser.set(userId, {
      currentStreak: 7,
      longestStreak: 14,
      lastLoggedDate: new Date().toISOString().split('T')[0],
      badges: STARTER_BADGES,
      totalPoints: 350,
    });
  }
  return streaksByUser.get(userId)!;
}

/* ---------------------------------------------------------------
   GET /api/streaks/me
--------------------------------------------------------------- */
router.get('/me', authMiddleware, (req: AuthRequest, res: Response<ApiResponse<Streak>>) => {
  const streak = getUserStreak(req.user!.userId);
  res.json({ success: true, data: streak });
});

/* ---------------------------------------------------------------
   GET /api/streaks/badges
--------------------------------------------------------------- */
router.get('/badges', authMiddleware, (req: AuthRequest, res: Response<ApiResponse<Badge[]>>) => {
  const streak = getUserStreak(req.user!.userId);
  res.json({ success: true, data: streak.badges });
});

export default router;
