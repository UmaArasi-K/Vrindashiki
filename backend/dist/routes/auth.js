"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'vrindashiki-dev-secret-change-in-production';
/** In-memory user store — replace with Firestore in production */
const users = new Map();
function makeUser(email, displayName) {
    return {
        id: (0, uuid_1.v4)(),
        email,
        displayName,
        createdAt: new Date().toISOString(),
        preferences: {
            shareStreaksPublicly: false,
            enableNotifications: true,
            fitnessIntegrationConsent: false,
            measurementUnit: 'metric',
        },
    };
}
function signToken(userId, email) {
    return jsonwebtoken_1.default.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}
/* ---------------------------------------------------------------
   POST /api/auth/signup
--------------------------------------------------------------- */
router.post('/signup', (req, res) => {
    const { email, password, displayName } = req.body;
    if (!email || !password || !displayName) {
        res.status(400).json({ success: false, data: null, message: 'Missing required fields' });
        return;
    }
    if (users.has(email)) {
        res.status(409).json({ success: false, data: null, message: 'Email already in use' });
        return;
    }
    const user = makeUser(email, displayName);
    users.set(email, { ...user, passwordHash: password }); // plain for stub — hash with bcrypt in prod
    res.status(201).json({
        success: true,
        data: { user, token: signToken(user.id, email) },
    });
});
/* ---------------------------------------------------------------
   POST /api/auth/login
--------------------------------------------------------------- */
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ success: false, data: null, message: 'Missing email or password' });
        return;
    }
    let user = users.get(email);
    // Auto-create a demo user on first login so Cloud Run demo works end-to-end
    if (!user) {
        const newUser = makeUser(email, email.split('@')[0]);
        users.set(email, { ...newUser, passwordHash: password });
        user = { ...newUser, passwordHash: password };
    }
    if (user.passwordHash !== password) {
        res.status(401).json({ success: false, data: null, message: 'Invalid credentials' });
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    res.json({
        success: true,
        data: { user: safeUser, token: signToken(safeUser.id, email) },
    });
});
/* ---------------------------------------------------------------
   GET /api/auth/profile  (protected)
--------------------------------------------------------------- */
router.get('/profile', auth_1.authMiddleware, (req, res) => {
    const email = req.user.email;
    const stored = users.get(email);
    if (!stored) {
        res.status(404).json({ success: false, data: null, message: 'User not found' });
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = stored;
    res.json({ success: true, data: safeUser });
});
/* ---------------------------------------------------------------
   PATCH /api/auth/preferences  (protected)
--------------------------------------------------------------- */
router.patch('/preferences', auth_1.authMiddleware, (req, res) => {
    const email = req.user.email;
    const stored = users.get(email);
    if (!stored) {
        res.status(404).json({ success: false, data: null, message: 'User not found' });
        return;
    }
    stored.preferences = { ...stored.preferences, ...req.body };
    users.set(email, stored);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = stored;
    res.json({ success: true, data: safeUser });
});
exports.default = router;
//# sourceMappingURL=auth.js.map