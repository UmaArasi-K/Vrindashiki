import { Router } from 'express';
import authRoutes from './auth';
import footprintRoutes from './footprint';
import streakRoutes from './streaks';
import communityRoutes from './community';

const router = Router();

router.use('/auth', authRoutes);
router.use('/footprint', footprintRoutes);
router.use('/streaks', streakRoutes);
router.use('/community', communityRoutes);

/** Health check — used by Cloud Run to verify the container is alive */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
