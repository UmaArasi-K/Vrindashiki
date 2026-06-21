"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/** In-memory entry store keyed by userId — replace with Firestore */
const entriesByUser = new Map();
function getUserEntries(userId) {
    if (!entriesByUser.has(userId)) {
        // Seed with a week of demo data so the dashboard shows a chart on first load
        const seeded = [];
        const categories = ['transport', 'food', 'energy', 'shopping'];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            seeded.push({
                id: (0, uuid_1.v4)(),
                userId,
                category: categories[i % categories.length],
                subCategory: 'auto',
                amount: Math.round(Math.random() * 20 + 5),
                unit: 'km',
                co2e: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
                date: date.toISOString().split('T')[0],
                createdAt: date.toISOString(),
            });
        }
        entriesByUser.set(userId, seeded);
    }
    return entriesByUser.get(userId);
}
/* ---------------------------------------------------------------
   POST /api/footprint/entries
--------------------------------------------------------------- */
router.post('/entries', auth_1.authMiddleware, (req, res) => {
    const userId = req.user.userId;
    const { category, subCategory, amount, unit, co2e, note, date } = req.body;
    if (!category || !amount || !co2e) {
        res.status(400).json({ success: false, data: null, message: 'Missing required fields' });
        return;
    }
    const entry = {
        id: (0, uuid_1.v4)(),
        userId,
        category: category,
        subCategory: subCategory || '',
        amount: Number(amount),
        unit: unit || 'unit',
        co2e: Number(co2e),
        note,
        date: date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
    };
    getUserEntries(userId).unshift(entry);
    res.status(201).json({ success: true, data: entry });
});
/* ---------------------------------------------------------------
   GET /api/footprint/entries
--------------------------------------------------------------- */
router.get('/entries', auth_1.authMiddleware, (req, res) => {
    const userId = req.user.userId;
    let entries = getUserEntries(userId);
    const { startDate, endDate } = req.query;
    if (startDate)
        entries = entries.filter((e) => e.date >= startDate);
    if (endDate)
        entries = entries.filter((e) => e.date <= endDate);
    res.json({ success: true, data: entries });
});
/* ---------------------------------------------------------------
   GET /api/footprint/summaries
--------------------------------------------------------------- */
router.get('/summaries', auth_1.authMiddleware, (req, res) => {
    const userId = req.user.userId;
    const days = parseInt(req.query.days || '7', 10);
    const entries = getUserEntries(userId);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (days - 1));
    const cutoffStr = cutoff.toISOString().split('T')[0];
    const grouped = new Map();
    // Initialise all days with 0
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        grouped.set(key, { totalCo2e: 0, entryCount: 0 });
    }
    entries
        .filter((e) => e.date >= cutoffStr)
        .forEach((e) => {
        const g = grouped.get(e.date) ?? { totalCo2e: 0, entryCount: 0 };
        g.totalCo2e = parseFloat((g.totalCo2e + e.co2e).toFixed(2));
        g.entryCount += 1;
        grouped.set(e.date, g);
    });
    const summaries = Array.from(grouped.entries()).map(([date, g]) => ({
        date,
        ...g,
    }));
    res.json({ success: true, data: summaries });
});
/* ---------------------------------------------------------------
   DELETE /api/footprint/entries/:id
--------------------------------------------------------------- */
router.delete('/entries/:id', auth_1.authMiddleware, (req, res) => {
    const userId = req.user.userId;
    const entries = getUserEntries(userId);
    const idx = entries.findIndex((e) => e.id === req.params.id);
    if (idx === -1) {
        res.status(404).json({ success: false, data: null, message: 'Entry not found' });
        return;
    }
    entries.splice(idx, 1);
    res.json({ success: true, data: null });
});
exports.default = router;
//# sourceMappingURL=footprint.js.map