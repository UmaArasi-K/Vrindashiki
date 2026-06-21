import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import apiRouter from './routes';

const app = express();

/* ── Security & CORS ─────────────────────────────────────────── */
app.use(
  helmet({
    // Allow serving the React app's inline scripts
    contentSecurityPolicy: false,
  })
);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:8080'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Cloud Run health checks)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

/* ── Body Parsers ────────────────────────────────────────────── */
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

/* ── API Routes ──────────────────────────────────────────────── */
app.use('/api', apiRouter);

/* ── Serve React SPA ─────────────────────────────────────────── */
// In the Docker image: __dirname = /app/dist, so ../frontend/dist = /app/frontend/dist
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist');

app.use(express.static(FRONTEND_DIST));

// All non-API routes fall through to index.html (React Router support)
app.get('*', (req: Request, res: Response) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ success: false, message: 'API route not found' });
    return;
  }
  res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
});

/* ── Global Error Handler ────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Error]', err.message);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

export default app;
