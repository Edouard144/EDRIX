import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { CONSTANTS } from './config/constants.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';

// Import routes (we'll add these as we build each module)
// import authRoutes from './modules/auth/auth.routes.js';

const app = express();

// ── Security headers (helmet adds ~14 HTTP headers automatically)
app.use(helmet());

// ── Allow frontend to call this API
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies
}));

// ── Parse JSON request bodies
app.use(express.json());

// ── Log every request
app.use(loggerMiddleware);

// ── Rate limiting — block IPs hammering the API
app.use(rateLimit({
  windowMs: CONSTANTS.RATE_LIMIT_WINDOW_MS,
  max: CONSTANTS.RATE_LIMIT_MAX_REQUESTS,
  message: { success: false, message: 'Too many requests. Slow down.' },
}));
app.use('/api/auth', authRoutes);

// ── Health check (to verify server is alive)
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'EDRIX API is running' });
});

// ── Routes (uncomment as we build each module)
// app.use('/api/auth', authRoutes);

// ── Catch all unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler (must be LAST)
app.use(errorMiddleware);

export default app;