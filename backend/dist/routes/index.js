"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const footprint_1 = __importDefault(require("./footprint"));
const streaks_1 = __importDefault(require("./streaks"));
const community_1 = __importDefault(require("./community"));
const router = (0, express_1.Router)();
router.use('/auth', auth_1.default);
router.use('/footprint', footprint_1.default);
router.use('/streaks', streaks_1.default);
router.use('/community', community_1.default);
/** Health check — used by Cloud Run to verify the container is alive */
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
exports.default = router;
//# sourceMappingURL=index.js.map