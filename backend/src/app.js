import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { CONSTANTS } from './config/constants.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import orgsRoutes from './modules/organizations/organizations.routes.js';
import projectsRoutes from './modules/projects/projects.routes.js';
import apikeysRoutes from './modules/apikeys/apikeys.routes.js';

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
app.use('/api/organizations', orgsRoutes);
app.use('/api/organizations/:orgId/api-keys', apikeysRoutes);

// ── Rate limiting — block IPs hammering the API
app.use(rateLimit({
  windowMs: CONSTANTS.RATE_LIMIT_WINDOW_MS,
  max: CONSTANTS.RATE_LIMIT_MAX_REQUESTS,
  message: { success: false, message: 'Too many requests. Slow down.' },
}));
// ── Root route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'EDRIX API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users'
    }
  });
});

// ── Health check (to verify server is alive)
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'EDRIX API is running' });
});

// ── API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/organizations/:orgId/projects', projectsRoutes);

// ── Catch all unknown routes (must be AFTER all routes)
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler (must be LAST)
app.use(errorMiddleware);

export default app;