import * as authService from './auth.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body, req);
    sendSuccess(res, { user }, 'Account created. Check your email.', 201);
  } catch (err) {
    next(err); // Pass to global error handler
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body, req);
    sendSuccess(res, result, 'Logged in successfully');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, 'Refresh token required', 400);
    const result = await authService.refresh(refreshToken);
    sendSuccess(res, result, 'Token refreshed');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, 'Refresh token required', 400);
    await authService.logout(refreshToken);
    sendSuccess(res, {}, 'Logged out');
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/verify-email?token=xxx
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return sendError(res, 'Token required', 400);
    await authService.verifyEmail(token);
    sendSuccess(res, {}, 'Email verified successfully');
  } catch (err) {
    next(err);
  }
};