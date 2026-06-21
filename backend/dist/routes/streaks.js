"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/** In-memory streak store — replace with Firestore */
const streaksByUser = new Map();
const STARTER_BADGES = [
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
function getUserStreak(userId) {
    if (!streaksByUser.has(userId)) {
        streaksByUser.set(userId, {
            currentStreak: 7,
            longestStreak: 14,
            lastLoggedDate: new Date().toISOString().split('T')[0],
            badges: STARTER_BADGES,
            totalPoints: 350,
        });
    }
    return streaksByUser.get(userId);
}
/* ---------------------------------------------------------------
   GET /api/streaks/me
--------------------------------------------------------------- */
router.get('/me', auth_1.authMiddleware, (req, res) => {
    const streak = getUserStreak(req.user.userId);
    res.json({ success: true, data: streak });
});
/* ---------------------------------------------------------------
   GET /api/streaks/badges
--------------------------------------------------------------- */
router.get('/badges', auth_1.authMiddleware, (req, res) => {
    const streak = getUserStreak(req.user.userId);
    res.json({ success: true, data: streak.badges });
});
exports.default = router;
//# sourceMappingURL=streaks.js.map