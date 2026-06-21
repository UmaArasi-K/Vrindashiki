import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import type { User, ApiResponse } from '../types';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'vrindashiki-dev-secret-change-in-production';

/** In-memory user store — replace with Firestore in production */
const users = new Map<string, User & { passwordHash: string }>();

function makeUser(email: string, displayName: string): User {
  return {
    id: uuidv4(),
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

function signToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}

/* ---------------------------------------------------------------
   POST /api/auth/signup
--------------------------------------------------------------- */
router.post('/signup', (req, res: Response<ApiResponse<{ user: User; token: string }>>) => {
  const { email, password, displayName } = req.body as {
    email: string;
    password: string;
    displayName: string;
  };

  if (!email || !password || !displayName) {
    res.status(400).json({ success: false, data: null as never, message: 'Missing required fields' });
    return;
  }

  if (users.has(email)) {
    res.status(409).json({ success: false, data: null as never, message: 'Email already in use' });
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
router.post('/login', (req, res: Response<ApiResponse<{ user: User; token: string }>>) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ success: false, data: null as never, message: 'Missing email or password' });
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
    res.status(401).json({ success: false, data: null as never, message: 'Invalid credentials' });
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
router.get('/profile', authMiddleware, (req: AuthRequest, res: Response<ApiResponse<User>>) => {
  const email = req.user!.email;
  const stored = users.get(email);

  if (!stored) {
    res.status(404).json({ success: false, data: null as never, message: 'User not found' });
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safeUser } = stored;
  res.json({ success: true, data: safeUser });
});

/* ---------------------------------------------------------------
   PATCH /api/auth/preferences  (protected)
--------------------------------------------------------------- */
router.patch('/preferences', authMiddleware, (req: AuthRequest, res: Response<ApiResponse<User>>) => {
  const email = req.user!.email;
  const stored = users.get(email);

  if (!stored) {
    res.status(404).json({ success: false, data: null as never, message: 'User not found' });
    return;
  }

  stored.preferences = { ...stored.preferences, ...req.body };
  users.set(email, stored);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safeUser } = stored;
  res.json({ success: true, data: safeUser });
});

export default router;
