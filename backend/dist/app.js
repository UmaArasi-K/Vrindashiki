"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
/* ── Security & CORS ─────────────────────────────────────────── */
app.use((0, helmet_1.default)({
    // Allow serving the React app's inline scripts
    contentSecurityPolicy: false,
}));
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:8080'];
app.use((0, cors_1.default)((req, callback) => {
    const origin = req.header('Origin');
    let corsOptions;
    if (!origin) {
        corsOptions = { origin: true, credentials: true };
    }
    else if (allowedOrigins.includes(origin)) {
        corsOptions = { origin: true, credentials: true };
    }
    else {
        // Check if it is a same-origin request
        try {
            const originUrl = new URL(origin);
            const host = req.header('Host');
            if (host && originUrl.host === host) {
                corsOptions = { origin: true, credentials: true };
            }
            else {
                corsOptions = { origin: false };
            }
        }
        catch (err) {
            corsOptions = { origin: false };
        }
    }
    callback(null, corsOptions);
}));
/* ── Body Parsers ────────────────────────────────────────────── */
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
/* ── API Routes ──────────────────────────────────────────────── */
app.use('/api', routes_1.default);
/* ── Serve React SPA ─────────────────────────────────────────── */
// In the Docker image: __dirname = /app/dist, so ../frontend/dist = /app/frontend/dist
const FRONTEND_DIST = path_1.default.join(__dirname, '..', 'frontend', 'dist');
app.use(express_1.default.static(FRONTEND_DIST));
// All non-API routes fall through to index.html (React Router support)
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        res.status(404).json({ success: false, message: 'API route not found' });
        return;
    }
    res.sendFile(path_1.default.join(FRONTEND_DIST, 'index.html'));
});
/* ── Global Error Handler ────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, _req, res, _next) => {
    console.error('[Error]', err.message);
    res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});
exports.default = app;
//# sourceMappingURL=app.js.map