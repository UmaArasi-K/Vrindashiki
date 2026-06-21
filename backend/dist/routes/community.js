"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/** Static demo leaderboard — replace with Firestore aggregation query */
const LEADERBOARD = [
    { id: '1', displayName: 'EcoWarrior_42', totalPoints: 1240, currentStreak: 21, rank: 1, avatar: '🌍' },
    { id: '2', displayName: 'GreenLeaf_Priya', totalPoints: 980, currentStreak: 14, rank: 2, avatar: '🌿' },
    { id: '3', displayName: 'SolarPunk_Raj', totalPoints: 870, currentStreak: 12, rank: 3, avatar: '☀️' },
    { id: '4', displayName: 'CycleKing_Arun', totalPoints: 760, currentStreak: 9, rank: 4, avatar: '🚲' },
    { id: '5', displayName: 'PlantBased_Mia', totalPoints: 650, currentStreak: 7, rank: 5, avatar: '🥦' },
    { id: '6', displayName: 'ZeroWaste_Dev', totalPoints: 590, currentStreak: 6, rank: 6, avatar: '♻️' },
    { id: '7', displayName: 'WindRider_Sam', totalPoints: 530, currentStreak: 5, rank: 7, avatar: '💨' },
    { id: '8', displayName: 'TreeHugger_Jo', totalPoints: 480, currentStreak: 4, rank: 8, avatar: '🌲' },
];
/** Static neighborhood challenges */
const CHALLENGES = [
    {
        id: 'ch-1',
        title: 'Car-Free October',
        description: 'Avoid car travel for 30 days. Walk, cycle, or use public transit.',
        targetCo2e: 500,
        currentCo2e: 320,
        participants: 42,
        endsAt: new Date(Date.now() + 9 * 86400000).toISOString(),
        joined: false,
    },
    {
        id: 'ch-2',
        title: 'Meat-Free Monday',
        description: 'Log zero meat consumption every Monday for a month.',
        targetCo2e: 200,
        currentCo2e: 155,
        participants: 78,
        endsAt: new Date(Date.now() + 16 * 86400000).toISOString(),
        joined: false,
    },
    {
        id: 'ch-3',
        title: 'Neighbourhood Solar Pledge',
        description: 'Switch at least one device to renewable energy.',
        targetCo2e: 150,
        currentCo2e: 90,
        participants: 23,
        endsAt: new Date(Date.now() + 23 * 86400000).toISOString(),
        joined: false,
    },
];
const joinedChallenges = new Set();
/* ---------------------------------------------------------------
   GET /api/community/leaderboard
--------------------------------------------------------------- */
router.get('/leaderboard', auth_1.authMiddleware, (req, res) => {
    const limit = parseInt(req.query.limit || '20', 10);
    res.json({ success: true, data: LEADERBOARD.slice(0, limit) });
});
/* ---------------------------------------------------------------
   GET /api/community/challenges
--------------------------------------------------------------- */
router.get('/challenges', auth_1.authMiddleware, (_req, res) => {
    const challenges = CHALLENGES.map((c) => ({ ...c, joined: joinedChallenges.has(c.id) }));
    res.json({ success: true, data: challenges });
});
/* ---------------------------------------------------------------
   POST /api/community/challenges/:id/join
--------------------------------------------------------------- */
router.post('/challenges/:id/join', auth_1.authMiddleware, (req, res) => {
    const { id } = req.params;
    const challenge = CHALLENGES.find((c) => c.id === id);
    if (!challenge) {
        res.status(404).json({ success: false, data: null, message: 'Challenge not found' });
        return;
    }
    if (joinedChallenges.has(id)) {
        res.status(409).json({ success: false, data: null, message: 'Already joined this challenge' });
        return;
    }
    joinedChallenges.add(id);
    challenge.participants += 1;
    res.json({ success: true, data: null });
});
exports.default = router;
//# sourceMappingURL=community.js.map